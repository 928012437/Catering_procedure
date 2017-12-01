// youhui.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    close: false,
    current_time: '',
   
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
      color: nbcolor,
      options:options
    })
    console.log(options)
    var that = this
    if (options.totalPrice==null){
      var totalPrice=0
    }
    else{
      var totalPrice = Number(options.totalPrice)
    }
    if(options.state==null){
      console.log('状态是空的')
      var states = 0
    }else{
      console.log('有状态')
      var state = options.state
    }
    console.log(state)
    that.setData({
      state : state,
      states:states,
      totalPrice: totalPrice
    })
    var user_id = wx.getStorageSync('users').id
    var time = getNowFormatDate()
    var current_time = time.slice(0, 10)//当前时间
    console.log(current_time)
    that.setData({
      current_time: current_time
    })
    // 优惠券接口
    app.util.request({
      'url': 'entry/wxapp/Coupons',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        var coupons = res.data.ok
        var coupon = []
        for(var i = 0;i<coupons.length;i++){
          coupons[i].conditions = Number(coupons[i].conditions)
          if (current_time <= coupons[i].end_time){
            if (coupons[i].state==2){
              coupon.push(coupons[i])
            }
          }
        }
        if (options.dnjr == null && options.state == null) {
          console.log('从个人中心进入')
          that.setData({
            coupon: coupon
          })
        }
        else {
          console.log('从门店进入')
          var wlqyhq = [];
          for (let i = 0; i < coupon.length; i++) {
            if (coupon[i].store_id == getApp().sjid) {
              wlqyhq.push(coupon[i]);
            }
          }
          that.setData({
            coupon: wlqyhq
          });
        }
      }
    })
    app.util.request({
      'url': 'entry/wxapp/Voucher',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        var Voucher = res.data.ok
        var Vouchers=[]
        for (var i = 0; i < Voucher.length; i++) {
          Voucher[i].conditions = Number(Voucher[i].conditions)
          if (current_time <= Voucher[i].end_time) {
            if (Voucher[i].state == 2) {
              console.log()
              Vouchers.push(Voucher[i])
            }
          }
        }
        if (options.dnjr == null && options.state==null) {
          console.log('从个人中心进入')
          that.setData({
            Vouchers: Vouchers
          })
        }
        else {
          console.log('从门店进入')
          var wlqdjq = [];
          for (let i = 0; i < Vouchers.length; i++) {
            if (Vouchers[i].store_id == getApp().sjid) {
              wlqdjq.push(Vouchers[i]);
            }
          }
          that.setData({
            Vouchers: wlqdjq
          });
        }
      }
    })
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
      return currentdate;
    }
   
  },
  // 不使用优惠券
  select:function(e){
    wx.navigateBack({
      delta:1,
    })
  },
  // 点击使用优惠券
  use:function(e){
    var that = this
    var id = e.currentTarget.id
    console.log(e)
    console.log(that.data)
    var coupons = that.data.coupon
    for(var i = 0;i<coupons.length;i++){
      if(id==coupons[i].id){
        console.log(coupons[i])
        var coupon = coupons[i]
        if (that.data.state == '2') {
          wx: wx.reLaunch({
            url: '../order/order?coupons_id=' + coupon.coupons_id + '&preferential=' + coupon.preferential,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx: wx.reLaunch({
            url: '../pay/pay?coupons_id=' + coupon.coupons_id + '&preferential=' + coupon.preferential,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    }
    console.log(e)
    console.log(that.data)
  },
  user: function (e) {
    var that = this
    console.log(that.data)
    var id = e.currentTarget.id
    var Voucher = that.data.Vouchers
    for (var i = 0; i < Voucher.length; i++) {
      if (id == Voucher[i].id) {
        console.log(Voucher[i])
        var coupon = Voucher[i]
        if (that.data.state == '2') {
          wx: wx.reLaunch({
            url: '../order/order?vouchers_id=' + coupon.vouchers_id + '&preferential=' + coupon.preferential,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx: wx.reLaunch({
            url: '../pay/pay?vouchers_id=' + coupon.vouchers_id + '&preferential=' + coupon.preferential,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    }
    console.log(e)
    console.log(that.data)
  },
  tzsj:function(e){
    var sjid = e.currentTarget.dataset.sjid;
    console.log(sjid, this.data.options)
    if(this.data.options.dnjr==null){
      console.log('从个人中心进入')
      wx.switchTab({
        url: '../home/home',
      })
    }
    else{
      console.log('从门店进入')
      wx.navigateBack({
        delta:1,
      })
    }
    // wx.navigateTo({
    //   url: '../',
    // })
  },
  // 点击跳转优惠券详情页
  details: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    wx: wx.navigateTo({
      url: 'coupons_details?id=' + id + '&type=' + 1 + '&state=' + 2,
    })
  },
  // 点击跳转代金券详情页
  detail: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    wx: wx.navigateTo({
      url: 'coupons_details?id=' + id + '&type=' + 2 + '&state=' + 2,
    })
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