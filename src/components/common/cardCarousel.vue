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

        <Card :item="item" v-for="(item, index) in cards" :key="index + item.key" ref="card"></Card>

        <!-- placeholder (optional) -->
        <div class="card-wrapper" v-if="hasPlaceholder&&cards">
          <v-card flat height="418px" class="card-item">
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
import Card from '@/components/common/card'

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
    }
  },
  created () {
    console.log('created hook', this.cards.length)
  },
  mounted () {
    console.log('updated hook', this.cards.length)
    // DOM Cache
    let view = this.$refs.cardsView,
        row = this.$refs.cardsRow,
        cards = this.$refs.card

    let card = cards[0].$el,
        leftArrow = this.$refs.leftArrow.$el,
        rightArrow = this.$refs.rightArrow.$el
    
    let viewWidth = view.offsetWidth,
        cardWidth = card.offsetWidth,
        margin = 20

    let cardsNum =cards.length

    if (this.hasPlaceholder) cardsNum += 1

    let offset = Math.floor(viewWidth / (cardWidth + 20 * 2)),
        viewLimit = Math.ceil(viewWidth / (cardWidth + 20 * 2)),
        rowWidth = Math.max((cardWidth + 20 * 2) * cardsNum - 20 * 2, viewWidth) // first & list card no left/right marigin

    let counter = 0,
        dist = 0,
        cardsLeft = cardsNum

    if (viewLimit > cardsNum) {
      this.showLeftArrow = false
      this.showRightArrow = false
    }

    row.style.width = rowWidth + 'px'

    // console.log(rowWidth)
    
    rightArrow.addEventListener('click', (e) => {
      if (cardsLeft > viewLimit) {
        counter ++
        dist = (cardWidth + 20 * 2) * offset * counter
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
        dist = (cardWidth + 20 * 2) * offset * counter
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


// .meetups {
//   .card-wrapper {
//     display: block;
//     position: relative;
//     float: left;
//     width: 288px;
//     margin: 20px;

//     &:first-child {
//       margin-left: 0;
//     }

//     &:last-child {
//       margin-right: 0;
//     }
//   }

//   .date-wrapper {
//     position: absolute;
//     top: 10px;
//     left: 10px;
//     width: 70px;
//     border-radius: 5px;
//     overflow: hidden;
//     // z-index: 1;
    
//     .date,
//     .day {
//       width: 70px;
//       height: 20px;
//       line-height: 20px;
//       font-size: 12px;
//       text-align: center;
//     }

//     .date {
//       background: #fff;
//     }

//     .day {
//       background: #000000;
//       color: #fff;
//       font-size: 12px;
//     }
//   }

//   .card-item {
//     box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
//     border-radius: 15px !important;

//     .card-item-image {
//       border-radius: 15px 15px 0 0 !important;
//     }

//     .info_name,
//     .info_desc {
//       overflow: hidden;
//       display: -webkit-box;
//       -webkit-box-orient: vertical;
//     }

//     .info_name {
//       height: 50px;
//       font-size: 1.2rem;
//       -webkit-line-clamp: 2;
//     }

//     .info_desc {
//       height: 60px;
//       font-size: 1rem;
//       line-height: 20px;
//       -webkit-line-clamp: 3;
//     }
//   }
// }
</style>
