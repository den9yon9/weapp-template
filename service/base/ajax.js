export default function ajax({
  method = 'GET',
  data,
  url,
  header = {}
}) {
  return new Promise((resolve, reject) => {
    wx.showNavigationBarLoading()
    wx.request({
      method,
      data,
      url,
      header,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求错误:statusCode ${res.statusCode}`))
        }
      },
      fail({errMsg}) {
        reject(new Error('请求失败'))
      },
      complete() {
        wx.hideNavigationBarLoading()
      }
    })
  })
}