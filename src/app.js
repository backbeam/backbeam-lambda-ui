import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import Api from './components/api'
import Dynamo from './components/dynamo'
import App from './components/app'
import Lambda from './components/lambda'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="api" component={Api}>
      </Route>
      <Route path="dynamo" component={Dynamo}>
      </Route>
      <Route path="lambda" component={Lambda}>
      </Route>
    </Route>
  </Router>
), document.getElementById('app'))
