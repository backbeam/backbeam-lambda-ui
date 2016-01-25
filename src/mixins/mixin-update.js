export default {
  updateAttribute(attr, value) {
    this.setState(Object.assign({}, this.state, { [attr]: value }))
  },
  updateOnChange(attr) {
    return function(e) {
      this.updateAttribute(attr, e.target.value)
    }.bind(this)
  }
}
