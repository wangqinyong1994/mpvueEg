<template>
  <div>
    <myHead :hasBack="true" :title="dayStr" :titleFn="chooseDate"/>
    <div class="blankView1"></div>
    <div class="calendar">
      <div class="week">
        <div>日</div>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
      </div>
      <div class="day" :animation="animationExtend">
        <div @click="dayHandle(item)" :class="{activeDay:day == item,targetDay:targetDay == item && targetDay != day}" v-for="(item, index) in list" :key="index"><div class="borderBox">{{item}}<div class="myBadge" v-if="item == day">班</div></div></div>
      </div>
      <div class="iconTool" @click="iconTap">
        <i-icon :type="open ? 'packup' : 'unfold'" />
      </div>
      
    </div>
    <div class="dateBox">{{targetDay}}</div>
  </div>
</template>

<script>
import myHead from '@/components/myHead'
import moment from 'moment'
import { formatNumber } from '../../utils/index';


export default {
  components: {
    myHead
  },

  data () {
    return {
      dayColor:'',
      list:[],
      day:'',
      dayStr:'',
      dayInfo:'',
      targetDay:'',
      open:false,
      animationExtend:{}
    }
  },

  created () {
    const calendarInfo = this.showCalendar();
    const { dayInfo } = calendarInfo;
    this.list = calendarInfo.dateArr;
    this.targetDay = this.day = dayInfo.day;
    this.dayStr = `${dayInfo.year}年${dayInfo.month}月`;
    this.dayInfo = dayInfo;
  },
  methods: {
    showCalendar () {
      const timeArr = moment().toArray();
      const daysInMonth = moment().daysInMonth();//一个月的天数
      const daysInMonthPre = moment().subtract(1, 'month').daysInMonth();//一个月的天数
      const year = timeArr[0];
      const month = formatNumber(timeArr[1] + 1);
      const originDay = timeArr[2]
      let day = timeArr[2];
      let minuDay = day;
      const weekDay = moment().day();//当前日子星期几
      let dateArr = new Array(7);
      dateArr[weekDay] = formatNumber(day);
      for(let i = weekDay - 1 ; i >= 0 ; i -- ) {
        if(day <= 1) {
          day = daysInMonthPre + 1;
        }
        dateArr[i] = formatNumber(day - 1);
        day = day - 1 ;
      }
      for(let i = weekDay + 1 ; i < 7 ; i ++ ) {
        if(minuDay >= daysInMonth) {
          minuDay = 0;
        }
        dateArr[i] = formatNumber(minuDay + 1);
        minuDay = minuDay + 1 ;
      }
      let res = [];
      for(let i = 1 ; i <= 31 ; i ++ ){
         res.push(i + '')
      }
      return {
        dateArr:res,
        dayInfo:{
          year,
          month,
          weekDay,
          day:originDay
        }
      }
    },
    dayHandle (item) {
      console.log(item)
      this.targetDay = item
    },
    chooseDate (title) {
      console.log(title)
    },
    iconTap () {
      let { open } = this;
      if(!open) {
        this.scalelogo(500)
      }else{
        this.scalelogo(100)
      }
      this.open = !this.open
    },
    scalelogo (height) {
      const animationExtend = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animationExtend = animationExtend
      animationExtend.height(`${height}rpx`).step()
      this.animationExtend = this.animationExtend.export()

    }
  },
  onPullDownRefresh () {
    
  },
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
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.week div,.day div {
  width:100rpx;
  height:100rpx;
  text-align:center;
  line-height:100rpx;
  border-radius:100%;
  font-size:32rpx;
  position: relative;
}
.targetDay {
  color: #000;
  background-color: orchid;
}
.activeDay{
  background-color:#fff;
  color: #000;
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
  bottom: 0;
  left: 325rpx;
  background-color: #fff;
  line-height: 20rpx;
  text-align: center;
}
.borderBox{
  /* width:60rpx;
  height:60rpx;
  line-height:60rpx;
  text-align:center;
  margin:20rpx auto;
  border-radius: 100%; */
}
</style>
