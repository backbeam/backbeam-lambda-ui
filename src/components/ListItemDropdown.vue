<template>
  <li class="dropdown" :class="{'open': open}" @click="toggle"><slot></slot></li>
</template>

<script>
import Vue from 'vue'

export default Vue.component('list-item-dropdown', {
  methods: {
    toggle: function() {
      this.open = !this.open
    }
  },
  props: ['open'],
})
</script>
