const app = getApp()
Page({
    getUserInfo (e) {
        if (e.detail.userInfo) {
            app.globalData.userInfo = e.detail
            wx.navigateBack({
                delta: 1
            })
            app.getUserInfoCallback && app.getUserInfoCallback(app.globalData.userInfo)
        } else {
            app.globalData.userInfo = false
            wx.navigateBack({
                delta: 1
            })
            app.getUserInfoFailback && app.getUserInfoFailback('用户拒绝授权用户信息')
        }
    }
})
