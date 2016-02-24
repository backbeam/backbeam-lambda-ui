<template>
  <modal-dialog v-ref:dialog>
    <div class="modal-header">
      <button type="button" class="close" @click="toggle" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="modal-title">Deploy API</h4>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Stage name</label>
        <div class="input-group">
          <select class="form-control" v-model="name">
            <option :value="stage.stageName" v-for="stage in stages">{{stage.stageName}}</option>
          </select>
          <span class="input-group-btn">
            <button class="btn btn-primary" @click="createStage">Create…</button>
          </span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" @click="toggle">Close</button>
      <button type="button" class="btn btn-success" @click="deploy">Deploy</button>
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

export default Vue.component('modal-deployment', {
  mixins: [MixinState({
    name: null,
    stages: null,
  })],
  methods: {
    toggle() {
      this.reset()
      this.$refs.dialog.toggle()
      if (this.stages === null && backbeam.credentialsLoaded) {
        backbeam.apiListStages()
          .then((result) => {
            this.stages = result.item
            if (!this.name) this.name = result.item[0] && result.item[0].stageName
          })
          .catch(errorHandler)
      }
    },
    createStage() {
      swal({
        title: 'Specify the stage name',
        text: 'The stage name will be part of the URL',
        type: 'input',
        showCancelButton: true,
        closeOnConfirm: true,
        inputPlaceholder: 'The stage name'
      }, (stageName) => {
        if (!stageName) return
        this.stages.push({ stageName })
        this.name = stageName
      })
    },
    deploy() {
      this.$dispatch('create-deployment', this.pick('name'))
      this.toggle()
    }
  }
})
</script>
