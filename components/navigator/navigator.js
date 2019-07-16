const app = getApp();
Component({
  properties: {
    //小程序页面的表头
    title: {
      type: String,
      default: '首页'
    },
    // 表头字体颜色
    color: {
      type: String,
      default: '#000'
    }
  },

  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
  },

  ready() {
    // 因为很多地方都需要用到，所有保存到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
      let that = this
      wx.getSystemInfo({
        success: res => {
          if (!app.globalData) {
            app.globalData = {}
          }
          if (res.model.indexOf('iPhone') !== -1) {
            app.globalData.titleBarHeight = 44
          } else {
            app.globalData.titleBarHeight = 48
          }
          app.globalData.statusBarHeight = res.statusBarHeight
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        fail: err => {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  methods: {

  }
})