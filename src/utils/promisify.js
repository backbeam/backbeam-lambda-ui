export default function(obj, method, ...args) {
  return new Promise(function(resolve, reject) {
    obj[method].apply(obj, args.concat(function(err, result) {
      if (err) return reject(err)
      resolve(result)
    }))
  })
}
