function askUserInfos({
  success,
  fail,
  auth = true
}) {
  const app = getApp()
  if (app.globalData.infos) {
    // 用户已授权，且已拿到用户信息，则直接返回用户信息
    success && success(app.globalData.infos)
    return
  } else if (app.globalData.infos === false) {
    // 用户明确拒绝了授权，执行拒绝授权兼容逻辑
    app.globalData.infos = null
    askUserInfos({
      success,
      fail,
      auth
    })
  } else if (app.globalData.infos === null) {
    // 未知用户是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              app.globalData.infos = res
              success && success(res)
            }
          })
        } else {
          // 未授权获取用户信息，进入授权引导
          app.getUserInfoCallback = success
          app.getUserInfoFailback = fail
          if (auth) {
            if (typeof auth === 'boolean') {
              wx.navigateTo({
                url: '/pages/auth/auth'
              })
            } else if (typeof auth === 'string') {
              wx.showModal({
                title: '提示',
                content: auth,
                success: res => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/auth/auth'
                    })
                  }
                }
              })
            }
          } else {
            fail && fail('请引导用户授权后再获取用户信息')
          }
        }
      }
    })
  }
}


// 获取用户信息方法，不宜在app.js中使用此方法，因为会干扫扫码或进入分享页面的场景逻辑
/**
 * auth: boolean || 'String'
 *  默认: true, 不提示直接前往授权页面
 *        false, 不前往授权
 *        string, 自定义提示语并前往授权页面
 */
export default function getUserInfos(auth = true) {
  return new Promise((resolve, reject) => {
    askUserInfos({
      success: infos => {
        resolve(infos)
      },
      fail: err => {
        reject(err)
      },
      auth
    })
  })
}