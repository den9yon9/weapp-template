// import regeneratorRuntime from './utils/runtime.js'
import env from 'env.js'
import setAccessToken from './service/base/setAccessToken'
import init from './utils/init.js'

App({
  onLaunch() {
    init(wx)
    // 这里检查登陆态是为了保证服务器端的session_key是最新未失效的， session_key只用来解密用户信息
    wx.checkSession({
      //登录态过期，重新登陆认证
      fail(err) {
        setAccessToken().catch(wx.showModalSync)
      }
    })
  },

  globalData: {
    userInfo: null
  }

})