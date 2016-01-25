import React from 'react'
import ModalDialog from './modal-dialog'

import ApiEndpoint from './modal-api-endpoint'
import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

const classes = {
  POST: 'success',
  DELETE: 'danger',
}

export default React.createClass({
  getInitialState() {
    return { endpoints: [] }
  },
  refreshAll() {
    if (!backbeam.getDirectory()) {
      return this.setState(this.getInitialState())
    }
    backbeam.readConfig()
      .then(data => {
        this.setState({ endpoints: data.api.endpoints, api: data.api })
      })
      .catch(errorHandler)
  },
  onDirectoryChanged() {
    this.refreshAll()
  },
  onApiChanged() {
    this.refreshAll()
  },
  componentWillMount() {
    this.subscriber = subscriber(this, 'directory_changed', 'api_changed')
    this.refreshAll()
  },
  componentWillUnmount() {
    this.subscriber.unsubscribe()
  },
  syncEndpoint(endpoint) {
    backbeam.apiSyncEndpoint(endpoint)
      .catch(errorHandler)
  },
  deleteEndpoint(endpoint) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to undo this change',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0039',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: true,
    }, function() {
      backbeam.apiDeleteEndpoint(endpoint)
        .catch(errorHandler)
    })
  },
  render() {
    return (
      <div>
        <div className="pull-right" style={{paddingTop: 10}}>
          <button type="button" className="btn btn-primary" onClick={e => this.refs.modalEndpoint.toggle()}>New API endpoint</button>
          {
            // <button type="button" className="btn btn-success">Deploy</button>
          }
        </div>
        <h1>API</h1><hr/>

        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Method</th>
              <th>Path</th>
              <th>Function</th>
              <th>Input</th>
              <th>Output</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.endpoints.map(endpoint => {
              var labelClass
              return (
                <tr key={`${endpoint.method} ${endpoint.path}`}>
                  <td><span className={'label label-'+(classes[endpoint.method] || 'primary')}>{endpoint.method}</span></td>
                  <td><code>{endpoint.path}</code></td>
                  <td>{endpoint.functionName}</td>
                  <td>{endpoint.input}</td>
                  <td>{endpoint.output}</td>
                  <td className="text-right">
                    <a className="btn btn-success btn-xs" onClick={e => this.syncEndpoint(endpoint)}>sync</a>
                    <a className="btn btn-primary btn-xs" onClick={e => this.refs.modalEndpoint.toggle(endpoint)}>edit</a>
                    <a className="btn btn-danger btn-xs" onClick={e => this.deleteEndpoint(endpoint)}>delete</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <ApiEndpoint ref={'modalEndpoint'} />

        {
          !this.state.api ? void(0) :
          <div className="alert alert-info" role="alert">
            <p>Public base URL: https://{this.state.api.id}.execute-api.eu-west-1.amazonaws.com/<em>stage</em></p>
            <p>Local base URL: http://localhost:3333</p>
          </div>
        }

      </div>
    )
  }
})
