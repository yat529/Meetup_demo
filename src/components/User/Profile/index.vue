<template>

  <router-view id="profile"></router-view>

</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      headerInfo: [
        {
          title: '消息中心',
          subtitle: '查看你的米团动态和消息',
          tabs: [
            {
              label: '成员',
              active: true
            }, 
            {
              label: '小组',
              active: false
            }, 
            {
              label: '好友',
              active: false
            }, 
            {
              label: '系统',
              active: false
            }, 
          ]
        }
      ],
      tabIndex: 0
    }
  },

  methods: {
    getCurrentStepIndex (index) {
      switch (index) {
        case 1:
          this.$router.push('/profile/dashboard')
          break
        case 2:
          this.$router.push('/profile/friends')
          break
        case 3:
          this.$router.push('/profile/meetups')
          break
      }
    },

    getCurrentTabIndex (index) {
      this.tabIndex = index
    }
  },
}
</script>


<style lang="scss">
// Global
#profile .section-wrapper {
  position: relative;
  overflow: auto;
  z-index: 1;
}

// Global
#profile .cus-p-20 {
  padding: 20px;
}
</style>

