import React from 'react'
import ModalDialog from './modal-dialog'
import UpdateMixin from '../mixins/mixin-update'
import LambdaFunction from './modal-lambda-function'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  mixins: [UpdateMixin],
  getInitialState() {
    return {
      method: 'GET',
      handler: 'run',
      path: '/',
      filename: 'entity-action.js',
      functions: [],
    }
  },
  save() {
    if (this.state.prev) {
      let state = Object.assign({}, this.state)
      delete state.prev
      backbeam.apiEditEndpoint(this.state.prev, state)
        .then(() => this.toggle())
        .catch(errorHandler)
    } else {
      backbeam.apiCreateEndpoint(this.state)
        .then(() => this.toggle())
        .catch(errorHandler)
    }
  },
  componentWillMount() {
    backbeam.readConfig()
      .then((config) => {
        let func = config.lambda.functions[0]
        this.setState(Object.assign({}, this.state, {
          functions: config.lambda.functions,
          functionName: func && func.functionName,
        }))
      })
  },
  toggle(state) {
    state = state || this.getInitialState()
    let func = this.state.functions[0]
    this.setState(Object.assign({}, this.getInitialState(), {
      functions: this.state.functions,
      functionName: func && func.functionName,
    }))
    this.refs.dialog.toggle()
  },
  onCreateFunction(func) {
    this.setState(Object.assign({}, this.state, {
      functions: this.state.functions.concat(func),
      functionName: func && func.functionName,
    }))
  },
  render() {
    return (
      <div>
        <ModalDialog ref={'dialog'}>
          <div className="modal-header">
            <button type="button" className="close" onClick={e => this.toggle()} aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">{ this.state.prev ? 'Edit API endpoint' : 'New API endpoint' }</h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="form-group col-xs-3">
                <label>HTTP method</label>
                <select className="form-control" value={this.state.method} onChange={this.updateOnChange('method')}>
                  {
                    ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS']
                      .map(method => <option value={method} key={method}>{method}</option>)
                  }
                </select>
              </div>
              <div className="form-group col-xs-9">
                <label>HTTP path</label>
                <input type="text" className="form-control" placeholder="/foo/bar"
                  value={this.state.path} onChange={this.updateOnChange('path')}
                  />
              </div>
            </div>
            <div className="form-group">
              <label>Lambda function</label>
              <div className="input-group">
                <select className="form-control" value={this.state.functionName} onChange={this.updateOnChange('functionName')}>
                  {
                    this.state.functions
                      .map(func => (
                        <option key={func.functionName} value={func.functionName}>
                          {func.functionName}
                        </option>
                      ))
                  }
                </select>
                <span className="input-group-btn">
                  <button className="btn btn-primary" onClick={e=> this.refs.modalLambda.toggle()}>Create…</button>
                </span>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-xs-6">
                <label>HTTP input Content-Type</label>
                <select className="form-control" value={this.state.input} onChange={this.updateOnChange('input')}>
                  <option value="json">JSON</option>
                  <option value="form">Form</option>
                </select>
              </div>
              <div className="form-group col-xs-6">
                <label>HTTP output Content-Type</label>
                <select className="form-control" value={this.state.output} onChange={this.updateOnChange('output')}>
                  <option value="json">JSON</option>
                  <option value="html">HTML</option>
                </select>
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

        <LambdaFunction ref={'modalLambda'} onCreateFunction={this.onCreateFunction} />

      </div>
    )
  }
})
