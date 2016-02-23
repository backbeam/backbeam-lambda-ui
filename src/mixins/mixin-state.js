export default function(data) {
  return {
    data: () => Object.assign({}, data),
    methods: {
      reset() {
        Object.keys(data).forEach((key) => {
          this[key] = data[key]
        })
      },
      load(obj) {
        Object.keys(data).forEach((key) => {
          if (key in obj) {
            this[key] = obj[key]
          }
        })
      },
      pick(...keys) {
        var obj = {}
        if (keys.length === 0) keys = Object.keys(data)
        keys.forEach((key) => {
          obj[key] = this[key]
        })
        return obj
      }
    }
  }
}
