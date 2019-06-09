import regeneratorRuntime from '../../utils/runtime.js'
import getUserInfo from '../../utils/getUserInfo.js'
import { list } from '../../service/api.js'
console.log(getUserInfo)
Page({
  data: {
    userInfo: {}
  },

  async onLoad() {
    // await list()
    try {
      let { userInfo } = await getUserInfo()
      this.setData({
        userInfo
      })
    } catch (err) {
      console.log(err)
    }
  },

  async getUserInfo() {
    try {
      let { userInfo } = await getUserInfo()
      this.setData({
        userInfo
      })
    } catch (err) {
      console.log(err)
    }
  }
})