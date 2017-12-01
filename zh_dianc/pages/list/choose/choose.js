// pages/choose/choose.js
// pages/listinfo/listinfo.js
var app=getApp();
var dnform_id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { name: "回锅肉", num: 1, money: '23.8' },
      { name: "番茄鸡蛋", num: 1, money: '18' }
    ]
  },
  
  // 点击拨打电话
  call_phone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: '02750661298'
    })
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
    var that = this
    that.setData({
      color: nbcolor
    })
    var imglink = wx.getStorageSync('imglink')
    var that = this;
    var dnddid = options.dnddid;
    console.log(dnddid)
    app.util.request({
      'url': 'entry/wxapp/OrderInfo',
      'cachetime': '0',
      data: { id: dnddid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          dnddinfo: res.data,
          imglink: imglink,
        })
      },
    })
  },
  formSubmit: function (e) {
    var that = this
    dnform_id = e.detail.formId
    // that.setData({
    //   form_id: form_id
    // })
    console.log(dnform_id)
  },
  onPay: function () {
    var user_id = wx.getStorageSync('users').id, openid = wx.getStorageSync('openid'), money = this.data.dnddinfo.order.money,
      order_id = this.data.dnddinfo.order.id, coupons_id = this.data.dnddinfo.order.coupons_id, voucher_id = this.data.dnddinfo.order.voucher_id;
    console.log(user_id, openid, money, order_id, coupons_id, voucher_id)
    if (dnform_id == '') {
      wx: wx.showToast({
        title: '网络不好',
        icon: 'loading',
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/pay',
        'cachetime': '0',
        data: { openid: openid, order_id: order_id, money: money },
        success: function (res) {
          console.log(res)
          // 支付
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log(res.data)
              console.log(res)
              wx.showToast({
                title: '支付成功',
                duration: 1000
              })
              // 打印机
              // app.util.request({
              //   'url': 'entry/wxapp/DnPrint',
              //   'cachetime': '0',
              //   data: { order_id: order_id },
              //   success: function (res) {
              //     console.log(res)
              //   },
              // })
              // app.util.request({
              //   'url': 'entry/wxapp/DnPrint2',
              //   'cachetime': '0',
              //   data: { order_id: order_id },
              //   success: function (res) {
              //     console.log(res)
              //   },
              // })
              // 改变订单状态
              app.util.request({
                'url': 'entry/wxapp/PayOrder',
                'cachetime': '0',
                data: { user_id: user_id, order_id: order_id, coupons_id: coupons_id, voucher_id: voucher_id },
                success: function (res) {
                  console.log(res)
                  // 支付成功一秒后返回
                  setTimeout(function () {
                    wx.navigateBack({

                    })
                  }, 1000)
                  console.log(wmform_id)
                  // // 下单发送模板消息
                  // app.util.request({
                  //   'url': 'entry/wxapp/Message',
                  //   'cachetime': '0',
                  //   data: { openid: openid, form_id: dnform_id, id: order_id },
                  //   success: function (res) {
                  //     console.log(res)

                  //   },
                  // })
                  // // 支付完成发送短信给商家
                  // app.util.request({
                  //   'url': 'entry/wxapp/sms',
                  //   'cachetime': '0',
                  //   success: function (res) {
                  //     console.log(res)

                  //   },
                  // })
                },
              })
            },
            'complete': function (res) {
              console.log(res.errMsg);
              wx.showToast({
                title: '取消支付',
                icon: 'loading',
                duration: 1000
              })
              // setTimeout(function () {
              //   wx.switchTab({
              //     url: '../list/list',
              //   })
              // }, 1000)
            }
          })
        },
      })
    }
  },
  //联系商家
  lxsj: function (e) {
    var that = this;
    console.log('联系商家' + e.currentTarget.dataset.dnddtel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.dnddtel,
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
      url: '../../info/info',
    })
  },
  //评价
  pingjia: function (e) {
    var that = this;
    console.log('评价' + e.currentTarget.dataset.dnddid)
    wx.navigateTo({
      url: '../../comment/comment?wmddid=' + e.currentTarget.dataset.dnddid,
    })
  },
  //餐后支付
  chzf:function(){
   wx.showModal({
     title: '提示',
     content: '请用餐结束后到前台付款',
     showCancel:false,
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
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
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