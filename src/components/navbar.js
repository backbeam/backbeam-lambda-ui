import React from 'react'

export default React.createClass({
  getInitialState() {
    return { open: !!this.props.open }
  },
  toggle() {
    this.setState({ open: !this.state.open })
  },
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" onClick={this.toggle} aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="javascript:void(0)">backbeam λ</a>
          </div>
          <div id="navbar" className={'navbar-collapse collapse '+(this.state.open?'in':'')}>
            {this.props.children}
          </div>
        </div>
      </nav>
    )
  }
})
