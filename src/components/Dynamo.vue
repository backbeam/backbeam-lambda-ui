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
          <strong>{{table.hashKeyName}}</strong>: <em>{{table.hashKeyType}}</em><br/>
          <span v-if="table.rangeKeyName">
            <strong>{{table.rangeKeyName}}</strong>: <em>{{table.rangeKeyType}}</em><br/>
          </span>
        </td>
        <td v-for="arr in [table.localIndexes, table.globalIndexes]">
          <span v-if="arr.length === 0">none</span>
          <ul v-if="arr.length > 0" style="list-style-type: 'none'; margin: 0; padding: 0">
            <li v-for="index in arr">{{index.name}}</li>
          </ul>
        </td>
        <td class="text-right">
          <button class="btn btn-primary btn-xs" @click="editTable(table)">edit</button>
          <button class="btn btn-danger btn-xs" @click="deleteTable(table)">delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <modal-dynamo-table v-ref:modal-table
    @create-table="onCreateTable"
    @edit-table="onEditTable"
    ></modal-dynamo-table>

  <div class="alert alert-info" role="alert">
    <p>You should be have a local Dynamo DB running at port <em>4567</em></p>
    <p>When creating the project Backbeam configures a <code>npm run dynamo</code> script. You can use it to launch Dynamo locally</p>
  </div>

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
    tables: null,
  }),
  created() {
    this.subscriber = subscriber(this, 'directory_changed', 'dynamo_changed', 'credentials_changed')
    if (this.tables === null && backbeam.credentialsLoaded) {
      this.refreshAll()
    }
  },
  destroyed() {
    this.subscriber.unsubscribe()
  },
  methods: {
    showCreateDialog() {
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
    onCredentialsChanged() {
      this.refreshAll()
    },
    onEditTable(params) {
      backbeam.dynamoEditTable(params)
        .catch(errorHandler)
    },
    onCreateTable(params) {
      backbeam.dynamoCreateTable(params)
        .catch(errorHandler)
    },
    editTable(table) {
      this.$refs.modalTable.toggle(table)
    },
    deleteTable(table) {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to undo this change',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0039',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: true,
      }, () => {
        backbeam.dynamoDeleteTable(table)
          .catch(errorHandler)
      })
    }
  }
})
</script>
