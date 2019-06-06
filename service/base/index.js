import regeneratorRuntime from '../../utils/runtime.js'
import env from "../../env.js"
import setAccessToken from './setAccessToken'
import ajax from './ajax'

export default async function request(config) {
  const AC = wx.getStorageSync(env.atKey)
  try {
    if (AC === '') { // 未请求过AC,或请求AC失败
      await setAccessToken()
      return await request(config)
    } else if (AC === 'lock') { // AC请求中
      console.log('等待access_token更新...')
      // 500毫秒后再次请求
      await wx.sleep(500)
      return await request(config)
    } else if (AC) { // AC 存在
      let res = await ajax({
        method: config.method,
        url: env.domain + config.path,
        data: config.data,
        header: {
          "Access-Token": AC
        }
      })
      if (res.status === 'ok') {
        return res.data
      } else if (res.status === 'access_token_expired') {
        console.log('access_token已过期')
        // 重新生成并设置AC
        await setAccessToken()
        return await request(config)
      } else {
        throw new Error(`操作失败:${res.message || res.status}`)
      }
    }
  } catch (err) {
    wx.showModalSync(err.message)
    throw err
  }
}