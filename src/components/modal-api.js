import React from 'react'
import ModalDialog from './modal-dialog'
import UpdateMixin from '../mixins/mixin-update'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  mixins: [UpdateMixin],
  getInitialState() {
    return {}
  },
  createAPI() {
    this.props.onCreateAPI(this.state)
    this.toggle()
  },
  toggle() {
    this.refs.dialog.toggle()
  },
  render() {
    return (
      <ModalDialog ref={'dialog'}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.toggle} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h4 className="modal-title">New API</h4>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>API name</label>
            <input type="text" className="form-control" placeholder=""
              value={this.state.name} onChange={this.updateOnChange('name')} />
          </div>
          <div className="form-group">
            <label>API description</label>
            <textarea className="form-control" placeholder=""
              value={this.state.description} onChange={this.updateOnChange('description')} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={this.toggle}>Close</button>
          <button type="button" className="btn btn-success" onClick={this.createAPI}>Create API</button>
        </div>
      </ModalDialog>
    )
  }
})
