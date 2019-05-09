const app = getApp()
Page({
    data: {

    },

    onLoad: function (options) {

    },

    getUserInfo: function (e) {
        if (e.detail.userInfo) {
            app.globalData.infos = e.detail
            wx.navigateBack({
                delta: 1
            })
            app.getUserInfoCallback && app.getUserInfoCallback(app.globalData.infos)
        } else {
            app.globalData.infos = false
            wx.navigateBack({
                delta: 1
            })
            app.getUserInfoFailback && app.getUserInfoFailback('用户拒绝授权用户信息')
        }
    }
})
