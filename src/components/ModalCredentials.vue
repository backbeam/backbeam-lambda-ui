<template>
  <modal-dialog v-ref:dialog blocking="true">
    <div class="modal-header">
      <h4 class="modal-title">AWS credentials</h4>
    </div>
    <div class="modal-body">
      <p>
        We did not found your AWS credentials in <code>~/.aws/credentials</code>, please
        fill your AWS credentials and we will create the file for you
      </p>
      <div class="form-group">
        <label>AWS acces key id</label>
        <input type="text" class="form-control" placeholder="Access key" v-model="accessKey">
      </div>
      <div class="form-group">
        <label>AWS secret access key</label>
        <input type="password" class="form-control" placeholder="Secret key" v-model="secretKey">
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" @click="save">Save</button>
    </div>
  </modal-dialog>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('modal-credentials', {
  data: () => ({
    accessKey: null,
    secretKey: null,
  }),
  methods: {
    toggle() {
      this.$refs.dialog.toggle()
    },
    save() {
      backbeam.saveCredentials(this.accessKey, this.secretKey)
        .then(() => this.toggle())
        .then(() => this.$dispatch('credentials-changed'))
        .catch(errorHandler)
    }
  }
})
</script>
