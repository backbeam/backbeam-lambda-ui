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
  toggle() {
    this.refs.dialog.toggle()
  },
  save() {
    backbeam.saveCredentials(this.state.accessKey, this.state.secretKey)
      .then(() => this.toggle())
      .then(() => this.props.onCredentialsChanged())
      .catch(errorHandler)
  },
  render() {
    return (
      <ModalDialog ref={'dialog'} blocking={true}>
        <div className="modal-header">
          <h4 className="modal-title">AWS credentials</h4>
        </div>
        <div className="modal-body">
          <p>
            We did not found your AWS credentials in <code>~/.aws/credentials</code>, please
            fill your AWS credentials and we will create the file for you
          </p>
          <div className="form-group">
            <label>AWS acces key id</label>
            <input type="text" className="form-control" placeholder=""
              value={this.state.accessKey} onChange={this.updateOnChange('accessKey')} />
          </div>
          <div className="form-group">
            <label>AWS secret access key</label>
            <input type="password" className="form-control" placeholder=""
              value={this.state.secretKey} onChange={this.updateOnChange('secretKey')} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={e => this.save()}>Save</button>
        </div>
      </ModalDialog>
    )
  }
})
