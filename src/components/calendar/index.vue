<template>
    <div class="calendar" :style="{backgroundColor: bgColor}">
      <div class="dateWrap">
          <div class="dateWrapStr" @click="changeTitle">{{dayStr}} ∨</div>
          <div class="backToday">
            <block>
              <span v-if="isToday">今天</span>
              <span v-else @click="backToday">返回今天</span>
            </block>
          </div>
      </div>
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
        <div @click="dayHandle(item)" :class="{activeDay:nowDateInfo.year == item.year && nowDateInfo.month == item.month && nowDateInfo.day == item.day,targetDay:adjustDate && adjustDate.day == item.day && adjustDate.month == item.month && adjustDate.year == item.year}" v-for="(item, index) in list" :key="index">
          <div class="borderBox">{{item.day > 0 ? item.day : ''}}<div class="myBadge" v-if="nowDateInfo.year == item.year && nowDateInfo.month == item.month && nowDateInfo.day == item.day">今</div>
          <div class="dayDot" v-if="item.hasDot" :style="{backgroundColor: item.type === 'normal' ? normalColor : unNormalColor}"></div>
          </div>
        </div>
      </div>
      
      <!-- <div class="dateBox">{{targetDay}}
        <slot></slot>
          <div class="iconTool" @click="iconTap">
            <i-icon :type="open ? 'packup' : 'unfold'" />
        </div>
      </div> -->
      <div class="iconTool" @click="iconTap">
            <i-icon :type="open ? 'packup' : 'unfold'" />
        </div>
      <picker-view class="datePickView" v-if="isShowPickView" indicator-style="height: 50px;" style="width: 100%; height: 300px;" :value="value" @change="changePickView">
        <picker-view-column>
            <view v-for="(item, index) in years" :key="index" style="line-height: 50px">{{item}}年</view>
        </picker-view-column>
        <picker-view-column>
            <view v-for="(item, index) in months" :key="index" style="line-height: 50px">{{item}}月</view>
        </picker-view-column>
        </picker-view>
      
      
      <div class="mask" v-if="maskShow" @click="closeMask"></div>
      
    </div>
</template>

<script>
import moment from 'moment'
import { formatNumber } from '../../utils/index';

/** 
 * @dotArr dot数组
 * @normalColor 正常dot颜色(默认aqua)
 * @unNormalColor 非正常dot颜色(默认orange)
 * @yearArr 年份范围
 * @pickHandle pickerview选择回调
 * @dateHandle 选中日期回调
 * @defaultCheckedDay 初始化默认选中日期
 * @defaultTargetDay 初始化底部日期显示
 * @initFlod 初始化是否折叠
 * @bgColor 日历背景颜色
 */

