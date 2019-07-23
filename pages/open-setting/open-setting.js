Page({
  getSetting(e){
    let {authSetting} = e.detail
    wx.navigateBack({
      delta: 1
    })
  }
})