import regeneratorRuntime from '../../lib/runtime.js'
Page({
  data: {
    userInfo: {}
  },

  async onLoad(options) {
    try {
      let userInfo = await wx.getUserInfoSync()
      this.setData({ userInfo })
    } catch (err) {
      this.setData({ userInfo: null })
    }
  },

  getUserInfo(e) {
    let { userInfo } = e.detail
    if(userInfo){
      this.setData({ userInfo })
    }
  }
})