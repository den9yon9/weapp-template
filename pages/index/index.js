import regeneratorRuntime from '../../lib/runtime.js'
import { list } from '../../service/api.js'

Page({
  data: {

  },
  location: null,

  async onLoad() {

  },

  async onShow() {
    // 确保更新权限后能重新获取位置信息
    if(this.location === null){
      this.location = await wx.getLocationSync(false)
      if(this.location){
        console.log(this.location)
      }
    }
  },

  async refreshLocation() {
    // 刷新位置信息
    this.location = await wx.getLocationSync()
    if(this.location){
      console.log(this.location)
    }
  }

})
