<template>
  <v-layout row justify-center style="position: absolute" v-if="meetupKey">
    <v-dialog v-model="dialog" persistent max-width="690">
      <v-card>
        <v-card-title class="headline" v-if="initialTitle">更活动主题</v-card-title>
        <v-card-title class="headline" v-else-if="initialContent">更活动简介</v-card-title>

        <v-container v-if="initialTitle">
          <v-text-field
            label="必填"
            v-model="title"
            :rules="[(v) => v.length <= 80 || '不超过80个字']"
            :counter="80"
            required
          ></v-text-field>
        </v-container>

        <v-container v-else-if="initialContent">
          <v-text-field
            class="custom-border"
            label="点击输入"
            v-model="content"
            textarea
            rows="10"
          ></v-text-field>
        </v-container>

        <!-- action buttons -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="updateTitle" v-if="initialTitle">更新</v-btn>
          <v-btn color="green darken-1" flat @click.native="updateContent" v-else-if="initialContent">更新</v-btn>
          <v-btn color="green darken-1" flat @click.native="cancel">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: {
    meetupKey: {
      type: String
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    initialTitle: {
      type: String
    },
    initialContent: {
      type: String
    }
  },
  data () {
    return {
      dialog: this.showDialog,
      title: this.initialTitle,
      content: this.initialContent
    }
  },
  methods: {
    updateTitle () {
      // update actions
      this.$store.dispatch('updateMeetupTitle', {
        meetup_key: this.meetupKey,
        title: this.title
      })
      .then(() => {
        this.$emit('update')
        this.dialog = false
        console.log('update title successful')
      })
    },
    updateContent () {
      this.$store.dispatch('updateMeetupContent', {
        meetup_key: this.meetupKey,
        description: this.content
      })
      .then(() => {
        this.$emit('update')
        this.dialog = false
        console.log('update content successful')
      })
    },
    cancel () {
      this.$emit('cancel')
      this.dialog = false
    }
  }
}
</script>

