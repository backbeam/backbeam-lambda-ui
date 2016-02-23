<template>
  <modal-dialog v-ref:dialog>
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">New role</h4>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Role name</label>
        <input type="text" class="form-control" placeholder="" v-model="name">
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="toggle">Close</button>
      <button type="button" class="btn btn-success" @click="createRole">Create role</button>
    </div>
  </modal-dialog>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import MixinState from '../mixins/mixin-state'

export default Vue.component('modal-role', {
  mixins: [MixinState({ name: null })],
  methods: {
    toggle() {
      this.reset()
      this.$refs.dialog.toggle()
    },
    createRole() {
      this.$dispatch('create-role', this.pick())
      this.toggle()
    }
  }
})
</script>
