<template>
  <v-container px-3 py-2>

    <v-layout row wrap v-if="showEditMeetup">
      <EditButton :showEditMeetup="true" 
      v-on:enterEditMode="enterEditMode" 
      v-on:exitEditMode="exitEditMode"></EditButton>
    </v-layout>

    <v-layout row wrap v-else-if="showRegisterMeetup">
      <RegisterButton 
      :showRegisterMeetup="true" :registered="registered" :pending="pending" :isMobile="isMobile"
      v-on:register="register"></RegisterButton>
      <!-- <v-spacer></v-spacer> -->
      <LoadButton
      :showLoadMeetup="true" v-on:load="load"></LoadButton>
    </v-layout>

  </v-container>
</template>

<script>
/* eslint-disable */
import RegisterButton from '@/components/common/buttonGroup/registerMeetup'
import EditButton from '@/components/common/buttonGroup/editMeetup'
import LoadButton from '@/components/common/buttonGroup/loadMeetup'

export default {
  components: {
    RegisterButton,
    EditButton,
    LoadButton
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
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 
    }
  },
  methods: {
    enterEditMode () {
      console.log('here')
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
    }
  }
}
</script>

<style lang="scss">
.inline-button-wrapper {
  display: inline-block;
}
</style>
