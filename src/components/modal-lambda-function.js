import React from 'react'
import ModalDialog from './modal-dialog'
import ModalRole from './modal-role'
import UpdateMixin from '../mixins/mixin-update'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  mixins: [UpdateMixin],
  getInitialState() {
    return {
      handler: 'run',
      roles: [],
      memory: 128,
      timeout: 3,
      selectedRole: null,
    }
  },
  componentWillMount() {
    this.refreshRoles()
  },
  save() {
    if (this.state.prev) {
      let state = Object.assign({}, this.state, { role: this.state.selectedRole })
      delete state.prev
      backbeam.lambdaEditFunction(this.state.prev, state)
        .then(() => this.toggle())
        .catch(errorHandler)
    } else {
      let params = Object.assign({}, this.state, { role: this.state.selectedRole })
      backbeam.lambdaCreateFunction(params)
        .then(() => {
          this.props.onCreateFunction(params)
          this.toggle()
        })
        .catch(errorHandler)
    }
  },
  onCreateRole(data) {
    backbeam.iamCreateRole(data)
      .then(res => {
        this.setState(Object.assign({}, this.state, {
          selectedRole: res.Role.Arn,
          roles: this.state.roles.concat(res.Role)
        }))
      })
      .catch(errorHandler)
  },
  refreshRoles() {
    backbeam.iamListRoles()
      .then(list => {
        let role = list.Roles[0]
        this.setState(Object.assign({}, this.state, {
          roles: list.Roles,
          selectedRole: role && role.Arn,
        }))
      })
      .catch(errorHandler)
  },
  toggle(state) {
    if (state) {
      this.setState(Object.assign({}, { prev: Object.assign({}, state) }, state))
    } else {
      this.setState(Object.assign({}, this.getInitialState(), {
        roles: this.state.roles,
        selectedRole: this.state.selectedRole,
      }))
    }
    this.refs.dialog.toggle()
  },
  render() {
    return (
      <div>
        <ModalDialog ref={'dialog'}>
          <div className="modal-header">
            <button type="button" className="close" onClick={e => this.toggle()} aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">{ this.state.prev ? 'Edit lambda function' : 'New lambda function' }</h4>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Function name</label>
              <input type="text" className="form-control" placeholder="Unique function name"
                value={this.state.functionName} onChange={this.updateOnChange('functionName')}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" placeholder="An optional description"
                value={this.state.description} onChange={this.updateOnChange('description')}
              />
            </div>
            <div className="form-group">
              <label>File name</label>
              <input type="text" className="form-control" placeholder="The entry file"
                value={this.state.filename} onChange={this.updateOnChange('filename')}
              />
            </div>
            <div className="form-group">
              <label>JavaScript method name (handler)</label>
              <input type="text" className="form-control" placeholder="JavaScript method exported from your code"
                value={this.state.handler} onChange={this.updateOnChange('handler')}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <div className="input-group">
                <select className="form-control" value={this.state.selectedRole} onChange={this.updateOnChange('selectedRole')}>
                  {
                    this.state.roles
                      .map(role => <option key={role.Arn} value={role.Arn}>{role.RoleName}</option>)
                  }
                </select>
                <span className="input-group-btn">
                  <button className="btn btn-primary" onClick={e => this.refs.modalRole.toggle()}>Create…</button>
                </span>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-xs-6">
                <label>Memory</label>
                <input type="number" className="form-control" placeholder="Memory size in MB"
                  value={this.state.memory} onChange={this.updateOnChange('memory')}
                />
              </div>
              <div className="form-group col-xs-6">
                <label>Timeout</label>
                <input type="number" className="form-control" placeholder="Maximum function execution time in seconds"
                  value={this.state.timeout} onChange={this.updateOnChange('timeout')}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={e => this.toggle()}>Close</button>
            <button type="button" className="btn btn-primary" onClick={e => this.save()}>
              { this.state.prev ? 'Save changes' : 'Create' }
            </button>
          </div>
        </ModalDialog>

        <ModalRole ref={'modalRole'} />
      </div>
    )
  }
})
