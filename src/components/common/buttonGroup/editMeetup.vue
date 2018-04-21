<template>
  <v-layout justify-center align-center v-if="showEditMeetup">
    <v-btn small round dark color="primary" v-if="!editMode" @click="enterEditMode">编辑</v-btn>
    <v-btn small round dark color="primary" v-else-if="editMode" @click="exitEditMode">停止编辑</v-btn>
  </v-layout>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showEditMeetup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editMode: false
    }
  },
  methods: {
    enterEditMode () {
      this.editMode = true
      this.$emit('enterEditMode')
    },
    exitEditMode () {
      this.editMode = false
      this.$emit('exitEditMode')
    }
  }
}
</script>

<style lang="scss">
</style>


