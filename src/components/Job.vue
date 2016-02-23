<template>
  <div class="job">
    <p><strong>{{name}}</strong>: {{log}}</p>
    <div class="progress">
      <div class="progress-bar progress-bar-striped" role="progressbar"
        aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"
        :class="{'progress-bar-success': done, 'progress-bar-danger': failed}"
        :style="{'width': Math.round(progress*100/steps)+'%'}">
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('job', {
  props: ['jobId', 'name', 'log', 'progress', 'steps'],
  data: () => ({
    jobId: null,
    name: null,
    log: null,
    done: false,
    failed: false,
    progress: 0,
    steps: 0,
  }),
  created() {
    this.subscriber = subscriber(this, 'job:progress', 'job:succees', 'job:fail')
  },
  destroyed() {
    this.subscriber.unsubscribe()
  },
  methods: {
    onJobProgress(params) {
      if (params.id !== this.jobId) return
      this.log = params.log
      this.progress++
    },
    onJobSuccees(params) {
      if (params.id !== this.jobId) return
      this.progress = this.steps
      this.done = true
    },
    onJobFail(params) {
      if (params.id !== this.jobId) return
      this.failed = true
    },
  }
})
</script>
