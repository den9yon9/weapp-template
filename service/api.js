import request from "./base/index.js"

module.exports = {
  list(data) {
    return request({
      method: 'GET',
      path: "/list",
      data
    })
  }
}