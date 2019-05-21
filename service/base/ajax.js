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
          reject('statusCode:' + res.statusCode)
        }
      },
      fail({errMsg}) {
        reject(`${errMsg}:请求失败:请检查网络`)
      },
      complete() {
        wx.hideNavigationBarLoading()
      }
    })
  })
}