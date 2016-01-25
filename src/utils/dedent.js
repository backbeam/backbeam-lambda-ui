export default function dedent(strings, ...values) {
  var str = ''
  for (var i = 0; i < strings.length-1; i++) {
    str += strings[i]
    str += values[i]
  }
  str += strings[strings.length-1]
  var lines = str.split('\n')
  var i
  var indent
  for (i = 0; i < lines.length; i++) {
    var line = lines[i]
    if (line.trim().length !== 0) {
      indent = line.substring(0, line.length - line.trimLeft().length)
      break
    }
  }
  for (var n = lines.length - 1; n >= 0; n--) {
    if (lines[n].trim().length > 0) break
  }
  return lines.splice(i, n - i + 1).map(s => s.substring(indent.length)).join('\n')
}
