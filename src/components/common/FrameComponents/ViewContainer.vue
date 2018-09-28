<template>
  <div class="cus-view-container">
    <slot name="view_header" class="cus-app-view-header"></slot>
    <slot name="view_body" class="cus-app-view-body"></slot>
  </div>
</template>

<script>
/* eslint-disable */

/* 
 * 此框架组件适用于router-view下的所有component
 */
export default {
  // 
}
</script>

<style lang="scss">
// parent element is abs positioned, and take full height of the screen
.cus-view-container {
  position: relative;
  height: 100%;
}

.cus-app-view-header {
  position: relative;
  width: 100%;
  height: 120px;
  z-index: 2;
}

.cus-app-view-body {
  position: absolute;
  top: 120px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: auto;
}
</style>

