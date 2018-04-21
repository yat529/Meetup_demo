<template>
  <v-layout justify-center align-center v-if="showRemoveMember">
    <v-btn small round dark color="primary" v-if="!confirmRemoveMember" @click="confirmRemoveMember = true">
      <v-icon left small>fas fa-user-times</v-icon>
      踢出小组
    </v-btn>
    <v-btn small round dark color="green lighten-3" v-else-if="confirmRemoveMember" @click="removeMember">
      <v-icon left small>far fa-check-circle</v-icon>
      确认
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  props: {
    showRemoveMember: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      confirmRemoveMember: false
    }
  },
  methods: {
    removeMember () {
      this.$emit('removeMember')
    }
  }
}
</script>
