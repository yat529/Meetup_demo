<template>
  <div>
    <GroupList class="cus-p-20"
      :groups="registeredGroups"
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
    registeredGroups: {
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


