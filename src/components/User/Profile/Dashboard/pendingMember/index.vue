<template>

  <div ref="appBody" v-if="cards.length">

    <InfoBar v-show="showInfoBar"
      :infoText="InfoBarText"
      v-on:close="closeInfoBar"></InfoBar>

    <!-- carousel -->
    <Carousel :cards="cards">
      <Card v-for="(card, index) in cards" :key="index" :card="card" slot="cards">
        <div class="card-btn-container" slot="card-btn-groups">        
          <v-btn round dark flat small class="card-btn" :class="card.showList ? 'success' : 'primary'" @click="toggleCardList(card)">
            <transition name="fade" mode="out-in">
              <v-icon small v-show="!card.showList">fas fa-user-circle</v-icon>
            </transition>
              <transition name="rotate" mode="out-in">
              <v-icon small v-show="card.showList">fas fa-chevron-circle-down</v-icon>
              </transition>
            <span style="margin-left: 15px">{{ countPendingMember(card) }}个请求</span>
          </v-btn>
        </div>
      </Card>
    </Carousel>

    <!-- list -->
    <transition
      v-on:beforeEnter="beforeListEnter"
      v-on:enter="listEnter"
      v-on:leave="listLeave">

      <UserList :users="pendingMembers" ref="pendingMemberlist"
      v-if="activeCard && activeCard.showList"
      v-on:submit="submitSelectedUsers"></UserList>

    </transition>
  </div>

  <NoResultPage v-else
    noResultText="暂时没有成员申请"
    v-on:btnClick="btnClick"></NoResultPage>

</template>

<script>
/* eslint-disable */
import Carousel from '../cardCarousel'
import UserList from '../userList'
import Card from '../card_mini'
import InfoBar from '../infoBar'
import NoResultPage from '@/components/common/noResultPage'

// exporting 
export default {
  components: {
    Carousel,
    UserList,
    Card,
    InfoBar,
    NoResultPage
  },

  props: {
    groups: {
      type: Array,
      default () {
        return [
          {
            title: '测试小组1',
            key: 1,
            group_size: 6,
            members: 2,
            pending_members: {
              1: {
                name: 'Name 1',
                gender: 'female',
                age: 22,
                uid: 1
              }
            }
          }
        ]
      }
    }
  },

  data () {
    return {
      showInfoBar: true,
      activeCard: null,
      approvedMembers: [],
    }
  },

  computed: {
    cards () {
      return this.groups
    },

    pendingMembers () {
      let array = []
      if (this.activeCard) {
        let members = this.activeCard.pending_members || {}
        for (let member in members) {
          array.push(members[member])
        }
      }
      return array
    },

    InfoBarText () {
      let groups = this.groups,
          groupsCount = groups.length,
          membersCount = 0

      groups.forEach(group => {
        membersCount += Object.keys(group.pending_members).length
      })

      return `${groupsCount}个小组, 共${membersCount}个组队请求`
    }
  },

  methods: {
    closeInfoBar () {
      this.showInfoBar = false
    },

    btnClick () {
      console.log('click btn')
    },

    // card
    toggleCardList (card) {
      if (this.activeCard) {
        if (this.activeCard.key === card.key ) {
          this.closeCardList(card)
          this.activeCard = null   
        } else {
          this.cards.forEach(item => {
            if (item.showList) {
              item.showList = false
            }
          })
          this.activeCard = null
          // this.openCardList(card, false)
          // this.syncCard(card)
        }
      } else {
        this.openCardList(card)
        // this.syncCard(card)
      }
    },

    openCardList (card) {
      if ('showList' in card === false) {
        this.$set(card, 'showList', true)
      } else {
        card.showList = true
      }
      this.showList(card)
    },

    closeCardList (card) {
      card.showList = false
      this.hideList()
    },

    // syncCard (card) {
    //   console.log('syncing')
    //   this.activeCard = Object.assign({}, this.activeCard, card)
    // },

    countPendingMember (card) {
      return Object.keys(card.pending_members).length
    },

    // List
    showList (activeCard, showAnimation = true) {
      let $appBody = this.$refs.appBody,
          that = this

      let $parentView = that.$utils.findParent($appBody, 'profile_dashboard')

      that.activeCard = Object.assign({}, that.activeCard, activeCard)

      if (showAnimation) {
        that.$nextTick(() => {
          let $pendingMemberlist = that.$refs.pendingMemberlist.$el
          that.$utils.animateScrollTo($parentView, $pendingMemberlist, 400)
        })
      }
    },
    
    hideList () {
      let $appBody = this.$refs.appBody,
          $parentView = this.$utils.findParent($appBody, 'profile_dashboard')

      this.activeCard = null
      this.$utils.animateScrollTo($parentView, $parentView, 400)
    },

    submitSelectedUsers (list) {
      this.approvedMembers = list
      console.log(list)
    },

    // transition
    beforeListEnter (el) {
      el.style.opacity = 0
    },

    listEnter (el, done) {
      Velocity(el, { opacity: 1 }, {
        duration: 600,
        easing: 'ease',
        complete: done
      })
    },

    listLeave (el, done) {
      let $parentView = this.$utils.findParent(el, 'profile_dashboard')

      this.$utils.animateScrollTo($parentView, $parentView, 600)
      Velocity(el, { 
        translateX: '100px',
        opacity: 0
        }, 
        {
        duration: 600,
        delay: 200,
        easing: 'ease',
        complete: done
      })
    },
  }

}
</script>

<style lang="scss">

/* 
transition css
 */
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease-in-out;
}

.rotate-enter,
.rotate-leave-to {
  transform: rotate(-90deg);
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease-in-out;
}

.expand-enter {
  max-height: 0px;
  opacity: 0;
}

.expand-enter-to {
  max-height: 400px;
  opacity: 1;
}

.expand-leave-to {
  max-height: 0px;
  transform: translateX(30%);
  opacity: 0;
}

</style>


