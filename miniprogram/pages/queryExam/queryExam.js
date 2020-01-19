// pages/queryExam/queryExam.js

const app = getApp()
const db_name = 'exam_20191214'

Page({

  data: {
    openid: '',
    step: 1,
    count: null,
    mobile: null,
    name: null,
    queryResult: '',
    result: null,
    showResult: false
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  resetInput: function() {
    this.setData({
      mobile: null,
      name: null
    })
  },

  bindMobile: function (e) {
    this.setData({
      mobile: parseInt(e.detail.value)
    })
  },

  bindStudentName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  onQuery: function() {
    const db = wx.cloud.database()

    db.collection(db_name).where({
      mobile: this.data.mobile,
      name: this.data.name
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        if (res.data.length != 0 && res.data[0].order) {
          this.setData({
            showResult: true,
            result: res.data[0]
          })
          this.resetInput()

          wx.showModal({
            title: '抽签成功',
            showCancel: false,
            content: `抽签结果为:` + res.data[0].order,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        } else {
          wx.showModal({
            title: '查询失败',
            showCancel: false,
            content: `未查到记录，请输入正确的信息。`,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})