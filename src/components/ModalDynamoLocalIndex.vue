<template>
  <modal-dialog v-ref:dialog>
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">New local index</h4>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Index name</label>
        <input type="text" class="form-control" placeholder="" v-model="name">
      </div>
      <div class="form-group">
        <label>Range/sort key</label>
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
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="toggle">Close</button>
      <button type="button" class="btn btn-primary" @click="addIndex">Add local index</button>
    </div>
  </modal-dialog>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import MixinState from '../mixins/mixin-state'

export default Vue.component('modal-dynamo-local-index', {
  mixins: [MixinState({
    name: '',
    rangeKeyName: '',
    rangeKeyType: 'string',
  })],
  methods: {
    addIndex: function() {
      this.$dispatch('add-local-index', this.pick())
      this.toggle()
    },
    toggle() {
      this.reset()
      this.$refs.dialog.toggle()
    },
  }
})
</script>
