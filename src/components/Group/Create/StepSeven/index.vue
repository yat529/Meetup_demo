<template>
  <div class="section-wrapper">
    <transition name="slide" mode="out-in">
    <SelectionPage class="transition-wrapper section-wrapper" v-if="showSelectionPage"
      v-on:toLocalFileSelection="toLocalFileSelection"
      v-on:toURLPreview="toURLPreview"
      v-on:toSkipPreview="toSkipPreview"></SelectionPage>

    <FilePreviewPage class="transition-wrapper section-wrapper" v-else-if="showFilePreviewPage"
      :imageName="imageName"
      v-on:approveImageSelection="approveImageSelection"
      v-on:clearImageSelection="clearImageSelection"></FilePreviewPage>
    
    <URLPreviewPage class="transition-wrapper section-wrapper" v-else-if="showURLPreviewPage"
      v-on:approveImageSelection="approveImageSelection"
      v-on:clearImageSelection="clearImageSelection"></URLPreviewPage>

    <SkipPreviewPage class="transition-wrapper section-wrapper" v-else-if="showSkipPreviewPage"
      v-on:approveImageSelection="approveImageSelection"
      v-on:clearImageSelection="clearImageSelection"></SkipPreviewPage>
    </transition>

  </div>
</template>

<script>
/* eslint-disable */
import SelectionPage from './selectionPage'
import FilePreviewPage from './FilePreviewPage'
import URLPreviewPage from './URLPreviewPage'
import SkipPreviewPage from './SkipPreviewPage'

export default {
  components: {
    SelectionPage,
    FilePreviewPage,
    URLPreviewPage,
    SkipPreviewPage
  },

  data () {
    return {
      showSelectionPage: true,
      showFilePreviewPage: false,
      showURLPreviewPage: false,
      showSkipPreviewPage: false,
      imageName: ''
    }
  },

  methods: {
    toLocalFileSelection (imageName) {
      this.imageName = imageName
      this.showSelectionPage = false
      this.showFilePreviewPage = true
    },

    toURLPreview () {
      this.showSelectionPage = false
      this.showURLPreviewPage = true
    },

    toSkipPreview () {
      this.showSelectionPage = false
      this.showSkipPreviewPage = true
    },

    approveImageSelection () {
      if (this.$store.state.flimageTempUrl) {
        this.$emit('submitImage')
        this.showFilePreviewPage = false
        this.showURLPreviewPage = false
        this.showSkipPreviewPage = false
      }
    },

    clearImageSelection () {
      this.$store.commit('clearFileLoaderCache')
      this.showFilePreviewPage = false
      this.showURLPreviewPage = false
      this.showSelectionPage = true
      this.imageName = ''
    }
  }
}
</script>

<style lang="scss">

.transition-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

// Local
.cus-btn-groups {
  display: flex;
  justify-content: space-between;
  width: 110px;
  height: 36px;
  margin: 0 auto;
  z-index: 1;

  button {
    position: relative;
    width: 36px;
    height: 36px;
  }
}

// Local
.section-flex-wrapper {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .section-text {
    margin-bottom: 25px;

    div {
      text-align: center;
    }
  }

  .cus-btn-container {
    flex: 0 0 auto;
  }

  .spacer {
    height: 100px;
  }
}
</style>
