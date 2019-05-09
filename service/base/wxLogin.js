// 获取微信认证返回的code
export default function wxLogin() {
  console.log('微信认证中...')
  return new Promise((resolve, reject) => {
    wx.login({
      success({ code }) {
        resolve(code)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}