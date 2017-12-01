// pages/list/list.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['外卖', '点餐', '预定'],
    activeIndex: 0,
    dndd: [],
    wmdd: [],
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var imglink = wx.getStorageSync('imglink')
    // 网址信息
    var activeindex = options.activeindex
    this.setData({
      activeIndex: activeindex,
      imglink: imglink,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ptxx = wx.getStorageSync('bqxx')
    console.log(ptxx)
    var that = this
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var day = Number(res.data.day)
        console.log(day)
        if (day == 0) {
          day = 1
        }
        that.setData({
          day: day
        })
      },
    })
    if (ptxx.more == '1') {
      var nbcolor = wx.getStorageSync('bqxx').color
    }
    if (ptxx.more == '2') {
      var nbcolor = wx.getStorageSync('nbcolor')
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
    this.setData({
      color: nbcolor,
    })
    console.log('ddonShow')
    this.reLoad();
  },
  reLoad: function () {
    var uid = wx.getStorageSync('users').id;
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/MyReservation',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        that.setData({
          ydlist: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/myorder',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        var dndd = [], wmdd = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '1') {
            wmdd.push(res.data[i])
            that.setData({ dndd: dndd, wmdd: wmdd })
          }
          else {
            dndd.push(res.data[i])
            that.setData({ dndd: dndd, wmdd: wmdd })
          }
        }
        for (let i = 0; i < wmdd.length; i++) {
          if (wmdd[i].state == '3') {
            var end = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-")
            var start = wmdd[i].time.substring(0, 10)
            console.log(start, end)
            var xcts = util.DateDiff(start, end)
            console.log(xcts, that.data.day)
            if (xcts >= that.data.day) {
              app.util.request({
                'url': 'entry/wxapp/Complete',
                'cachetime': '0',
                data: { id: wmdd[i].id },
                success: function (res) {
                  console.log(res.data)
                  if (res.data == '1') {
                    console.log('自动确认收货')
                    that.reLoad()
                  }
                },
              })
            }
          }
        }
        console.log(dndd, wmdd)
      },
    })
  },
  //取消预约
  qxyy: function (e) {
    var that = this;
    console.log('取消预约' + e.currentTarget.dataset.yyid)
    wx.showModal({
      title: '提示',
      content: '确定取消预约么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/CancelReservation',
            'cachetime': '0',
            data: { id: e.currentTarget.dataset.yyid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看详情
  ckxq: function (e) {
    var that = this;
    console.log('查看详情' + e.currentTarget.dataset.yyid)
    wx.navigateTo({
      url: 'reserveinfo/reserveinfo?yyid=' + e.currentTarget.dataset.yyid,
    })
  },
  //取消订单
  qxdd: function (e) {
    var that = this;
    console.log('取消订单' + e.currentTarget.dataset.wmddid)
    wx.showModal({
      title: '提示',
      content: '确定取消订单么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/CancelOrder',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.wmddid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //外卖立即支付
  ljzf: function (e) {
    var that = this;
    console.log('立即支付' + e.currentTarget.dataset.wmddid)
    wx.navigateTo({
      url: 'waim/waim?wmddid=' + e.currentTarget.dataset.wmddid,
    })
  },
  //提醒商家
  txsj: function (e) {
    var that = this;
    console.log('提醒商家' + e.currentTarget.dataset.wmddtel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.wmddtel,
    })
  },
  //联系商家
  lxsj: function (e) {
    var that = this;
    console.log('联系商家' + e.currentTarget.dataset.wmddtel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.wmddtel,
    })
  },
  //确认收货
  qrsh: function (e) {
    var that = this;
    console.log('确认收货' + e.currentTarget.dataset.wmddid)
    wx.showModal({
      title: '提示',
      content: '确定收货么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Complete',
            'cachetime': '0',
            data: { id: e.currentTarget.dataset.wmddid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '收货成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除订单
  scdd: function (e) {
    var that = this;
    console.log('删除订单' + e.currentTarget.dataset.wmddid)
    wx.showModal({
      title: '提示',
      content: '删除订单么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelOrder',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.wmddid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //申请退款
  sqtk: function (e) {
    var that = this;
    console.log('申请退款' + e.currentTarget.dataset.wmddid)
    wx.showModal({
      title: '提示',
      content: '申请退款么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Tuik',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.wmddid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '申请成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //再来一单
  zlyd: function (e) {
    // var that = this;
    // console.log('再来一单' + e.currentTarget.dataset.wmddid)
    // wx.navigateTo({
    //   url: 'waim/waim?wmddid=' + e.currentTarget.dataset.wmddid,
    // })
    wx.switchTab({
      url: '../home/home',
    })
  },
  //评价
  pingjia: function (e) {
    var that = this;
    console.log('评价' + e.currentTarget.dataset.wmddid)
    wx.navigateTo({
      url: '../comment/comment?wmddid=' + e.currentTarget.dataset.wmddid,
    })
  },
  //店内立即支付
  dnljzf: function (e) {
    var that = this;
    console.log('立即支付' + e.currentTarget.dataset.dnddid)
    wx.navigateTo({
      url: 'choose/choose?dnddid=' + e.currentTarget.dataset.dnddid,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.reLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})