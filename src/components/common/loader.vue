<template>
  <div class="loader">
    <v-progress-circular indeterminate :size="70" :width="7" color="primary" class="circle"></v-progress-circular>
  </div>
</template>

<script>
export default {
  //
}
</script>

<style lang="scss">
.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  text-align: center;
  margin: auto;
  z-index: 99;
}
.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
