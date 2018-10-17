<template>
  <div>
    <div class="headerWrap">
      <div hover-class="viewHover" @click="back" class="back" v-if="hasBack"> 〈 返回 </div>
      <div>我是头部</div>
      <i-progress :status="status" class="headProgress" v-if="isLoad" :percent="progressPer"></i-progress>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    hasBack:{
      type:Boolean,
      default:false
    },
    progressPer:{
      type:Number,
      default:0
    },
    isLoad:{
      type:Boolean,
      default:false
    }
  },
  data:() => {
    return {
      status:'normal'
    }
  },
  methods: {
    back () {
      wx.navigateBack({
          delta: 1
      })
    }
  },
  created () {
  },
  watch:{
    progressPer (nowPercent) {
      if(nowPercent) {
        this.isLoad = true;
        this.status = 'active';
      }
      this.progressPer = nowPercent
      if(nowPercent === 100) {
        this.status = 'success';
        setTimeout(() => {
          this.progressPer = 0;
          this.isLoad = false;
          this.status = 'normal';
        }, 500);
      }
    }
  }
}
</script>

<style>
.headerWrap{
    width: 100%;
    height: 200rpx;
    border-bottom: 1rpx solid #ccc;
    background-color: #ccc;
    color: #333;
    position: fixed;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 200rpx;
    z-index: 999;
}
.back{
  position: absolute;
  left: 10rpx;
}
.viewHover{
  color: #2d8cf0;
}
.headProgress{
  position: absolute;
  left: 0;
  bottom: -80rpx;
  width: 100%;
}
</style>