export default {
  props: {
      dotArr: Array,//标记点
      yearArr: Array,//年份范围
      defaultCheckedDay: Object,//默认选中日期
      defaultTargetDay: String,//底部dom日期
      initFlod: Boolean,//初始化是否折叠
      normalColor: {
        type: String,
        default: 'aqua',
      },
      unNormalColor: {
        type: String,
        default: 'orange',
      },
      bgColor: {
        type: String,
        default: '#333'
      }
  },
  data () {
    return {
      list:[],
      dayStr:'',
      dayInfo:'',
      targetDay:'' || this.defaultTargetDay,
      open: this.initFlod,
      animationExtend:{},
      currentDayInfo: '',
      currentArr:'',//当前星期数组

      adjustDate: '' || this.defaultCheckedDay,//当选日期选中时间

      chooseDate:'',
      day:'',

      years: [],
      year: new Date().getFullYear(),
      months: [],
      month: 2,
      value: [],

      isShowPickView:false,
      maskShow:false,

      nowDateInfo: '',//当前时间
      isToday: false,
    }
  },

  created () {
    const date = this.defaultTargetDay || '';
    this.initYearMonth(date)
    this.showToday(date)
    date ? this.initCalendar(date, true) : this.initCalendar(date)
  },
  methods: {
    initYearMonth(date) {
        // const date = new Date()
        const [startYear, endYear] = this.yearArr;
        const years = []
        const months = []
        const value = [];

        for (let i = startYear; i <= endYear; i++) {
            years.push(i)
        }

        for (let i = 1 ; i <= 12; i++) {
            months.push(i)
        }
        const yearIndex = years.findIndex(item => item === moment(date).year());
        const monthIndex = months.findIndex(item => item === (moment(date).month() + 1));
        value.push(yearIndex, monthIndex)
        this.years = years;
        this.months = months;
        this.value = value;
    },
    //初始化日历渲染
    initCalendar (date, init) {
      // let chooseDate = init ? moment().unix() * 1000 : date || moment().unix() * 1000 ;
      let chooseDate = date;
      const calendarInfo = this.showCalendar(chooseDate, init);
      const { dayInfo } = calendarInfo;
      if(this.open) {
        this.list = calendarInfo.currentMonthAllDate;
      }else{
        this.list = calendarInfo.dateArr;
      }
      this.day = dayInfo.day;
      this.targetDay = `${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`
      this.currentDayInfo = {
        day:formatNumber(dayInfo.day),
        month:dayInfo.month,
        year:dayInfo.year
      }//当前日的年月日信息
      this.dayStr = `${dayInfo.year}年${dayInfo.month}月`;
      this.dayInfo = dayInfo;
      this.currentArr = calendarInfo.currentObj.arr;
      this.chooseDate = calendarInfo.chooseDate
    },
    //显示今天
    showToday(date) {
      const [year, month, day] = moment().toArray();
      const targetDay = `${year}-${formatNumber(month + 1)}-${formatNumber(day)}`;
      this.isToday = targetDay === date;
      this.nowDateInfo = {
        year,
        month: formatNumber(month + 1),
        day,
      }
      
    },
    //计算日期---日历显示
    showCalendar (date, init) {
      const { dotArr, nowDateInfo } = this;
      const timeArr = moment(date).toArray();
      const daysInMonth = moment(date).daysInMonth();//当前一个月的天数
      const daysInMonthPre = moment(date).subtract(1, 'month').daysInMonth();//前一个月的天数
      const year = timeArr[0];
      const month = formatNumber(timeArr[1] + 1);
      const originDay = timeArr[2]
      let day = timeArr[2];
      let minuDay = day;
      const weekDay = moment(date).day();//当前日子星期几
      const monthStartWeek = moment(date).startOf('month').day();//当前月份第一天星期几
      let dateArr = this.flodDateChange({weekDay, day, minuDay, daysInMonth, year, month});
      //dot数组
      let dotArrRes = dotArr.map(val => {
          const [year, month, day] = val.date.split('-');
          const { type } = val;
          return {
            year: year * 1,
            month,
            day,
            type,
          }
      })
      
      //折叠显示dot的数组
      let adateArr = dateArr.map(day => {
        let obj = {
          year,
          month,
          day,
        }
        dotArrRes.forEach(b => {
          if(b.year == obj.year && b.month == obj.month && b.day == obj.day) {
            obj.hasDot = true;
            obj.type = b.type
          }
        })
        return obj
      })
      

      const currentObj = {
        arr: adateArr
      };//当前星期列表对象
      
      let res = [];//当前月份所有日期对象
      for(let i = 1 ; i <= daysInMonth ; i ++ ) {
        
        res.push({
          day:formatNumber(i),
          month,
          year
        })
      }
      res = res.map(a => {
        let obj = {...a}
        dotArrRes.forEach(b => {
          if(b.year == obj.year && b.month == obj.month && b.day == obj.day) {
            obj.hasDot = true
            obj.type = b.type
          }
        })
        return obj
      })
      for(let i = 0 ; i < monthStartWeek ; i ++ ) {
        res.unshift('')
      }
      let dayInfo = init ? this.defaultCheckedDay : {
        year,
        month,
        weekDay,
        day:formatNumber(originDay)
      };
      return {
        dateArr: currentObj.arr,//单行展示
        dayInfo,//当前选中日期---面板str
        currentObj,//当前数组储存值
        currentMonthAllDate:res,//当前月份所有日期(全展示)
        chooseDate: date
      }
    },

    // 折叠日期更改与显示
    flodDateChange({weekDay, day, minuDay, daysInMonth, year, month}) {
      let dateArr = new Array(7);
      const { nowDateInfo } = this;
      dateArr[weekDay] = formatNumber(day);
      for(let i = weekDay - 1 ; i >= 0 ; i -- ) {
        if(day <= 1) {
          day = '';
        }
        dateArr[i] = formatNumber(day - 1);
        day = day - 1 ;
      }
      for(let i = weekDay + 1 ; i < 7 ; i ++ ) {
        if(minuDay >= daysInMonth) {
          dateArr[i] = '';
        }else{
          dateArr[i] = formatNumber(minuDay + 1);
          minuDay = minuDay + 1 ;
        }
      }
      return dateArr
    },

    //点击日期回调
    dayHandle (item) {
      if(item) {
        const targetDay = `${item.year}-${item.month}-${item.day}`
        this.targetDay = targetDay;
        this.adjustDate = item;
        this.dayStr = `${item.year}年${item.month}月`;
       
        const weekDay = moment(targetDay).day();
        const timeArr = moment(targetDay).toArray();
        const daysInMonth = moment(targetDay).daysInMonth();
        const day = timeArr[2];
        const minuDay = day;
        const year = timeArr[0];
        const month = formatNumber(timeArr[1] + 1);

        this.chooseDate = targetDay;

        this.flodDateChange({weekDay, day, minuDay, daysInMonth, year, month})
        this.$emit('dateHandle', this.targetDay)

        console.log(this.nowDateInfo)
      } 
    },
    //更改显示日期
    changeTitle (title) {
      this.isShowPickView = true;
      this.maskShow = true;
    },
    //折叠点击
    iconTap () {
      let chooseDate = this.chooseDate;
      const weekDay = moment(moment(chooseDate).startOf('month').unix() * 1000).day();//当前月份1号是周几（1号前面空几个）
      const chooseDateMonthDays = moment(chooseDate).daysInMonth();
      let { open, list } = this;
      let calcuDays = weekDay + chooseDateMonthDays;
      let emptyPlace = weekDay;
      if(!open) {
        let scrollHeight;
        if(calcuDays >= 36) {
          scrollHeight = 650
        }else{
          scrollHeight = 550
        }
        this.scalelogo(scrollHeight);
        this.list = this.showCalendar(chooseDate).currentMonthAllDate
      }else{
        this.scalelogo(100);
        const currentArr = this.showCalendar(chooseDate).currentObj.arr;
        this.list = currentArr
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
    },
    changePickView (e) {
      const val = e.mp.detail.value;
      const year = this.years[val[0]];
      const month = this.months[val[1]];
      this.value = val;
      this.year = year;
      this.month = month;
      //切换月份选中每个月1号
      this.adjustDate = {
        year,
        month,
        day: '01'
      }
      this.dayStr = `${year}年${month}月`
      this.$emit('pickHandle', `${year}-${formatNumber(month)}-01`)
      this.isShowPickView = false;
      this.maskShow = false;
    },
    closeMask () {
      this.maskShow = false;
      this.isShowPickView = false;
    },
    backToday() {
        const [year, month, day] = moment().toArray();
        const targetDay = `${year}-${formatNumber(month + 1)}-${formatNumber(day)}`
        this.targetDay = targetDay
        this.adjustDate = {
            year,
            month: formatNumber(month + 1),
            day: formatNumber(day),
        }
        console.log(this.nowDateInfo)
        this.$emit('pickHandle', this.targetDay)
        
        this.initCalendar()
        this.initYearMonth(targetDay)
    } 
  },
  watch: {
    targetDay(newVal, oldVal) {
      const [year, month, day ] = moment().toArray();
      const targetDay = `${year}-${formatNumber(month + 1)}-${formatNumber(day)}`
      if(targetDay === newVal) {
        this.isToday = true;
      }else {
        this.isToday = false;
      }
        
    },
    dayStr:function(newVal, oldVal){
      if(newVal && oldVal) {
        const date = newVal.replace(/[年|月]+/g, '-').split('-');
        const targetDay = this.targetDay.split('-');
        const year = date[0];
        const month = formatNumber(date[1]);
        this.year = year;
        this.month = month;
        let chooseDate;
        if(year == targetDay[0] && month == targetDay[1]) {
          chooseDate = moment(`${year}-${month}-${targetDay[2]}`).unix() * 1000;
        }else {
          chooseDate = moment(`${year}-${month}-01`).unix() * 1000;
        }
        
        this.initCalendar(chooseDate)
      }
    },
    chooseDate:function(newVal, oldVal) {
      if(!this.open) {
        this.scalelogo(100);
        const currentArr = this.showCalendar(newVal).currentObj.arr;
        this.list = currentArr
      }else{
        const weekDay = moment(moment(newVal).startOf('month').unix() * 1000).day();//当前日子星期几
        const chooseDateMonthDays = moment(newVal).daysInMonth();
        let calcuDays = weekDay + chooseDateMonthDays;
        let scrollHeight;
        if(calcuDays >= 36) {
          scrollHeight = 650
        }else{
          scrollHeight = 550
        }
        this.scalelogo(scrollHeight);
        if(!oldVal) {
          this.list = this.showCalendar(newVal, true).currentMonthAllDate
        }else {
          this.list = this.showCalendar(newVal).currentMonthAllDate
        }
        
      }
    }
  },
}
</script>

<style>
.calendar{
  width: 100%;
  /* height: 160rpx; */
  background-color: #333;
  position: relative;
}
.dateWrap {
    width: 100%;
    height: 80rpx;
    position: relative;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center; 
}
.dateWrap .dateWrapStr {
    color: #333;
    margin-left: 20rpx;
}
.dateWrap .backToday {
    font-size: 26rpx;
    border: 2rpx solid #333;
    padding: 4rpx 10rpx;
    margin-right: 20rpx;
    border-radius: 10rpx;
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
  position: relative;
}

.iconTool {
  width: 100rpx;
  height: 20rpx;
  position: absolute;
  top: 0rpx;
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
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
}
</style>
