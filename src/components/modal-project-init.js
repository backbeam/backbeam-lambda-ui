import React from 'react'
import ModalDialog from './modal-dialog'
import ModalAPI from './modal-api'
import ModalRole from './modal-role'
import UpdateMixin from '../mixins/mixin-update'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  mixins: [UpdateMixin],
  componentWillMount() {
    this.refreshApis()
  },
  getInitialState() {
    return {
      region: backbeam.getRegion(),
      directory: '',
      selectedApi: null,
      apis: [],
    }
  },
  refreshApis() {
    backbeam.apiList()
      .then(list => {
        this.setState(Object.assign({}, this.state, {
          apis: list.items,
          selectedApi: list.items[0],
        }))
      })
      .catch(errorHandler)
  },
  onRegionChange(region) {
    backbeam.setRegion(region)
    this.setState(Object.assign({}, this.state, {
      region,
      apis: [],
    }))
    this.refreshApis()
  },
  onCreateAPI(data) {
    backbeam.apiCreate(data)
      .then(api => {
        this.setState(Object.assign({}, this.state, {
          selectedApi: api,
          apis: this.state.apis.concat(api)
        }))
      })
      .catch(errorHandler)
  },
  showOpenDialog() {
    const dialog = electron.dialog
    const dir = dialog.showOpenDialog({
      properties: [ 'openDirectory', 'createDirectory' ],
      browserWindow: electron.getCurrentWindow()
    })
    if (!dir || dir.length === 0) return
    this.updateAttribute('directory', dir[0])
  },
  toggle() {
    this.refs.dialog.toggle()
  },
  init() {
    const dir = this.state.directory
    const params = {
      api: this.state.selectedApi,
      name: this.state.name,
      region: this.state.region,
    }
    backbeam.init(dir, params)
      .then(() => {
        this.toggle()
        sweetAlert('Success', 'Run `npm install` to install dependencies', 'success')
      })
      .catch(errorHandler)
  },
  render() {
    return (
      <div>
        <ModalDialog ref={'dialog'} bsStyle={'modal-lg'}>
          <div className="modal-header">
            <button type="button" className="close" onClick={e => this.refs.dialog.toggle()} aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">New project</h4>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" placeholder="" value={this.state.name} onChange={this.updateOnChange('name')} />
            </div>
            <div className="form-group">
              <label>Directory</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="" value={this.state.directory} onChange={this.updateOnChange('directory')} />
                <span className="input-group-btn">
                  <button className="btn btn-primary" onClick={this.showOpenDialog}>Choose…</button>
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>Region</label>
              <select className="form-control" value={this.state.region} onChange={e => this.onRegionChange(e.target.value)}>
                {
                  ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
                    .map(region => <option key={region} value={region}>{region}</option>)
                }
              </select>
            </div>
            <div className="form-group">
              <label>API</label>
              <div className="input-group">
                <select className="form-control" value={this.state.selectedApi} onChange={this.updateOnChange('selectedApi')}>
                  {
                    this.state.apis
                      .map(api => <option key={api.id} value={api.id}>{api.name}</option>)
                  }
                </select>
                <span className="input-group-btn">
                  <button className="btn btn-primary" onClick={e=> this.refs.modalAPI.toggle()}>Create…</button>
                </span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={e => this.refs.dialog.toggle()}>Close</button>
            <button type="button" className="btn btn-primary" onClick={e => this.init()}>Create</button>
          </div>
        </ModalDialog>

        <ModalAPI ref={'modalAPI'} onCreateAPI={this.onCreateAPI} />

        <ModalRole ref={'modalRole'} onCreateRole={this.onCreateRole} />
      </div>
    )
  }
})
