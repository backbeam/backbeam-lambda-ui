import React from 'react'
import ModalDialog from './modal-dialog'

import LambdaFunction from './modal-lambda-function'
import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  getInitialState() {
    return { functions: [] }
  },
  refreshAll() {
    if (!backbeam.getDirectory()) {
      return this.setState(this.getInitialState())
    }
    backbeam.readConfig()
      .then(data => {
        this.setState({ functions: data.lambda.functions })
      })
      .catch(errorHandler)
  },
  onDirectoryChanged() {
    this.refreshAll()
  },
  onLambdaChanged() {
    this.refreshAll()
  },
  componentWillMount() {
    this.subscriber = subscriber(this, 'directory_changed', 'lambda_changed')
    this.refreshAll()
  },
  componentWillUnmount() {
    this.subscriber.unsubscribe()
  },
  syncLambdaFunction(func) {
    backbeam.lambdaSyncFunction(func.functionName)
      .catch(errorHandler)
  },
  deleteLambdaFunction(func) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to undo the changes',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0039',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: true,
    }, function() {
      backbeam.lambdaDeleteFunction(func)
        .catch(errorHandler)
    });
  },
  render() {
    return (
      <div>
        <div className="pull-right" style={{paddingTop: 10}}>
          <button type="button" className="btn btn-primary" onClick={e => this.refs.modalLambda.toggle()}>New lambda function</button>
        </div>
        <h1>Lambda</h1><hr/>

        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Name</th>
              <th>Filename</th>
              <th>Memory</th>
              <th>Timeout</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.functions.map(func => {
              return (
                <tr key={func.functionName}>
                  <td><code>{func.functionName}</code></td>
                  <td>{func.filename}</td>
                  <td>{func.memory}</td>
                  <td>{func.timeout}</td>
                  <td className="text-right">
                    <a className="btn btn-success btn-xs" onClick={e => this.syncLambdaFunction(func)}>sync</a>
                    <a className="btn btn-primary btn-xs" onClick={e => this.refs.modalLambda.toggle(func)}>edit</a>
                    <a className="btn btn-danger btn-xs" onClick={e => this.deleteLambdaFunction(func)}>delete</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <LambdaFunction ref={'modalLambda'} />

      </div>
    )
  }
})
