<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{title}}</v-card-title>
        <v-card-text>{{content}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary--text" flat @click.native="confirm">确认</v-btn>
          <v-btn color="grey" flat @click.native="cancel">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    title: {
      type: String,
      default: '确认删除'
    },

    content: {
      type: String,
      default: '操作不可逆, 确认码?'
    }
  },
  data () {
    return {
      dialog: false
    }
  },

  methods: {
    confirm () {
      this.$emit('confirm')
      this.dialog = false
    },

    cancel () {
      this.$emit('cancel')
      this.dialog = false
    }
  }
}
</script>

