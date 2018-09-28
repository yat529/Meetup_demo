<template>
  <div ref="appBody" v-if="cards.length">

    <InfoBar v-show="showInfoBar"
      :infoText="InfoBarText"
      v-on:close="closeInfoBar"></InfoBar>

    <!-- carousel -->
    <Carousel :cards="cards">
      <Card v-for="(card, index) in cards" :key="index" :card="card" slot="cards">
        <div class="card-btn-container" slot="card-btn-groups">        
          <v-btn round dark flat small :class="card.joined ? 'green lighten-1' : 'primary'" @click="toggleJoined(card)">
            <transition v-on:enter="iconEnter" v-on:leave="iconLeave">
            <v-icon small left v-if="card.joined">far fa-check-circle</v-icon>
            </transition>
            <span>{{ card.joined ? '已加入' : '加入'}}</span>
          </v-btn>
        </div>
      </Card>
    </Carousel>
  </div>

  <NoResultPage v-else
    noResultText="暂时没有活动邀请"
    v-on:btnClick="btnClick"></NoResultPage>

</template>

<script>
/* eslint-disable */
import Carousel from '../cardCarousel'
import Card from '../card_mini'
import InfoBar from '../infoBar'
import NoResultPage from '@/components/common/noResultPage'

export default {
  components: {
    Carousel,
    Card,
    InfoBar,
    NoResultPage
  },

  props: {
    groups: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      showInfoBar: true,
    }
  },

  computed: {
    cards () {
      return this.groups
    },

    InfoBarText () {
      return `${this.groups.length}个小组邀请`
    }
  },

  methods: {
    closeInfoBar () {
      this.showInfoBar = false
    },

    btnClick () {
      console.log('click btn')
    },

    // transition
    iconEnter (el, done) {
      el.style.opacity = 0
      el.style.marginRight = '0px'

      Velocity(el, { 
        marginRight: '16px', 
        opacity: 1,
        }, {
        duration: 300,
        easing: 'ease',
        complete: done
      })
    },
    
    iconLeave (el, done) {
      done()
    },

    toggleJoined (card) {
      if ('joined' in card === false) {
        this.$set(card, 'joined', true)
      } else {
        if (card.joined) {
          card.joined = false
        } else {
          card.joined = true
        }
      }
    }
  }
}
</script>

