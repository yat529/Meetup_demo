<template>
  <div>
    <GroupList class="cus-p-20"
      :groups="pendingGroups"
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
    pendingGroups: {
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


