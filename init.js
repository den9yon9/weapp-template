export default function init(wx) {
  wx.sleep = function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  wx.showModalSync = function (content, {
    title = '提示',
    showCancel = true
  } = {}) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title,
        content: content.toString(),
        showCancel,
        success(res) {
          if (res.confirm) {
            resolve(true)
          } else {
            resolve(false)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
    })
  }

    wx.chooseImageSync = function ({
      count = 1,
      sizeType = ['original', 'compressed'],
      sourceType = ['album', 'camera']
    }) {
      return new Promise((resolve, reject) => {
        wx.chooseImage({
          count,
          sizeType,
          sourceType,
          success(res) {
            resolve(res.tempFilePaths[0])
          },
          fail(err) {
            reject('取消选择')
          }
        })
      })
    }
}