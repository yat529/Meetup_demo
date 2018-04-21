<template>
  <v-container px-3 py-2>

    <v-layout row wrap justify-end v-if="showEditMeetup">
      <EditButton class="inline-button-wrapper" :showEditMeetup="true" 
      v-on:enterEditMode="enterEditMode" 
      v-on:exitEditMode="exitEditMode"></EditButton>
      <v-spacer></v-spacer>
      <CloseButton class="inline-button-wrapper"
      :showClose="true" v-on:close="close"></CloseButton>
    </v-layout>

    <v-layout row wrap v-else-if="showRegisterMeetup">
      <RegisterButton class="inline-button-wrapper" 
      :showRegisterMeetup="true" :registered="registered" :pending="pending"
      v-on:register="register"></RegisterButton>
      <v-spacer></v-spacer>
      <CloseButton class="inline-button-wrapper"
      :showClose="true" v-on:close="close"></CloseButton>
    </v-layout>

  </v-container>
</template>

<script>
/* eslint-disable */
import RegisterButton from '@/components/common/buttonGroup/registerMeetup'
import EditButton from '@/components/common/buttonGroup/editMeetup'
import LoadButton from '@/components/common/buttonGroup/loadMeetup'
import CloseButton from '@/components/common/buttonGroup/close'

export default {
  components: {
    RegisterButton,
    EditButton,
    LoadButton,
    CloseButton
  },
  props: {
    showEditMeetup: {
      type: Boolean,
      default: false
    },
    showRegisterMeetup: {
      type: Boolean,
      default: false
    },
    registered: {
      type: Boolean,
      default: false
    },
    pending: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      // 
    }
  },
  methods: {
    enterEditMode () {
      this.$emit('enterEditMode')
    },
    exitEditMode () {
      this.$emit('exitEditMode')
    },
    register () {
      this.$emit('register')
    },
    load () {
      this.$emit('load')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.inline-button-wrapper {
  display: inline-block;
}
</style>
