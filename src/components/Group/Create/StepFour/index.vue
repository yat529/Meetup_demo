<template>
  <v-form class="section-wrapper" ref="groupInfoForm" lazy-validation @submit.prevent="validateInput">
    <div class="input-wrapper">
      <v-text-field box
        class="input-field"
        label="活动标题"
        v-model="title"
        :rules="[() => title.length > 0 || '请输入活动标题', () => title.length <= 80 || '不超过80个字']"
        hint="必填"
        :counter="80"
        validate-on-blur
        persistent-hint
        required></v-text-field>

      <v-text-field multi-line box
        class="input-field"
        label="活动内容"
        v-model="description"
        :rules="[() => description.length > 0 || '请输入活动内容', () => description.length <= 300 || '不超过300个字']"
        hint="必填"
        persistent-hint
        :counter="300"
        validate-on-blur
        rows="5"
        required></v-text-field>

      <v-select box
        class="input-field"
        :items="sizes"
        v-model="groupSize"
        v-if="!isCustomSize"
        :rules="[() => groupSize > 0 || '请输入活动内容']"
        label="活动人数"
        required></v-select>

      <v-text-field box
        class="input-field"
        label="输入活动人数"
        v-model="groupSize"
        v-if="isCustomSize"
        hint="请输入数字, 上限为999人"
        :rules="[() => groupSize > 0 || '请输入活动内容']"
        persistent-hint
        mask="###"
        validate-on-blur
        required></v-text-field>
    </div>

    <div class="cus-btn-container" style="margin-bottom: 45px">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" type="submit">
        下一步
      </v-btn>
    </div>
  </v-form>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      title: '',
      description: '',
      groupSize: '',
      isCustomSize: false,
      sizes: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,'自定'],
    }
  },
  watch: {
    groupSize (newVal, oldVal) {
      if (newVal === '自定') {
        this.isCustomSize = true
      }
    }
  },
  methods: {

    validateInput () {
      let form = this.$refs.groupInfoForm

      if ( form.validate() ) {
        this.$emit('submitGroupInfo', {
          title: this.title,
          description: this.description,
          groupSize: this.groupSize
        })
      }
    }
  }
}
</script>

