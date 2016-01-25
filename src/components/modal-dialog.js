import React from 'react'

var modals = []

document.addEventListener('keyup', function(e) {
  if (e.keyCode === 27 && modals.length > 0) {
    let modal = modals[modals.length - 1]
    if (modal.props.blocking) return
    modal.toggle()
  }
})

document.addEventListener('click', function(e) {
  if (e.target.matches('.modal')) {
    let modal = modals[modals.length - 1]
    if (modal.props.blocking) return
    modal.toggle()
  }
})

export default React.createClass({
  getInitialState() {
    return { open: false }
  },
  toggle() {
    if (!this.state.open) {
      this.backdrop = document.createElement('div')
      this.backdrop.className = 'modal-backdrop in'
      document.body.appendChild(this.backdrop)
      modals.forEach(function(modal) {
        modal.hide()
      })
      modals.push(this)
    } else {
      this.backdrop.parentNode.removeChild(this.backdrop)
      modals.splice(modals.length-1)
      if (modals.length > 0) {
        modals[modals.length-1].show()
      }
    }
    this.setState({ open: !this.state.open })
  },
  hide() {
    this.setState({
      open: this.state.open,
      hidden: true,
    })
  },
  show() {
    this.setState({
      open: this.state.open,
      hidden: false,
    })
  },
  render() {
    var style = {
      display: this.state.open ? 'block' : 'none',
      opacity: this.state.hidden ? 0.6 : 1,
      WebkitFilter: this.state.hidden ? 'blur(2px)' : 'none'
    }
    return (
      <div className="modal" tabIndex="-1" role="dialog" style={style}>
        <div className={'modal-dialog '+this.props.bsStyle || ''}>
          <div className="modal-content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})
