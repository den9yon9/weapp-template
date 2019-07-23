import regeneratorRuntime from './lib/runtime.js'

export default function init(wx) {
  wx.sleep = function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  wx.timeFormat = function(date) {
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

  wx.dateFormat = function(date, separator = '-') {
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join(separator)
  }

  wx.showModalSync = function(content, {
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

  wx.chooseImageSync = function({
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
          reject('取消选择文件')
        }
      })
    })
  }

  wx.getUserInfoSync = function() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo'] === true) { // 已授权
            wx.getUserInfo({
              success({
                userInfo
              }) {
                resolve(userInfo)
              },
              fail({
                errMsg
              }) {
                reject(new Error(errMsg))
              }
            })
          } else if (res.authSetting['scope.userInfo'] === false) { // 拒绝授权
            reject(new Error('用户已拒绝授权用户信息'))
          } else if (res.authSetting['scope.userInfo'] === undefined) { // 未请求授权
            reject(new Error('用户尚未授权用户信息'))
          }
        }
      })
    })
  }

  function getLocation(noticeMsg ='需要使用您的位置信息，是否重新授权') {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] === true || res.authSetting['scope.userLocation'] === undefined) { // 已授权或未授权
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                resolve(res)
              },
              fail({
                errMsg
              }) {
                reject(new Error(`获取位置信息失败：${errMsg}`))
              }
            })
          } else if (res.authSetting['scope.userLocation'] === false) { // 拒绝授权
            if(noticeMsg === false){
              resolve(null)
              return
            }
            wx.showModal({
              title: '授权请求',
              content: noticeMsg,
              success: ({
                confirm
              }) => {
                if (confirm) {
                  wx.navigateTo({
                    url: '/pages/open-setting/open-setting'
                  })
                  reject(new Error('正在前往授权'))
                } else {
                  reject(new Error(`获取位置信息失败：用户拒绝授权`))
                }
              }
            })
          }
        }
      })
    })
  }

  wx.getLocationSync = async function (noticeMsg) {
    /**
     * noticeMsg: string | boolean
     * string: 授权提示语 | boolean: false(不提示，不跳转，默默成功，默默失败)
     */
    let location = null
    try {
      location = await getLocation(noticeMsg)
    } catch ({message}) {
      wx.showToast({
        title: message,
        icon: 'none'
      })
    } finally {
      return location
    }
  }
}