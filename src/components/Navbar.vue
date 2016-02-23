<template>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" @click="toggle" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" v-link="{path: '/'}">backbeam λ</a>
      </div>
      <div class="navbar-collapse collapse" :class="{'in': open}">
        <slot></slot>
      </div>
    </div>
  </nav>
</template>

<script>
import Vue from 'vue'

export default Vue.component('navbar', {
  methods: {
    toggle() {
      this.open = !this.open
    }
  },
  data: () => ({
    open: false
  })
})
</script>
