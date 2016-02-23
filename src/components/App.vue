<template>
  <navbar>
    <ul class="nav navbar-nav">
      <list-item-dropdown>
        <a href="javascript:void(0)" class="dropdown-toggle" role="button" aria-haspopup="true" aria-expanded="false">
          {{project || 'No project selected'}} <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li><a href="javascript:void(0)">Refresh</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#" @click.prevent="showOpenDialog">Open…</a></li>
          <li><a href="#" @click.prevent="showProjectInit">New project…</a></li>
        </ul>
      </list-item-dropdown>
    </ul>
    <ul class="nav navbar-nav navbar-right" v-if="project">
      <li><a v-link="{path: '/lambda'}">Lambda</a></li>
      <li><a v-link="{path: '/api'}">API</a></li>
      <li><a v-link="{path: '/dynamo'}">Dynamo</a></li>
    </ul>
  </navbar>

  <modal-project-init v-ref:project-init></modal-project-init>
  <modal-credentials v-ref:credentials></modal-credentials>

  <div class="container" style="padding-top: 60px">
    <router-view></router-view>
  </div>

  <jobs-console></jobs-console>
</template>

<script>
var fs = require('fs')
var electron = require('electron')

import Vue from 'vue'

import Navbar from './Navbar.vue'
import ProjectInit from './ModalProjectInit.vue'
import ListItemDropdown from './ListItemDropdown.vue'
import JobsConsole from './JobsConsole.vue'
import Credentials from './ModalCredentials.vue'

import backbeam from '../utils/backbeam-singleton'
import subscriber from '../utils/backbeam-subscriber'
import errorHandler from '../utils/error-handler'

export default Vue.component('App', {
  data: () => ({
    project: false,
    credentialsLoaded: false,
  }),
  created() {
    this.subscriber = subscriber(this, 'directory_changed')
    backbeam.loadCredentials()
      .catch((e) => {
        this.$refs.credentials.toggle()
      })
    const dir = localStorage.getItem('directory')
    if (dir && fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      backbeam.setDirectory(dir)
    }
  },
  destroyed() {
    this.subscriber.unsubscribe()
  },
  methods: {
    showOpenDialog() {
      Vue.nextTick(() => {
        const dialog = electron.remote.dialog
        const dir = dialog.showOpenDialog(electron.remote.getCurrentWindow(), {
          properties: [ 'openDirectory' ],
        })
        if (!dir || dir.length === 0) return
        backbeam.setDirectory(dir[0])
        localStorage.setItem('directory', dir[0])
      })
    },
    showProjectInit() {
      this.$refs.projectInit.toggle()
    },
    onDirectoryChanged() {
      backbeam.readConfig()
        .then(config => {
          this.project = config.project
          this.$router.go('/api')
        })
        .catch(errorHandler)
    },
  }
})
</script>
