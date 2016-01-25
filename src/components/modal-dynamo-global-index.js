import React from 'react'
import ModalDialog from './modal-dialog'
import UpdateMixin from '../mixins/mixin-update'

export default React.createClass({
  mixins: [UpdateMixin],
  getInitialState() {
    return {
      name: '',
      hashKeyName: '',
      hashKeyType: 'string',
      rangeKeyName: '',
      rangeKeyType: 'string',
      readCapacity: 1,
      writeCapacity: 1,
    }
  },
  addIndex() {
    this.props.onAddGlobalIndex(this.state)
    this.toggle()
  },
  toggle() {
    this.setState(this.getInitialState())
    this.refs.dialog.toggle()
  },
  render() {
    return (
      <ModalDialog ref={'dialog'}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.toggle} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h4 className="modal-title">New global index</h4>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Index name</label>
            <input type="text" className="form-control" placeholder=""
              value={this.state.name} onChange={this.updateOnChange('name')} />
          </div>
          <div className="form-group">
            <label>Hash/partition key</label>
            <div className="row">
              <div className="col-xs-6">
                <input type="text" className="form-control" placeholder="Key name"
                  value={this.state.hashKeyName} onChange={this.updateOnChange('hashKeyName')} />
              </div>
              <div className="col-xs-6">
                <select className="form-control"
                    value={this.state.hashKeyType} onChange={this.updateOnChange('hashKeyType')}>
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="binary">binary</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Range/sort key (optional)</label>
            <div className="row">
              <div className="col-xs-6">
                <input type="text" className="form-control" placeholder="Key name"
                  value={this.state.rangeKeyName} onChange={this.updateOnChange('rangeKeyName')} />
              </div>
              <div className="col-xs-6">
                <select className="form-control"
                    value={this.state.rangeKeyType} onChange={this.updateOnChange('rangeKeyType')}>
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="binary">binary</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Provisioned throughput</label>
            <div className="row">
              <div className="col-xs-6">
                <input type="number" className="form-control" placeholder="Read capacity units"
                  value={this.state.readCapacity} onChange={this.updateOnChange('readCapacity')} />
              </div>
              <div className="col-xs-6">
                <input type="number" className="form-control" placeholder="Write capacity units"
                  value={this.state.writeCapacity} onChange={this.updateOnChange('writeCapacity')} />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={this.toggle}>Close</button>
          <button type="button" className="btn btn-primary" onClick={this.addIndex}>Add global index</button>
        </div>
      </ModalDialog>
    )
  }
})
