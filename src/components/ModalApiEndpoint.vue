<template>
  <modal-dialog v-ref:dialog>
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">{{ prev ? 'Edit API endpoint' : 'New API endpoint' }}</h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="form-group col-xs-3">
          <label>HTTP method</label>
          <select class="form-control" v-model="method">
            <option :value="method" v-for="method in ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS']">{{method}}</option>
          </select>
        </div>
        <div class="form-group col-xs-9">
          <label>HTTP path</label>
          <input type="text" class="form-control" placeholder="/foo/bar" v-model="path">
        </div>
      </div>
      <div class="form-group">
        <label>Lambda function</label>
        <div class="input-group">
          <select class="form-control" v-model="functionName">
            <option :value="func.functionName" v-for="func in functions">{{func.functionName}}</option>
          </select>
          <span class="input-group-btn">
            <button class="btn btn-primary" @click="$refs.modalLambda.toggle()">Create…</button>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-xs-6">
          <label>HTTP input Content-Type</label>
          <select class="form-control" v-model="input">
            <option value="json" selected>JSON</option>
            <option value="form">Form</option>
          </select>
        </div>
        <div class="form-group col-xs-6">
          <label>HTTP output Content-Type</label>
          <select class="form-control" v-model="output">
            <option value="json" selected>JSON</option>
            <option value="html">HTML</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="toggle">Close</button>
      <button type="button" class="btn btn-primary" @click="save">{{ prev ? 'Save changes' : 'Create' }}</button>
    </div>
  </modal-dialog>

  <modal-lambda-function v-ref:modal-lambda @create-function="onCreateFunction"></modal-lambda-function>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import LambdaFunction from './ModalLambdaFunction.vue'

import MixinState from '../mixins/mixin-state'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('modal-api-endpoint', {
  mixins: [MixinState({
    prev: null,
    method: 'GET',
    handler: 'run',
    path: '/',
    filename: 'entity-action.js',
    functions: [],
    input: 'json',
    output: 'json',
    functionName: null,
  })],
  methods: {
    save() {
      let params = this.pick('method', 'handler', 'path', 'filename', 'functionName', 'input', 'output')
      if (this.prev) {
        backbeam.apiEditEndpoint(this.prev, params)
          .then(() => this.toggle())
          .catch(errorHandler)
      } else {
        backbeam.apiCreateEndpoint(params)
          .then(() => this.toggle())
          .catch(errorHandler)
      }
    },
    toggle(endpoint) {
      if (endpoint) {
        this.prev = endpoint
        this.load(endpoint)
      } else {
        this.reset()
      }
      this.$refs.dialog.toggle()
      this.refresh()
    },
    refresh() {
      backbeam.readConfig()
        .then((config) => {
          this.functions = config.lambda.functions
          if (!this.functionName) {
            let func = config.lambda.functions[0]
            this.functionName = func && func.functionName
          }
        })
    },
    onCreateFunction(func) {
      this.functions.push(func)
      this.functionName = func && func.functionName
    }
  }
})
</script>
