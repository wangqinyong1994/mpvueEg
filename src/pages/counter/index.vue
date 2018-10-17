<template>
  <div class="counter-warp">
    <p>Vuex counter：{{ count }}</p>
    <p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </p>

    <div @click="home" class="home">去往首页</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['count'])
  },
  methods: {
    home () {
      wx.switchTab({
        url: '../index/main'
      })
    },
    increment () {
      this.changeCount(1)
    },
    decrement () {
      this.changeCount(-1)
    },
    ...mapActions(['changeCount'])
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
