// zh_wpdc/pages/coupons/coupons_details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ptxx = wx.getStorageSync('bqxx')
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
      color: nbcolor
    })
    var that = this
    // user_id
    var user_id = wx.getStorageSync('users').id
    console.log(options)
    // 判断用户是通过代金券还是优惠券点击进入的优惠券详情
    var type = options.type
    // 得到用户点击的优惠券id
    var id = options.id
    // 判断用户进入的是领取的详情还是已经领取的详情
    var state = options.state
    if (state == 1) {
      // 获取优惠券
      app.util.request({
        'url': 'entry/wxapp/Coupons',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res)
          var coupons = res.data.all
          for (var i = 0; i < coupons.length; i++) {
            if (id == coupons[i].id) {
              console.log(coupons[i])
              var coupons_type = coupons[i].coupons_type
              if (type == 1) {
                that.setData({
                  coupons: coupons[i],
                  coupons_type: coupons_type
                })
              }

            }
          }

        }
      })

      // 获取代金券
      app.util.request({
        'url': 'entry/wxapp/Voucher',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res)
          var coupons = res.data.all
          for (var i = 0; i < coupons.length; i++) {
            if (id == coupons[i].id) {
              console.log(coupons[i])
              var coupons_type = coupons[i].voucher_type
              if (type == 2) {
                that.setData({
                  coupons: coupons[i],
                  coupons_type: coupons_type
                })
              }

            }
          }

        }
      })
    } else {
      // 获取优惠券
      app.util.request({
        'url': 'entry/wxapp/Coupons',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res)
          var coupons = res.data.ok
          for (var i = 0; i < coupons.length; i++) {
            if (id == coupons[i].id) {
              console.log(coupons[i])
              var coupons_type = coupons[i].coupons_type
              if (type == 1) {
                that.setData({
                  coupons: coupons[i],
                  coupons_type: coupons_type
                })
              }

            }
          }

        }
      })
      // 获取代金券
      app.util.request({
        'url': 'entry/wxapp/Voucher',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res)
          var coupons = res.data.ok
          for (var i = 0; i < coupons.length; i++) {
            if (id == coupons[i].id) {
              console.log(coupons[i])
              var coupons_type = coupons[i].voucher_type
              if (type == 2) {
                that.setData({
                  coupons: coupons[i],
                  coupons_type: coupons_type
                })
              }

            }
          }

        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
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