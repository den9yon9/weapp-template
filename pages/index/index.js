import regeneratorRuntime from '../../utils/runtime.js'
import getUserInfos from '../../utils/getUserInfos.js'
import { list } from '../../service/api.js'

Page({
  data: {
    userInfo: {}
  },

  async onLoad() {
    try {
      let { userInfo } = await getUserInfos(false)
      this.setData({
        userInfo
      })
    } catch (err) {
      console.log(err)
    }
  },

  async getUserInfo() {
    try {
      let { userInfo } = await getUserInfos()
      this.setData({
        userInfo
      })
    } catch (err) {
      console.log(err)
    }
  }
})