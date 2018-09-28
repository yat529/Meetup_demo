<template>
  <v-container class="carousel-wrapper px-0" v-if="cards">
    <div class="left arrow" v-show="showLeftArrow">
      <v-btn fab dark small color="primary" ref="leftArrow">
        <v-icon dark>fas fa-chevron-circle-left</v-icon>
      </v-btn>
    </div>
    <div class="right arrow" v-show="showRightArrow">
      <v-btn fab dark small color="primary" ref="rightArrow">
        <v-icon dark>fas fa-chevron-circle-right</v-icon>
      </v-btn>
    </div>
    <v-container class="meetups cards-view" ref="cardsView">
      <v-layout row class="cards-row" ref="cardsRow" id="cardsRow">

        <Card ref="card" 
        :item="item" 
        :isMobile="isMobile" 
        v-on:click="getClickedCard"
        v-for="(item, index) in cards" :key="index + item.key"></Card>

        <!-- placeholder (optional) -->
        <div class="card-wrapper" :class="isMobile ? 'small' : ''" v-if="hasPlaceholder&&cards">
          <v-card flat class="card-item" height="418px" v-if="!isMobile">
            <v-layout justify-center align-center fill-height>
              <v-btn flat large color="primary" @click="redirect">
                <v-icon dark left>add_circle_outline</v-icon>
                {{phText}}
              </v-btn>
            </v-layout>
          </v-card>
          
          <v-card flat class="card-item" height="319px" v-else>
            <v-layout justify-center align-center fill-height>
              <v-btn flat large color="primary" @click="redirect">
                <v-icon dark left>add_circle_outline</v-icon>
                {{phText}}
              </v-btn>
            </v-layout>
          </v-card>
        </div>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */
// import Card from '@/components/common/card'

export default {
  components: {
    Card
  },
  props: {
    cards: {
      type: Array
    },
    hasPlaceholder: {
      type: Boolean
    },
    phText: {
      type: String
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showLeftArrow: true,
      showRightArrow: true
      }
  },
  computed: {
    // 
  },
  methods: {
    redirect () {
      this.$emit('redirect')
    },
    getClickedCard (item) {
      this.$emit('clickCard', item)
      // console.log(item)
    }
  },
  created () {
    console.log('created hook', this.cards.length)
  },
  mounted () {
    console.log('mounted hook', this.cards.length)
    // DOM Cache
    let view = this.$refs.cardsView,
        row = this.$refs.cardsRow,
        cards = this.$refs.card

    let card = cards[0].$el,
        leftArrow = this.$refs.leftArrow.$el,
        rightArrow = this.$refs.rightArrow.$el
    
    let viewWidth = view.offsetWidth,
        cardWidth = card.offsetWidth,
        margin = this.isMobile ? 10 : 20

    let cardsNum =cards.length

    if (this.hasPlaceholder) cardsNum += 1

    let offset = Math.floor(viewWidth / (cardWidth + margin * 2)),
        viewLimit = Math.ceil(viewWidth / (cardWidth + margin * 2)),
        rowWidth = Math.max((cardWidth + margin * 2) * cardsNum - margin * 2, viewWidth) // first & list card no left/right marigin

    let counter = 0,
        dist = 0,
        cardsLeft = cardsNum

    if (viewLimit > cardsNum) {
      this.showLeftArrow = false
      this.showRightArrow = false
    }

    row.style.width = rowWidth + 'px'
    
    rightArrow.addEventListener('click', (e) => {
      if (cardsLeft > viewLimit) {
        counter ++
        dist = (cardWidth + margin * 2) * offset * counter
        row.style.transform = `translateX(${-dist}px)` 
        cardsLeft -= offset
        // console.log(cardsLeft)
        if (cardsLeft < viewLimit) {
          dist = rowWidth - viewWidth
          row.style.transform = `translateX(${-dist}px)`
        }
      } else {
        row.style.transform = `translateX(${-(rowWidth - viewWidth)}px)`
      }
    })

    leftArrow.addEventListener('click', () => {
      if (cardsLeft === cardsNum) {
        row.style.transform = `translateX(0px)`
      } else {
        counter --
        dist = (cardWidth + margin * 2) * offset * counter
        row.style.transform = `translateX(${-dist}px)`
        cardsLeft += offset
        // console.log(cardsLeft)
        if (cardsLeft === cardsNum) {
          row.style.transform = `translateX(0px)`
        }
      }
    })
  }
}
</script>

<style lang="scss">
.carousel-wrapper {
  position: relative;
  width: 100%;

  .arrow {
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 2;

    &.left {
      left: 0;
      transform: translate(-50%, -50%);
    }

    &.right {
      right: 0;
      transform: translate(50%, -50%);
    }
  }
}

.cards-view {
  position: relative;
  padding: 0;
  overflow: hidden;

  .cards-row {
    display: block;
    overflow: hidden;
    transition: transform 0.5s ease-in-out;
  }
}
</style>
