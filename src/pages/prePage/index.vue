<template>
  <div>
    <myHead :hasBack="true"/>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import myHead from '@/components/myHead'

export default {
  components: {
    myHead
  },

  data () {
    return {
      logs: []
    }
  },

  created () {
    const logs = (wx.getStorageSync('logs') || [])
    this.logs = logs.map(log => formatTime(new Date(log)))
  }
}
</script>

<style>
.log-list {
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}

.log-item {
  margin: 10rpx;
}
</style>
