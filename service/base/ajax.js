export default function ajax({
  method = 'GET',
  data,
  url,
  header = {},
  isUpload = false
}) {
  return new Promise((resolve, reject) => {
    
    if (isUpload) {
      wx.showLoading({
        title: '上传中...',
        mask: true
      })
      wx.uploadFile({
        url,
        filePath: data.filePath,
        name: data.name || 'file',
        formData: data.formData,
        header,
        success(res) {
          if (res.statusCode === 200) {
            resolve(JSON.parse(res.data))
          } else {
            reject(new Error(`请求错误:statusCode ${res.statusCode}`))
          }
        },
        fail(err) {
          reject(new Error('请求失败'))
        },
        complete() {
          wx.hideLoading()
        }
      })
    } else {
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
            reject(new Error(`错误:statusCode ${res.statusCode}`))
          }
        },
        fail({
          errMsg
        }) {
          reject(new Error('请求失败'))
        },
        complete() {
          wx.hideNavigationBarLoading()
        }
      })
    }
  })
}