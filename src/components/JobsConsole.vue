<style>
.jobs-console {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #eee;
  padding-top: 20px;
}
</style>

<template>
  <div class="container jobs-console">
    <job v-for="job in jobs"
      :job-id="job.id"
      :name="job.name"
      :log="job.log"
      :progress="job.progress"
      :steps="job.steps"
    ></job>
  </div>
</template>

<script>
import Vue from 'vue'

import Job from './Job.vue'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('jobs-console', {
  data: () => ({
    jobs: []
  }),
  created() {
    this.subscriber = subscriber(this, 'job:start', 'job:succees', 'job:fail')
  },
  destroyed() {
    this.subscriber.unsubscribe()
  },
  methods: {
    findJob(id) {
      return this.jobs.find((job) => job.id === id)
    },
    onJobStart(job) {
      console.log('job started')
      this.jobs.push(Object.assign({ progress: 0 }, job))
    },
    onJobSuccees(params) {
      this.removeJob(params.id)
    },
    onJobFail(params) {
      this.removeJob(params.id)
    },
    removeJob(id) {
      var job = this.findJob(id)
      if (!job) return
      setTimeout(() => {
        this.jobs.splice(this.jobs.indexOf(job), 1)
      }, 2000)
    },
  }
})
</script>
