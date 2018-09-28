<template>
  <v-form class="px-3 py-3">
    <v-text-field
      v-model="plan"
      label="Plan Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="schedule1"
      label="Schedule 1"
      required
    ></v-text-field>

    <v-text-field
      v-model="todo1"
      label="Todo 1"
      required
    ></v-text-field>

    <v-btn @click="submit">Submit</v-btn>
  </v-form>
</template>

<script>
/* eslint-disable */ 
export default {
  data () {
    return {
      plan: '',
      schedule1: '',
      todo1: ''
    }
  },

  methods: {
    submit () {
      // firebase call

      this.$store.dispatch('createPlan', this.plan)
      .then(plan_ref => {
        this.$store.dispatch('createSchedule', {
          schedule: this.schedule1,
          plan_key: plan_ref.key
        })
        .then(schedule_ref => {
          let location = {
            LatLng: {
              lat: 40.756908,
              lng: -73.82921160000001
            },
            address: "136-20 Roosevelt Avenue #2R, Flushing, NY 11354, USA",
            name: "Daxi Sichuan",
            place_id: "ChIJPwLjwxFgwokRLQrZ9mQpa9E"
          }

          schedule_ref.child('location').set(location)

          this.$store.dispatch('createTodo', {
            todo: this.todo1,
            schedule_key: schedule_ref.key,
            plan_key: plan_ref.key,
            member: this.$store.state.userModule.user_ref
          })
          .then(todo_ref => {
            let obj = {
              complete: true,
              nickname: 'Ben',
              photoURL: "https://firebasestorage.googleapis.com/v0/b/meetup-demo-project.appspot.com/o/users%2FjkqUe3sb9kdPSROLL1Yy3i8CaP43%2Favatar?alt=media&token=19a689aa-2175-4aba-8a41-9a883391f196",
              uid: "jkqUe3sb9kdPSROLL1Yy3i8CaP43"
            },
            complete = {}

            complete['jkqUe3sb9kdPSROLL1Yy3i8CaP43'] = obj
            todo_ref.child('complete').set(complete)
          })
        })
      })

    }
  }
}
</script>

