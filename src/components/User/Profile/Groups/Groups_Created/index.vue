<template>
  <div>
    <GroupList class="cus-p-20"
      :groups="createdGroups"
      noResultText="你还没有创建任何活动"
      buttonText="创建新的米团"
      v-on:load="loadGroup"></GroupList>
    
  </div>
</template>

<script>
/* eslint-disable */
import GroupList from '../groupList'

export default {
  components: {
    GroupList
  },

  props: {
    createdGroups: {
      type: Array,
    }
  },

  data () {
    return {
      // 
    }
  },

  methods: {
    loadGroup (key) {
      this.$router.push('/profile/groups/' + key)
    }
  },


}
</script>

