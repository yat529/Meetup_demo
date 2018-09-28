<template>
  <div class="carousel-container">
    <div class="arrow-container left" v-show="showLeftArrow">
      <div class="arrow primary" @click="previous">
        <v-icon>fas fa-chevron-left</v-icon>
      </div>
    </div>
    <div class="arrow-container right" v-show="showRightArrow">
      <div class="arrow primary" @click="next">
        <v-icon>fas fa-chevron-right</v-icon>
      </div>
    </div>

    <div class="carousel-view" ref="carouselView">
      <div class="carousel-cards-container">
        <slot name="cards"></slot>
      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

export default {
  props: {
    cards: {
      type: Array
    }
  },

  data () {
    return {
      showLeftArrow: true,
      showRightArrow: true,
      //
      totalCards: this.cards.length,
      cardsLeft: undefined,
    }
  },

  computed: {
    // total width of the cards containers
    computedWidth () {
      // # of cards * (card width + 15px (margin-right)) - 15px (last card margin right)
      let width = this.cards.length * 155 - 15
      // return 'width: ' + width + 'px'
      return width
    },

    // # of cards in current viewport
    cardsPerView () {
      let carouselView = this.$refs.carouselView,
        viewWidth = carouselView.offsetWidth

      return Math.floor(viewWidth / 155)
    }
  },

  methods: {
    next () {
      let $cardsContainer = this.$refs.carouselView.firstElementChild,
          change

      if (this.cardsLeft > this.cardsPerView) {
        this.cardsLeft -= this.cardsPerView

        change = this.totalCards - this.cardsLeft

        this.showLeftArrow = true
      } else {
        change = this.cardsLeft

        this.showLeftArrow = true
        this.showRightArrow = false
      }

      $cardsContainer.style = `width: ${ this.computedWidth }px; transform: translateX(${ -150 * change }px)`
    },

    previous () {
      let $cardsContainer = this.$refs.carouselView.firstElementChild,
          change

      if (this.cardsLeft + this.cardsPerView < this.totalCards) {
        this.cardsLeft += this.cardsPerView

        change = this.totalCards - this.cardsLeft
      } else {
        change = 0

        this.showLeftArrow = false
        this.showRightArrow = true
      }

      $cardsContainer.style = `width: ${ this.computedWidth }px; transform: translateX(${ -150 * change }px)`
    },
  },

  mounted () {
    let $carouselView = this.$refs.carouselView,
        $cardsContainer = this.$refs.carouselView.firstElementChild,
        viewWidth = $carouselView.offsetWidth

        console.log(viewWidth)

    // arrow display
    if (this.computedWidth <= viewWidth) {
      this.showLeftArrow = false
      this.showRightArrow = false
    } else {
      this.showLeftArrow = false
    }

    this.cardsLeft = this.totalCards - this.cardsPerView

    // apply style
    $cardsContainer.style= `width: ${ this.computedWidth }px`
  }
}
</script>

<style lang="scss">
.carousel-container {
  position: relative;
  margin-bottom: 15px;

  .arrow-container {
    position: absolute;
    top: 50%;
    width: 37px;
    height: 37px;
    transform: translateY(-50%);
    z-index: 2;

    &.left {
      left: -15px;
    }

    &.right {
      right: -15px;
    }
  
    .arrow {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 37px;
      height: 37px;
      border-radius: 50%;

      &::after {
        content: '';
        position: absolute;
        bottom: 1px;
        left: 6px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 15px 0px rgba(0, 0, 0, 0.9);
        z-index: -1;
      }

      .icon {
        font-size: 20px;
        color: #ffffff;
      }
    }
  }
}

.carousel-view {
  overflow: hidden;
}

.carousel-cards-container {
  position: relative;
  padding: 15px 0;
  overflow: auto;
  transition: transform 0.3s ease-in-out;
  z-index: 1;
}
</style>


