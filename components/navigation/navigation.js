const app = getApp();
Component({
  properties: {
    //小程序页面的表头
    title: {
      type: String
    },
    // 表头字体颜色
    color: {
      type: String,
      value: '#000'
    },
    // 表头水平方向
    justify: {
      type: String,
      value: 'center'
    }
  },

  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
    showBack: false,
    justify: 'center'
  },

  ready() {
    let pages = getCurrentPages()
    this.setData({
      showBack: Boolean(pages.length-1)
    })
    // 因为很多地方都需要用到，所有保存到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
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
          this.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        fail: err => {
          this.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  methods: {
    back(){
      wx.navigateBack({
        delta: 1
      })
    }
  }
})