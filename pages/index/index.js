import regeneratorRuntime from '../../lib/runtime.js'
import { list } from '../../service/api.js'

Page({
  data: {
    userInfo: null,
    datepickerVisible: false,
    value: ['2019-10-11', '2020-01-12']
  },
  location: null,

  async onLoad() {
    /**
     * TODO: 查询用户信息，设置用户信息与手机号码，以供判断是否展示请求授权手机弹框
     */
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

  getPhoneNumber(e) {
    let { encryptedData, iv } = e.detail
    /**
     * TODO:  调用后端接口绑定用户手机号码
     */
  },

  async refreshLocation() {
    // 刷新位置信息
    this.location = await wx.getLocationSync()
    if(this.location){
      console.log(this.location)
    }
  },

  showDatepicker(){
    this.setData({
      datepickerVisible: true
    })
  }

})
