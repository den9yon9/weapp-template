function askUserInfo({
  success,
  fail,
  goToGrantOrNot
}) {
  const app = getApp()
  if (app.globalData.userInfo) {
    // 用户同意授权，且已拿到用户信息，则直接返回用户信息
    success(app.globalData.userInfo)
    return
  } else if (app.globalData.userInfo === false) {
    // 用户拒绝授权，执行拒绝授权兼容逻辑
    app.globalData.userInfo = null
    askUserInfo({
      success,
      fail,
      auth
    })
  } else if (app.globalData.userInfo === null) {
    // 未知用户是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              app.globalData.userInfo = res
              success(res)
            }
          })
        } else {
          // 未授权获取用户信息，进入授权引导
          app.getUserInfoCallback = success
          app.getUserInfoFailback = fail
          if (goToGrantOrNot) {
            wx.navigateTo({
              url: '/pages/grant-userinfo/grant-userinfo'
            })
          } else {
            fail && fail('请引导用户授权后再获取用户信息')
          }
        }
      }
    })
  }
}


// 获取用户信息方法，不宜在app.js中使用此方法，因为会干扫扫码或进入分享页面的场景逻辑
export default function getUserInfo(goToGrantOrNot = true) {
  return new Promise((resolve, reject) => {
    askUserInfo({
      success: userInfo => {
        resolve(userInfo)
      },
      fail: errMsg => {
        reject(new Error(errMsg))
      },
      goToGrantOrNot
    })
  })
}
