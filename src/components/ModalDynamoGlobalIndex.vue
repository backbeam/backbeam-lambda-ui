<template>
  <modal-dialog v-ref:dialog>
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">New global index</h4>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Index name</label>
        <input type="text" class="form-control" placeholder="" v-model="name">
      </div>
      <div class="form-group">
        <label>Hash/partition key</label>
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
        <label>Range/sort key (optional)</label>
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
      <button type="button" class="btn btn-primary" @click="addIndex">Add global index</button>
    </div>
  </modal-dialog>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import MixinState from '../mixins/mixin-state'

export default Vue.component('modal-dynamo-global-index', {
  mixins: [MixinState({
    name: '',
    hashKeyName: '',
    hashKeyType: 'string',
    rangeKeyName: '',
    rangeKeyType: 'string',
    readCapacity: 1,
    writeCapacity: 1,
  })],
  methods: {
    toggle: function() {
      this.reset()
      this.$refs.dialog.toggle()
    },
    addIndex: function() {
      this.$dispatch('add-global-index', this.pick())
      this.toggle()
    }
  }
})
</script>
