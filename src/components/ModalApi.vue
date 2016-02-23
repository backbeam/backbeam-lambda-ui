<template>
  <modal-dialog v-ref:dialog>
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">New API</h4>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>API name</label>
        <input type="text" class="form-control" placeholder="" v-model="name">
      </div>
      <div class="form-group">
        <label>API description</label>
        <textarea class="form-control" placeholder="" v-model="description"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="toggle">Close</button>
      <button type="button" class="btn btn-success" @click="createAPI">Create API</button>
    </div>
  </modal-dialog>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'

import MixinState from '../mixins/mixin-state'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('modal-api', {
  mixins: [MixinState({
    name: null,
    description: null,
  })],
  methods: {
    toggle: function() {
      this.reset()
      this.$refs.dialog.toggle()
    },
    createAPI: function() {
      this.$dispatch('create-api', this.pick())
      this.toggle()
    }
  }
})
</script>
