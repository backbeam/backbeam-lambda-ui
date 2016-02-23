<template>
  <modal-dialog v-ref:dialog bs-style="modal-lg">
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">New table</h4>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Table name</label>
        <input type="text" class="form-control" placeholder="" v-model="name">
      </div>
      <div class="form-group">
        <label>Primary key hash/partition key</label>
        <div class="row">
          <div class="col-xs-6">
            <input type="text" class="form-control" placeholder="Key name" v-model="hashKeyName">
          </div>
          <div class="col-xs-6">
            <select class="form-control" v-model="hashKeyType">
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="binary">binary</option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Primary key range/sort key (optional)</label>
        <div class="row">
          <div class="col-xs-6">
            <input type="text" class="form-control" placeholder="Key name" v-model="rangeKeyName">
          </div>
          <div class="col-xs-6">
            <select class="form-control" v-model="rangeKeyType">
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="binary">binary</option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Local indexes</label>
        <div class="row">
          <div class="col-sm-8">
            <ul style="list-style-type: none; margin: 0; padding: 0">
              <li v-if="localIndexes.length === 0">No local indexes</li>
              <li v-for="index in localIndexes">
                <a href="#"
                  @click.prevent="removeLocalIndex(index)" style="margin-right: 5px">
                    <span class="fa fa-close" style="padding-right: 3px; color: red"></span>
                </a>
                {{index.name}}
              </li>
            </ul>
          </div>
          <div class="col-sm-4">
            <button class="btn btn-primary btn-block" @click="$refs.localIndexDialog.toggle()">Add local index…</button>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Global indexes</label>
        <div class="row">
          <div class="col-sm-8">
            <ul style="list-style-type: none; margin: 0; padding: 0">
              <li v-if="globalIndexes.length === 0">No global indexes</li>
              <li v-for="index in globalIndexes">
                <a href="#"
                  @click.prevent="removeGlobalIndex(index)" style="margin-right: 5px">
                    <span class="fa fa-close" style="padding-right: 3px; color: red"></span>
                </a>
                {{index.name}}
              </li>
            </ul>
          </div>
          <div class="col-sm-4">
            <button class="btn btn-primary btn-block" @click="$refs.globalIndexDialog.toggle()">Add global index…</button>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Provisioned throughput</label>
        <div class="row">
          <div class="col-xs-6">
            <input type="number" class="form-control" placeholder="Read capacity units" v-model="readCapacity" number>
          </div>
          <div class="col-xs-6">
            <input type="number" class="form-control" placeholder="Write capacity units" v-model="writeCapacity" number>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="toggle">Close</button>
      <button type="button" class="btn btn-primary" @click="createTable">Create</button>
    </div>
  </modal-dialog>

  <modal-dynamo-local-index v-ref:local-index-dialog @add-local-index="onAddLocalIndex"></modal-dynamo-local-index>
  <modal-dynamo-global-index v-ref:global-index-dialog @add-global-index="onAddGlobalIndex"></modal-dynamo-global-index>

</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import ModalDynamoLocalIndex from './ModalDynamoLocalIndex.vue'
import ModalDynamoGlobalIndex from './ModalDynamoGlobalIndex.vue'

import MixinState from '../mixins/mixin-state'

export default Vue.component('modal-dynamo-table', {
  mixins: [MixinState({
    name: '',
    rangeKeyName: null,
    rangeKeyType: null,
    hashKeyType: 'string',
    hashKeyName: null,
    localIndexes: [],
    globalIndexes: [],
    readCapacity: 1,
    writeCapacity: 1,
  })],
  methods: {
    createTable() {
      this.$dispatch('create-table', this.pick())
      this.toggle()
    },
    onAddLocalIndex(data) {
      this.localIndexes.push(data)
    },
    onAddGlobalIndex(data) {
      this.globalIndexes.push(data)
    },
    removeLocalIndex(index) {
      this.localIndexes.splice(this.localIndexes.indexOf(index), 1)
    },
    removeGlobalIndex(index) {
      this.globalIndexes.splice(this.globalIndexes.indexOf(index), 1)
    },
    toggle() {
      this.reset()
      this.$refs.dialog.toggle()
    },
  }
})
</script>
