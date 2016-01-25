import React from 'react'
import ModalDialog from './modal-dialog'
import ModalDynamoLocalIndex from './modal-dynamo-local-index'
import ModalDynamoGlobalIndex from './modal-dynamo-global-index'
import UpdateMixin from '../mixins/mixin-update'

export default React.createClass({
  mixins: [UpdateMixin],
  getInitialState() {
    return {
      hashKeyType: 'string',
      hashKeyName: 'string',
      localIndexes: [],
      globalIndexes: [],
    }
  },
  createTable() {
    this.props.onCreate(this.state)
    this.toggle()
  },
  onAddLocalIndex(data) {
    this.setState(Object.assign({}, this.state, {
      localIndexes: this.state.localIndexes.concat(data),
    }))
  },
  onAddGlobalIndex(data) {
    this.setState(Object.assign({}, this.state, {
      globalIndexes: this.state.globalIndexes.concat(data),
    }))
  },
  removeLocalIndex(index) {
    var arr = this.state.localIndexes.slice()
    arr.splice(arr.indexOf(index), 1)
    this.setState(Object.assign({}, this.state, {
      localIndexes: arr,
    }))
  },
  removeGlobalIndex(index) {
    var arr = this.state.globalIndexes.slice()
    arr.splice(arr.indexOf(index), 1)
    this.setState(Object.assign({}, this.state, {
      globalIndexes: arr,
    }))
  },
  toggle() {
    this.refs.dialog.toggle()
  },
  render() {
    return (
      <div>
        <ModalDialog ref={'dialog'} bsStyle={'modal-lg'}>
          <div className="modal-header">
            <button type="button" className="close" onClick={this.toggle} aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">New table</h4>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Table name</label>
              <input type="text" className="form-control" placeholder=""
                value={this.state.name} onChange={this.updateOnChange('name')} />
            </div>
            <div className="form-group">
              <label>Primary key hash/partition key</label>
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
              <label>Primary key range/sort key (optional)</label>
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
              <label>Local indexes</label>
              <div className="row">
                <div className="col-sm-8">
                  <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                    {
                      this.state.localIndexes.length === 0 ? <li>No local indexes</li> :
                      this.state.localIndexes.map((index) => (
                        <li key={index.name}>
                          <a href="javascript:void(0)"
                            onClick={e => this.removeLocalIndex(index)} style={{ marginRight: 5 }}>
                              <span className="fa fa-close" style={{ paddingRight: 3, color: 'red' }}></span>
                          </a>
                          {index.name}
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div className="col-sm-4">
                  <button className="btn btn-primary btn-block" onClick={e => this.refs.localIndexDialog.toggle()}>Add local index…</button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Global indexes</label>
              <div className="row">
                <div className="col-sm-8">
                  <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                    {
                      this.state.globalIndexes.length === 0 ? <li>No global indexes</li> :
                      this.state.globalIndexes.map((index) => (
                        <li key={index.name}>
                          <a href="javascript:void(0)"
                            onClick={e => this.removeGlobalIndex(index)} style={{ marginRight: 5 }}>
                              <span className="fa fa-close" style={{ paddingRight: 3, color: 'red' }}></span>
                          </a>
                          {index.name}
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div className="col-sm-4">
                  <button className="btn btn-primary btn-block" onClick={e => this.refs.globalIndexDialog.toggle()}>Add global index…</button>
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
            <button type="button" className="btn btn-primary" onClick={this.createTable}>Create</button>
          </div>
        </ModalDialog>

        <ModalDynamoLocalIndex ref={'localIndexDialog'} onAddLocalIndex={this.onAddLocalIndex} />
        <ModalDynamoGlobalIndex ref={'globalIndexDialog'} onAddGlobalIndex={this.onAddGlobalIndex} />

      </div>
    )
  }
})
