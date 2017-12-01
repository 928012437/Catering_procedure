// pages/reserveinfo/reserveinfo.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalHidden:true,
    infoactive:'1',
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
    var imglink = wx.getStorageSync('imglink')
    var that = this;
    var ydid = options.yyid;
    console.log(ydid)
    app.util.request({
      'url': 'entry/wxapp/ReservationInfo',
      'cachetime': '0',
      data: { id: ydid },
      success: function (res) {
        console.log(res)
        that.setData({
          yyinfo: res.data,
          imglink: imglink,
          infoactive:res.data.state
        })
      },
    })
  },
  // 拨打电话
  call_phone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.yyinfo.tel
    })
    // app.util.request({
    //   'url': 'entry/wxapp/seller',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       seller: res.data
    //     })
    //     wx.makePhoneCall({
    //       phoneNumber: res.data.tel
    //     })
    //   },
    // })

  },
  cancel:function(e){
    this.setData({ modalHidden: false })
  },
  modalChange: function () {
    this.setData({ modalHidden: true })
  },
  modalcancel: function () {
    this.setData({ modalHidden: true })
  },
  infoactive1:function(e){
    this.setData({
      infoactive1: false,
      infoactive2: true,
      infoactive3: true
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