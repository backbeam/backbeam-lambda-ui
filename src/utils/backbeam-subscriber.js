import backbeam from '../utils/backbeam-singleton'

var uppercamelcase = require('uppercamelcase')

export default function(component, ...events) {

  component.listeners = {}
  events.forEach(event => {
    let listener = (...args) => {
      let methodName = 'on'+uppercamelcase(event.replace(/\W/g, '_'))
      if (!component[methodName]) {
        console.error(`Listener ${component} does not listen properly to ${methodName}`)
        return
      }
      component[methodName].apply(component, args)
    }
    component.listeners[event] = listener
    backbeam.on(event, listener)
  })

  return {
    unsubscribe: function() {
      Object.keys(component.listeners).forEach(event => {
        backbeam.removeListener(event, component.listeners[event])
      })
    }
  }
}
