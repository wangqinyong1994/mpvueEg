<template>
  <div class="myView">
    <myHead 
      :progressPer="loadPercent"
    />
    <div class="blankView1"></div>
    <scroll-view 
    @scroll="viewScroll" 
    @scrolltolower="scrolltolower"
    @scrolltoupper="scrolltoupper"
    :upper-threshold="10"
    scroll-y class="scrollWrap" :style="{height:scrollHeight + 'rpx'}">
      <div>
        <img :src="userInfo.avatarUrl" class="avatarUrl">
        <div class="nickName">{{userInfo.nickName}}</div>
      </div>
      <i class="iconfont icon-rili"></i>
      <i-button  @click="pulldown" type="primary" :loading="updateBtnLoading" >点我更新</i-button>
      <i-button  @click="downloadFile" type="primary" :loading="downloadBtnLoading" >点我下载图片</i-button>
      <i-button v-if="!userInfo" open-type="getUserInfo"  @getuserinfo="getuserinfo" type="primary" >获取用户信息</i-button>
      <i-button v-if="!userInfo" open-type="getPhoneNumber"  @getphonenumber="getphonenumber" type="primary" >获取用户手机号</i-button>
      <div>store的count：{{count}}</div>
      <div @click="toPrePage" style="color:orange">到跳转页面</div>
      <ul>
          <li v-for="(item, index) in lists" :key="index">
              {{item}}
          </li>
      </ul>
      <i-load-more class="loadmore" v-if="isBtm" :tip="loadMoreTip" :loading="loadMoreLoading"/>
    </scroll-view>
    <i-toast id="toast" />
  </div>
</template>

<script>
import card from '@/components/card'
import myHead from '@/components/myHead'
import { mapState } from 'vuex'
import { $Toast } from '../../../static/iview/base/index'

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {},
      updateInfo: '',
      updateBtnLoading: false,
      lists: [],
      isBtm: false,
      loadMoreTip: '',
      loadMoreLoading: false,
      downloadBtnLoading: false,
      scrollHeight:'',
      loadPercent: 0,
      isProgressShow: false,
    }
  },

  components: {
    card,
    myHead
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      // console.log('clickHandle:', msg, ev)
    },
    pulldown () {
      wx.startPullDownRefresh({
        success: res => {
          this.pageInit()
        }
      })
    },
    pageInit () {
      this.updateBtnLoading = true
      this.updateInfo = '更新中...'
      clearTimeout(timer)
      var timer = setTimeout(() => {
        wx.stopPullDownRefresh()
        this.updateInfo = '更新完了'
        this.updateBtnLoading = false
      }, 3000)
    },
    downloadFile () {
      this.downloadBtnLoading = true;
      const downloadTask = wx.downloadFile({
        url: 'http://joyowyb.oss-cn-hangzhou.aliyuncs.com/wechat/lowVersionShare.png',
        success: res => {
          if (res.statusCode === 200) {
            // wx.previewImage({
            //   urls: ['http://joyowyb.oss-cn-hangzhou.aliyuncs.com/wechat/lowVersionShare.png']
            // })
          }else {
            downloadTask.abort()
            $Toast({
              content:'出错了',
              type:'error'
            })
            this.downloadBtnLoading = false;
          }
        },
        fail:err => {
          downloadTask.abort()
          $Toast({
            content:'出错了',
            type:'error'
          })
          this.downloadBtnLoading = false;
        }
      })
      downloadTask.onProgressUpdate(res => {
        const { progress } = res;
        this.loadPercent = progress;
        if(progress === 100) {
          this.downloadBtnLoading = false;
        }
      })
      
    },
    viewScroll (e) {
      // const { scrollHeight, scrollTop } = e.mp.detail;
      // let scrollHei = this.scrollHeight;
      // if(scrollTop >= scrollHeight - scrollHei) {
      //   this.isBtm = false;
      // }
      
    },
    scrolltolower () {
      this.isBtm = true;
      this.loadMoreTip = '加载中...';
      this.loadMoreLoading = true;
      clearTimeout(timer)
      var timer = setTimeout(() => {
        this.loadMoreTip = '暂无数据';
        this.loadMoreLoading = false;
      }, 3000);
      
    },
    scrolltoupper () {
      this.pulldown()
    },
    toPrePage () {
      wx.navigateTo({
        url:'../prePage/main'
      })
    },
    getuserinfo (e) {
      const { userInfo } = e.mp.detail;
      this.userInfo = userInfo;
    },
    getphonenumber (e) {
      console.log(e)
    }
  },
  computed: {
    ...mapState(['count'])
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
    wx.getSystemInfo({
      success: res => {
        const clientWidth = res.windowWidth;
        const clientHeight = res.windowHeight;
        const scale = 750/clientWidth;
        const scrollHeight = clientHeight * scale - 201;
        this.scrollHeight = scrollHeight;
      }
    })
    let lists = [];
    for(let i = 0; i < 30 ; i ++ ){
      lists.push(i)
    }
    this.lists = lists
  },
  mounted () {
    
  },
  /** 下拉刷新 */
  onPullDownRefresh () {
    this.pageInit()
  },
  /** 上拉加载 */
  onReachBottom () {
    this.isBtm = true
    this.loadMoreTip = '加载中...'
    this.loadMoreLoading = true
    setTimeout(() => {
      this.loadMoreTip = '暂无数据'
      this.loadMoreLoading = false
    }, 3000)
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.myView{
  width: 100%;
  height: 100%;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}

.loadmore{
  width: 100%;
}

.blankView1{
  width: 100%;
  height: 201rpx;
}
.scrollWrap{
  height: calc(100% - 201rpx);
}

.avatarUrl{
  width:80rpx;
  height:80rpx;
  border-radius:100%;
  margin:20rpx auto;
  display:block;
}
.nickName{
  text-align: center;
}
</style>
