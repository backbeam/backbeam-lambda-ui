<template>
  <div class="modal" tab-index="-1" role="dialog"
      :style="{'display': open ? 'block' : 'none', 'opacity': hidden ? 0.6 : 1, '-webkit-filter': hidden ? 'blur(2px)' : 'none' }">
    <div class="modal-dialog" :class="bsStyle">
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

var modals = []

document.addEventListener('keyup', function(e) {
  if (e.keyCode === 27 && modals.length > 0) {
    let modal = modals[modals.length - 1]
    if (modal.blocking) return
    modal.toggle()
  }
})

document.addEventListener('click', function(e) {
  if (e.target.matches('.modal')) {
    let modal = modals[modals.length - 1]
    if (modal.blocking) return
    modal.toggle()
  }
})

export default Vue.component('modal-dialog', {
  props: ['blocking'],
  data: () => ({
    open: false,
    hidden: false,
  }),
  methods: {
    toggle() {
      this.open = !this.open
      if (this.open) {
        this.backdrop = document.createElement('div')
        this.backdrop.className = 'modal-backdrop in'
        document.body.appendChild(this.backdrop)
        modals.forEach(function(modal) {
          modal.hide()
        })
        modals.push(this)
      } else {
        this.backdrop.parentNode.removeChild(this.backdrop)
        modals.splice(modals.length-1)
        if (modals.length > 0) {
          modals[modals.length-1].show()
        }
      }
    },
    hide() {
      this.hidden = true
    },
    show() {
      this.hidden = false
    }
  }
})
</script>
