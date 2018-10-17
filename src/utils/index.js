function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function request (url = '', options = {}) {
  var params = {
    ...options.data
  } || {}
  var {
    method, dataType, responseType, header
  } = options
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: {
        ...params
      },
      header: header || {
        'content-type': 'application/json'
      },
      method: method || 'GET',
      dataType: dataType || 'json',
      responseType: responseType || 'text',
      success: function (res) {
        if (res && res.data) {
          resolve(res.data)
        }
      },
      fail: function (err) {
        if (err) {
          reject(err)
        }
      }
    })
  })
}

export default {
  formatNumber,
  formatTime
}
