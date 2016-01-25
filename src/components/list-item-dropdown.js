import React from 'react'

export default React.createClass({
  componentWillMount() {
    document.addEventListener('click', e => {
      // TODO...
    })
  },
  getInitialState() {
    return { open: !!this.props.open }
  },
  toggle() {
    this.setState({ open: !this.state.open })
  },
  render() {
    return <li className={'dropdown '+(this.state.open?'open':'')}
      onClick={this.toggle}>{this.props.children}</li>
  }
})
