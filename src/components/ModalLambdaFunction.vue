<template>
  <modal-dialog v-ref:dialog>
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">{{ prev ? 'Edit lambda function' : 'New lambda function' }}</h4>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Function name</label>
        <input type="text" class="form-control" placeholder="Unique function name" v-model="functionName">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="form-control" placeholder="An optional description" v-model="description"></textarea>
      </div>
      <div class="form-group">
        <label>File name</label>
        <input type="text" class="form-control" placeholder="The entry file" v-model="filename">
      </div>
      <div class="form-group">
        <label>JavaScript method name (handler)</label>
        <input type="text" class="form-control" placeholder="JavaScript method exported from your code" v-model="handler">
      </div>
      <div class="form-group">
        <label>Role</label>
        <div class="input-group">
          <select class="form-control" v-model="role">
            <option v-for="role in roles" :value="role.Arn">{{role.RoleName}}</option>
          </select>
          <span class="input-group-btn">
            <button class="btn btn-primary" @click="$refs.modalRole.toggle()">Create…</button>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-xs-6">
          <label>Memory</label>
          <input type="number" class="form-control" placeholder="Memory size in MB" v-model="memory" number>
        </div>
        <div class="form-group col-xs-6">
          <label>Timeout</label>
          <input type="number" class="form-control" placeholder="Maximum function execution time in seconds" v-model="timeout" number>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="toggle">Close</button>
      <button type="button" class="btn btn-primary" @click="save">
        {{ prev ? 'Save changes' : 'Create' }}
      </button>
    </div>
  </modal-dialog>

  <modal-role v-ref:modal-role @create-role="onCreateRole"></modal-role>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import ModalRole from './ModalRole.vue'

import MixinState from '../mixins/mixin-state'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('modal-lambda-function', {
  mixins: [MixinState({
    prev: null,
    handler: 'run',
    roles: [],
    memory: 128,
    timeout: 3,
    filename: null,
    description: null,
    functionName: null,
    role: null,
  })],
  methods: {
    toggle(func) {
      if (func) {
        this.prev = func
        this.load(func)
      } else {
        this.reset()
      }
      this.$refs.dialog.toggle()
      this.refreshRoles()
    },
    save() {
      let params = this.pick('functionName', 'handler', 'role', 'description', 'memory', 'timeout', 'filename')
      if (this.prev) {
        backbeam.lambdaEditFunction(this.prev, params)
          .then(() => this.toggle())
          .catch(errorHandler)
      } else {
        backbeam.lambdaCreateFunction(params)
          .then(() => {
            // this.props.onCreateFunction(params)
            this.toggle()
          })
          .catch(errorHandler)
      }
    },
    onCreateRole(data) {
      backbeam.iamCreateRole(data)
        .then(res => {
          this.roles.push(res.Role)
          this.role = res.Role.Arn
        })
        .catch(errorHandler)
    },
    refreshRoles() {
      backbeam.iamListRoles()
        .then((list) => {
          let role = list.Roles[0]
          this.roles = list.Roles
          this.role = this.role || (role && role.Arn)
        })
        .catch(errorHandler)
    },
  }
})
</script>
