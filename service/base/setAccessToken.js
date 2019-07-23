import regeneratorRuntime from '../../lib/runtime.js'
import env from '../../env'
import genAccessToken from './genAccessToken'

export default async function setAccessToken() {
  if (wx.getStorageSync(env.atKey) === 'lock') return; // 针对并发请求，只允许一个请求去更新AC
  wx.setStorageSync(env.atKey, 'lock')

  try {
    const access_token = await genAccessToken()
    wx.setStorageSync(env.atKey, access_token)
    console.log('access_token已更新')
  } catch (err) {
    wx.removeStorageSync(env.atKey)
    console.log('更新access_token失败')
    throw err
  }
}