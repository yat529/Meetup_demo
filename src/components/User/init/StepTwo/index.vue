<template>
  <div lass="section-wrapper">

    <!-- Selection Screen -->
    <SelectionPage v-if="!selectedMethod && !showExistedAvatarPreview"
      :avatarUrlBg="defaultAvatarUrlBg"
      v-on:fileSelected="getLocalFileInfo"
      v-on:URLSelected="getURLInfo"
      v-on:ExistedSelected="showExistedAvatarPreview = true"></SelectionPage>

    <!-- Image URL  -->
    <URLPreviewPage v-else-if="!selectedMethod && showExistedAvatarPreview"
      :avatarUrl="existingAvatarUrl"
      v-on:approveImage="approveImage"
      v-on:clearImage="clearImage"
      v-on:return="goBackToSelection"></URLPreviewPage>

    <!-- Selection Local Image -->
    <FilePreviewPage v-else-if="selectedMethod === selected_methods[0]"
      :avatarUrlBg="selectedAvatarUrlBg" 
      :imageName="imageName"
      v-on:approveImage="approveImage"
      v-on:clearImage="clearImage"></FilePreviewPage>

    <!-- Selection Online Image URL -->
    <URLPreviewPage v-else-if="selectedMethod === selected_methods[1]"
      v-on:approveImage="approveImage"
      v-on:clearImage="clearImage"
      v-on:return="goBackToSelection"></URLPreviewPage>

  </div>
</template>

<script>
/* eslint-disable */
import FilePreviewPage from './FilePreview'
import SelectionPage from './Selection'
import URLPreviewPage from './URLPreview'

import defaultAvatarURL from '../icons/defaultAvatar.svg'

const SELECTED_METHODS = ['FILE', 'URL']

export default {
  components: {
    SelectionPage,
    FilePreviewPage,
    URLPreviewPage
  },

  props: {
    user: {
      type: Object
    }
  },

  data () {
    return {
      selected_methods: SELECTED_METHODS,
      selectedMethod: '',
      currentImage: '',
      imageName: '',
      // defaultAvatarURL: defaultAvatarURL,
      imageName: '',
      showExistedAvatarPreview: false,
    }
  },

  computed: {
    existedAvatarUrlBg () {
      let url = this.existingAvatarUrl
      return `background-image: url("${ url }")`
    },

    existingAvatarUrl () {
      if (this.user.photoURL) {
        return this.user.photoURL
      }
    },

    defaultAvatarUrlBg () {
      return `background-image: url("${ defaultAvatarURL }")`
    },

    selectedAvatarUrlBg () {
      let url = this.currentImage
      return `background-image: url("${ url }")`
    }
  },

  methods: {
    getLocalFileInfo () {
      this.selectedMethod = SELECTED_METHODS[0]
      this.currentImage = this.$store.state.flimageTempUrl
      this.imageName = this.$store.state.flimage.name
    },

    clearLocalFileInfo () {
      this.currentImage = ''
      this.imageName = ''
    },

    getURLInfo () {
      this.selectedMethod = SELECTED_METHODS[1]
    },

    approveImage () {
      // if (this.selectedMethod === SELECTED_METHODS[0]) {
      //   // local file
      //   this.$emit('approveAvatar')
      // } else 
      
      if (this.selectedMethod === SELECTED_METHODS[1]) {
        this.$store.commit('setFileLoaderCache', {
          file: null,
          fileTempUrl: this.imageWebUrl
        })
        this.$emit('approveAvatar')
      }

      this.$emit('approveAvatar')
    },

    clearImage () {
      this.$store.commit('clearFileLoaderCache')
      this.clearLocalFileInfo()
      this.selectedMethod = ''
    },

    goBackToSelection () {
      this.showExistedAvatarPreview = false
      this.selectedMethod = ''
    }
  },

  created () {
    if (this.user.photoURL) {
      this.showExistedAvatarPreview = true
    }
  }
}
</script>

<style lang="scss">
.hidden-input {
  position: absolute;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

.section-subtitle {
  text-align: center;
}

.cus-btn-groups {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  .gutter {
    flex: 0 0 50px;
  }
}
</style>
