<template>
  <div class="pull-right" style="padding-top: 10px">
    <button type="button" class="btn btn-primary" @click="$refs.modalEndpoint.toggle()">New API endpoint</button>
    <!-- <button type="button" class="btn btn-success">Deploy</button> -->
  </div>
  <h1>API</h1><hr/>

  <table class="table table-condensed">
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
      <tr v-for="endpoint in endpoints">
        <td><span class="label" :class="endpoint.method | apiMethodLabel">{{endpoint.method}}</span></td>
        <td><code>{{endpoint.path}}</code></td>
        <td>{{endpoint.functionName}}</td>
        <td>{{endpoint.input}}</td>
        <td>{{endpoint.output}}</td>
        <td class="text-right">
          <a class="btn btn-success btn-xs" @click="syncEndpoint(endpoint)">sync</a>
          <a class="btn btn-primary btn-xs" @click="$refs.modalEndpoint.toggle(endpoint)">edit</a>
          <a class="btn btn-danger btn-xs" @click="deleteEndpoint(endpoint)">delete</a>
        </td>
      </tr>
    </tbody>
  </table>

  <modal-api-endpoint v-ref:modal-endpoint></modal-api-endpoint>

  <div class="alert alert-info" role="alert" v-if="api">
    <p>Public base URL: https://{{api.id}}.execute-api.eu-west-1.amazonaws.com/<em>stage</em></p>
    <p>Local base URL: http://localhost:3333</p>
  </div>

</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import ApiEndpoint from './ModalApiEndpoint.vue'
import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('api', {
  data: () => ({
    endpoints: [],
    api: null,
  }),
  created() {
    this.subscriber = subscriber(this, 'directory_changed', 'api_changed')
    this.refreshAll()
  },
  destroyed() {
    this.subscriber.unsubscribe()
  },
  methods: {
    refreshAll() {
      if (!backbeam.getDirectory()) {
        this.endpoints = []
        this.api = null
        return
      }
      backbeam.readConfig()
        .then(data => {
          this.endpoints = data.api.endpoints
          this.api = data.api
        })
        .catch(errorHandler)
    },
    onDirectoryChanged() {
      this.refreshAll()
    },
    onApiChanged() {
      this.refreshAll()
    },
    syncEndpoint(endpoint) {
      backbeam.apiSyncEndpoint(endpoint, true)
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
    }
  }
})
</script>
