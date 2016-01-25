import React from 'react'
import ModalDialog from './modal-dialog'
import ModalDynamoTable from './modal-dynamo-table'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  showCreateDialog() {
    this.setState({
      localIndexes: [],
      globalIndexes: []
    })
    this.refs.modalTable.toggle()
  },
  getInitialState() {
    return { tables: [] }
  },
  refreshAll() {
    backbeam.readConfig()
      .then(data => {
        this.setState({ tables: data.dynamo.tables })
      })
      .catch(errorHandler)
  },
  onDirectoryChanged() {
    this.refreshAll()
  },
  onDynamoChanged() {
    this.refreshAll()
  },
  componentWillMount() {
    this.subscriber = subscriber(this, 'directory_changed', 'dynamo_changed')
    this.refreshAll()
  },
  componentWillUnmount() {
    this.subscriber.unsubscribe()
  },
  render() {
    function indexes(arr) {
      if (arr.length === 0) return <span>none</span>
      return (
        <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
          {
            arr.map(index => <li key={index.name}>{index.name}</li>)
          }
        </ul>
      )
    }
    return (
      <div>
        <div className="pull-right" style={{paddingTop: 10}}>
          <button type="button" className="btn btn-primary" onClick={this.showCreateDialog}>New table</button>
        </div>
        <h1>Dynamo</h1><hr/>

        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Table name</th>
              <th>Keys</th>
              <th>Local indexes</th>
              <th>Global indexes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.tables.map(table => {
              return (
                <tr key={table.name}>
                  <td><code>{table.name}</code></td>
                  <td>
                    {table.keys.map(key => {
                      return (
                        <span key={key.name}>
                          <strong>{key.name}</strong>:<em>{key.type}</em><br/>
                        </span>
                      )
                    })}
                  </td>
                  <td>{indexes(table.localIndexes)}</td>
                  <td>{indexes(table.globalIndexes)}</td>
                  <td className="text-right">
                    <a className="btn btn-primary btn-xs">edit</a>
                    <a className="btn btn-danger btn-xs">delete</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <ModalDynamoTable ref={'modalTable'} onCreate={this.onCreateTable} />
      </div>
    )
  }
})
