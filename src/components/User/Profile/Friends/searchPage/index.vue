<template>
  <div class="fill-height">
    <div class="user-list-container fill-height">

      <div class="section-title" v-if="person">
        <img id="search-page-trophy" :src="ArtTrophySrc" alt="">
        太棒了, 已找到此用户
      </div>

      <div class="section-title" v-else>
        寻找其他米团用户
      </div>

      <div class="search-bar cus-mt-15">
        <v-icon class="search-icon primary--text">fas fa-search</v-icon>
        <input type="text" class="search-input" placeholder="输入好友的邮件地址">
      </div>

      <div class="result" v-if="person">

        <div id="list-item-parent">
          <div class="list-item-container">
            <div class="list-item">
              <div class="avatar"></div>
              <div class="item-body">
                <p> {{ person.name }} </p>
                <div class="meta-bar">
                  <v-icon class="gender female" v-if="person.gender === 'female'">fas fa-venus</v-icon>
                  <v-icon class="gender male" v-else>fas fa-mars</v-icon>
                  <span> {{ person.age }}岁 </span>
                </div>
              </div>

              <div class="fixed-actions">
                <div class="action">
                  <v-icon color="primary" @click="toggleAction(person)">fas fa-ellipsis-h</v-icon>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div class="art-result-bg" v-if="person">
        <img :src="ArtBalloonSrc" alt="Search Friends">
      </div>

      <div class="art-search-bg" v-else>
        <img :src="ArtBgSrc" alt="Search Friends" style="margin-bottom: 50px;">
      </div>

      

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ArtBg from './Image/People.png'
import ArtTrophy from './Image/Trophy.png'
import ArtBalloon from './Image/Balloon.png'

export default {
  data () {
    return {
      ArtBgSrc: ArtBg,
      ArtTrophySrc: ArtTrophy,
      ArtBalloonSrc: ArtBalloon,
      person: null,
      // person: {
      //   name: 'lala',
      //   age: 23,
      //   gender: 'female',
      //   uid: 5
      // },
    }
  },

  methods: {
    toggleAction (person) {
      this.$emit('submit', person.uid)
    }
  }
}
</script>

<style lang="scss">
// global
.cus-mt-15 {
  margin-top: 15px;
}

.cus-mt-30 {
  margin-top: 30px;
}

// local
#profile_friend {
  .section-title {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding-left: 5px;
    margin: 5px 0;
    font-size: 20px;
    font-weight: 500;
    color: #6480e6;
  }

  #search-page-trophy {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .result {
    padding-top: 25px;
  }

  .art-search-bg,
  .art-result-bg {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    img {
      display: block;
      width: 90%;
      height: auto;
    }
  }
}
</style>

