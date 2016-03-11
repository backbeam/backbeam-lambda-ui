export default function (obj, method, ...args) {
  return new Promise((resolve, reject) => {
    obj[method].apply(obj, args.concat((err, result) => {
      if (err) return reject(err)
      resolve(result)
    }))
  })
}
