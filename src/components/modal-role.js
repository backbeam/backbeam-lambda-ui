import React from 'react'
import ModalDialog from './modal-dialog'
import UpdateMixin from '../mixins/mixin-update'

export default React.createClass({
  mixins: [UpdateMixin],
  getInitialState() {
    return {}
  },
  createRole() {
    this.props.onCreateRole(this.state)
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
          <h4 className="modal-title">New role</h4>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Role name</label>
            <input type="text" className="form-control" placeholder=""
              value={this.state.name} onChange={this.updateOnChange('name')} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={this.toggle}>Close</button>
          <button type="button" className="btn btn-success" onClick={this.createRole}>Create role</button>
        </div>
      </ModalDialog>
    )
  }
})
