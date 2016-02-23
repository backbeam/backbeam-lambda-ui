<template>
  <div class="pull-right" style="padding-top: 10px">
    <button type="button" class="btn btn-primary" @click="showCreateDialog">New table</button>
  </div>
  <h1>Dynamo</h1><hr/>

  <table class="table table-condensed">
    <thead>
      <tr>
        <th>Table name</th>
        <th>Keys</th>
        <th>Local indexes</th>
        <th>Global indexes</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="table in tables">
        <td><code>{{table.name}}</code></td>
        <td>
          <span v-for="key in table.keys">
            <strong>{{key.name}}</strong>:<em>{{key.type}}</em><br/>
          </span>
        </td>
        <td>{indexes(table.localIndexes)}</td>
        <td>{indexes(table.globalIndexes)}</td>
        <td class="text-right">
          <a class="btn btn-primary btn-xs">edit</a>
          <a class="btn btn-danger btn-xs">delete</a>
        </td>
      </tr>
    </tbody>
  </table>

  <modal-dynamo-table v-ref:modal-table @create-table="onCreateTable"></modal-dynamo-table>
</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'
import ModalDynamoTable from './ModalDynamoTable.vue'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('dynamo', {
  data: () => ({
    tables: [],
  }),
  created() {
    this.subscriber = subscriber(this, 'directory_changed', 'dynamo_changed')
    // this.refreshAll()
  },
  destroyed() {
    this.subscriber.unsubscribe()
  },
  methods: {
    showCreateDialog() {
      this.localIndexes = []
      this.globalIndexes = []
      this.$refs.modalTable.toggle()
    },
    refreshAll() {
      backbeam.readConfig()
        .then(data => {
          this.tables = data.dynamo.tables
        })
        .catch(errorHandler)
    },
    onDirectoryChanged() {
      this.refreshAll()
    },
    onDynamoChanged() {
      this.refreshAll()
    },
    onCreateTable() {

    }
  }
})
</script>
