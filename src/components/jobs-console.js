import React from 'react'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default React.createClass({
  getInitialState() {
    return {
      jobs: [],
    }
  },
  findJob(id) {
    return this.state.jobs.filter((job) => job.id === id)[0]
  },
  onJobStart(job) {
    this.setState(Object.assign({}, this.state, {
      jobs: this.state.jobs.concat(Object.assign({ progress: 0 }, job))
    }))
  },
  onJobProgress(params) {
    var job = this.findJob(params.id)
    job.progress++
    job.log = params.log
    this.setState(Object.assign({}, this.state))
  },
  onJobSuccees(params) {
    var job = this.findJob(params.id)
    job.progress = job.steps
    job.done = true
    this.setState(Object.assign({}, this.state))
    this.removeJob(job)
  },
  onJobFail(params) {
    var job = this.findJob(params.id)
    job.failed = true
    this.setState(Object.assign({}, this.state))
    this.removeJob(job)
  },
  removeJob(job) {
    setTimeout(() => {
      var i = this.state.jobs.indexOf(job)
      var jobs = this.state.jobs.slice()
      jobs.splice(i, 1)
      this.setState(Object.assign({}, this.state, { jobs: jobs }))
    }, 2000)
  },
  componentWillMount() {
    this.subscriber = subscriber(this, 'job:start', 'job:progress', 'job:succees', 'job:fail')
  },
  componentWillUnmount() {
    this.subscriber.unsubscribe()
  },
  render() {
    return (
      <div className="container" id="jobs">
        {
          this.state.jobs.map((job) => {
            // TODO: glyphicon glyphicon-ok and glyphicon glyphicon-remove
            let clazz = 'active'
            if (job.done) {
              clazz = 'progress-bar-success'
            } else if (job.failed) {
              clazz = 'progress-bar-danger'
            }
            return (
              <div className="job" key={job.id}>
                <p><strong>{job.name}</strong>: {job.log}</p>
                <div className="progress">
                  <div className={`progress-bar progress-bar-striped ${clazz}`} role="progressbar"
                    aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{width: Math.round(job.progress*100/job.steps)+'%'}}>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  },
})
