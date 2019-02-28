<template>
  <div>
    <myHead :hasBack="true" :title="dayStr" :titleFn="changeTitle"/>
    <div class="blankView1"></div>
    <calendar 
      :dotArr='dotArr'
      @pickHandle='pickHandle'
      :yearArr='yearArr'
      :defaultCheckedDay="defaultCheckedDay"
      :defaultTargetDay="defaultTargetDay"
      :initFlod="false"
    >
    </calendar>
  </div>
</template>

<script>
import myHead from '@/components/myHead'
import calendar from '@/components/calendar/index'
import moment from 'moment'
import { formatNumber } from '../../utils/index';




export default {
  components: {
    myHead,
    calendar,
  },
  data () {
    return {
      dotArr: [
        {date: '2019-02-25', type: 'normal'},
        {date: '2019-02-12', type: 'unnormal'},
      ],
      yearArr: [2010, 2099],
      defaultCheckedDay: {
        year: 2019,
        month: '02',
        day: '10'
      },
      defaultTargetDay: '2019-02-10',
    }
  },
  methods: {
    pickHandle(date) {
      console.log(date)
    }
  }

  
}
</script>

<style>
.blankView1{
  width: 100%;
  height: 201rpx;
}

.calendar{
  width: 100%;
  /* height: 160rpx; */
  background-color: #333;
  position: relative;
}
.week, .day{
  width: 700rpx;
  height: 80rpx;
  color: #fff;
  margin: 0 auto;
  overflow: hidden;
}
.day{
  height: 100rpx;
}
.week div,.day div {
  width:100rpx;
  height:100rpx;
  text-align:center;
  line-height:80rpx;
  border-radius:100%;
  font-size:32rpx;
  position: relative;
  margin: 10rpx auto 0;
  float: left;
}
.targetDay .borderBox{
  width:80rpx;
  height:80rpx;
  border-radius:100%;
  line-height:80rpx;
  color: #000;
  background-color: orchid;
  margin-left: 10rpx;
}
.activeDay .borderBox{
  width:80rpx;
  height:80rpx;
  border-radius:100%;
  line-height:80rpx;
  background-color:#fff;
  color: #000;
  margin-left: 10rpx;
  position: relative;
}

.borderBox .dayDot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 10rpx;
  background-color: aqua;
  position: absolute;
  bottom: 24rpx;
  left: 50%;
  margin-left: -5rpx;
}
.targetDay .dayDot{
  margin-left: -5rpx;
  bottom: 4rpx;
}
.day .myBadge{
  width: 30rpx;
  height: 30rpx;
  border-radius: 100%;
  background-color: orangered;
  color: #fff;
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  font-size: 16rpx;
  line-height: 30rpx;
  text-align: center;
}


.dateBox{
  width: 100%;
  height: 400rpx;
  background-color: antiquewhite;
}

.iconTool {
  width: 100rpx;
  height: 20rpx;
  position: absolute;
  bottom: -20rpx;
  left: 325rpx;
  background-color: #fff;
  line-height: 20rpx;
  text-align: center;
}
.datePickView {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
}

.datePickView view {
  text-align: center;
  
}

.pickMask{
  background-color: aqua;
}
.mask{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
}
</style>
