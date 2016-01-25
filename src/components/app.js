import React from 'react'
import { History, Link } from 'react-router'
import Navbar from './navbar'
import ProjectInit from './modal-project-init'
import ListItemDropdown from './list-item-dropdown'
import JobsConsole from './jobs-console'
import Credentials from './credentials'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  mixins: [History],
  getInitialState() {
    return {
      credentialsLoaded: false,
    }
  },
  onDirectoryChanged() {
    backbeam.readConfig()
      .then(config => {
        this.setState({ project: config.project })
        this.history.pushState(null, '/api')
      })
      .catch(errorHandler)
  },
  onCredentialsChanged() {
    this.setState(Object.assign({}, this.state, { credentialsLoaded: true }))
  },
  componentWillMount() {
    this.subscriber = subscriber(this, 'directory_changed')
    backbeam.loadCredentials()
      .then(() => this.onCredentialsChanged())
      .catch((e) => {
        this.refs.credentials.toggle()
      })
  },
  componentWillUnmount() {
    this.subscriber.unsubscribe()
  },
  showOpenDialog() {
    process.nextTick(() => {
      const dialog = electron.dialog
      const dir = dialog.showOpenDialog({
        properties: [ 'openDirectory' ],
        browserWindow: electron.getCurrentWindow()
      })
      if (!dir || dir.length === 0) return
      backbeam.setDirectory(dir[0])
    })
  },
  render() {
    return (
      <div>
        <Navbar>
          <ul className="nav navbar-nav">
            <ListItemDropdown>
              <a href="javascript:void(0)" className="dropdown-toggle" role="button" aria-haspopup="true" aria-expanded="false">
                {this.state.project || 'No project selected'} <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="javascript:void(0)">Refresh</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="javascript:void(0)" onClick={this.showOpenDialog}>Open…</a></li>
                <li><a href="javascript:void(0)" onClick={e=> this.refs.modalInit.toggle()}>New project…</a></li>
              </ul>
            </ListItemDropdown>
          </ul>
          {
            !backbeam.getDirectory() ? void(0) :
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to={'/lambda'}>Lambda</Link>
                </li>
                <li>
                  <Link to={'/api'}>API</Link>
                </li>
                <li>
                  <Link to={'/dynamo'}>Dynamo</Link>
                </li>
              </ul>
          }
        </Navbar>

        {
          this.state.credentialsLoaded
            ? <ProjectInit ref={'modalInit'} />
            : <Credentials ref={'credentials'} onCredentialsChanged={this.onCredentialsChanged} />
        }

        <div className="container" style={{paddingTop: 60}}>
          {
            this.props.children ? this.props.children : (
              <div className="text-center">
                <h1>Welcome to Backbeam lambda</h1><hr/>

                <div className="row">
                  <div className="col-sm-4 col-sm-offset-2">
                    <button className="btn btn-primary btn-lg btn-block" onClick={this.showOpenDialog}>Open a project</button>
                  </div>
                  <div className="col-sm-4">
                    <button className="btn btn-primary btn-lg btn-block" onClick={e=> this.refs.modalInit.toggle()}>Create a new project</button>
                  </div>
                </div>

                <hr/>

                <div className="row">
                  <div className="col-md-4 col-md-offset-2 col-sm-5 col-sm-offset-1">
                    <div className="panel panel-default">
                      <div className="panel-body">
                        <h2 style={{ fontSize: 80 }}><span className="fa fa-cloud-upload" /></h2>
                        <p>Create, test and deploy lambda functions</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-5">
                    <div className="panel panel-default">
                      <div className="panel-body">
                        <h2 style={{ fontSize: 80 }}><span className="fa fa-link" /></h2>
                        <p>Map lambda functions to HTTP endpoints</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 col-md-offset-2 col-sm-5 col-sm-offset-1">
                    <div className="panel panel-default">
                      <div className="panel-body">
                        <h2 style={{ fontSize: 80 }}><span className="fa fa-database" /></h2>
                        <p>Manage a local dynamodb database and sync it to the cloud</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-5">
                    <div className="panel panel-default">
                      <div className="panel-body">
                        <h2 style={{ fontSize: 80 }}><span className="fa fa-star-o" /></h2>
                        <p>Go serverless with Backbeam and Amazon Web Services</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>

        <JobsConsole />
      </div>
    )
  }
})
