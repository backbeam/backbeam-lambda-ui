<template>
  <div class="pull-right" style="padding-top: 10px">
    <button type="button" class="btn btn-primary" @click="$refs.modalLambda.toggle()">New lambda function</button>
  </div>
  <h1>Lambda</h1><hr/>

  <table class="table table-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Filename</th>
        <th>Memory</th>
        <th>Timeout</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="func in functions">
        <td><code>{{func.functionName}}</code></td>
        <td>{{func.filename}}</td>
        <td>{{func.memory}}</td>
        <td>{{func.timeout}}</td>
        <td class="text-right">
          <a class="btn btn-success btn-xs" @click="syncLambdaFunction(func)">sync</a>
          <a class="btn btn-primary btn-xs" @click="$refs.modalLambda.toggle(func)">edit</a>
          <a class="btn btn-danger btn-xs" @click="deleteLambdaFunction(func)">delete</a>
        </td>
      </tr>
    </tbody>
  </table>

  <modal-lambda-function v-ref:modal-lambda></modal-lambda-function>

</template>

<script>
import Vue from 'vue'

import ModalDialog from './ModalDialog.vue'

import LambdaFunction from './ModalLambdaFunction.vue'
import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('lambda', {
  data: () => ({
    functions: [],
  }),
  created() {
    this.subscriber = subscriber(this, 'directory_changed', 'lambda_changed')
    this.refreshAll()
  },
  destroyed() {
    this.subscriber.unsubscribe()
  },
  methods: {
    refreshAll() {
      if (!backbeam.getDirectory()) {
        return this.functions = []
      }
      backbeam.readConfig()
        .then(data => {
          this.functions = data.lambda.functions
        })
        .catch(errorHandler)
    },
    onDirectoryChanged() {
      this.refreshAll()
    },
    onLambdaChanged() {
      this.refreshAll()
    },
    syncLambdaFunction(func) {
      backbeam.lambdaSyncFunction(func.functionName)
        .catch(errorHandler)
    },
    deleteLambdaFunction(func) {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to undo the changes',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0039',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: true,
      }, function() {
        backbeam.lambdaDeleteFunction(func)
          .catch(errorHandler)
      });
    },
  }
})
</script>
