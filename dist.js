var path = require('path')
var pync = require('pync')
var pify = require('pify')
var packager = pify(require('electron-packager'))
var package = require('./package.json')
var tag = 'v'+package.version

var deps = package.dependencies
var electronVersion = deps['electron-prebuilt'].match(/[\d\.]+/)[0]
var dist = path.join(__dirname, '../backbeam-lambda-ui-dist')

var exec = pify(require('child_process').exec)

function generate() {
  console.log('Generating distribution files')
  return packager({
    // all: true,
    arch: 'x64',
    platform: 'linux,win32,darwin',
    dir: __dirname,
    'app-bundle-id': 'io.backbeam.lambda',
    'app-category-type': 'public.app-category.developer-tools',
    'app-copyright': 'Level Apps S.L.',
    'app-version': package.version,
    'icon': path.join(__dirname, 'icon', 'backbeam-lambda'),
    'out': dist,
    'version': electronVersion,
    'overwrite': true,
    'name': 'Backbeam Lambda',
    'ignore': ['/src($|/)', '/screenshots($|/)'],
  })
}

function zipFiles(paths) {
  console.log('Zipping files')
  return pync.map(paths, (appPath) => (
    exec(`zip -qr "${appPath}.zip" "${appPath}"`)
  ))
  .then(() => paths)
}

function tagRepo() {
  console.log('Creating git tag', tag)
  exec(`git tag ${tag}`)
    .then(() => exec('git push --tags'))
    .then(() => paths)
}

// https://github.com/aktau/github-release
function release(paths) {
  console.log('Creating GitHub release')
  exec(`github-release release \
        --user backbeam \
        --repo backbeam-lambda-ui \
        --tag ${tag} \
        --name "Backbeam Lambda ${tag}" \
        --description "Released Backbeam Lambda ${tag}" \
        --pre-release`)
  .then(() => {
    pync.series(paths, (file) => {
      exec(`github-release upload \
            --user backbeam \
            --repo backbeam-lambda-ui \
            --tag ${tag} \
            --name "${path.dirname(file)}.zip" \
            --file "${file}"`)
    })
  })
}

if (module.id === require.main.id) {
  exec(`rm -rf "${dist}"`)
    .then(() => generate())
    .then((paths) => (
      zipFiles(paths)
        .then(() => tagRepo())
        .then(() => release(paths))
    ))
    .catch((err) => console.error(err.stack))
}
