// pages/reserveinfo/reserveinfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nbcolor = wx.getStorageSync('nbcolor')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
    var imglink = wx.getStorageSync('imglink')
    var ydid = options.ydid;
    console.log(ydid)
    this.setData({
      ydid:ydid,
      imglink: imglink
    })
    this.reLoad();
  },
  reLoad:function(){
    var that = this;
    var ydid = this.data.ydid;
    console.log(ydid)
    //商家详情的接口
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: getApp().sjid },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.logo)
        that.setData({
          store: res.data,
          color: res.data.color
        })
        //console.log(res)
      },
    })
    app.util.request({
      'url': 'entry/wxapp/ReservationInfo',
      'cachetime': '0',
      data: { id: ydid },
      success: function (res) {
        console.log(res)
        that.setData({
          yyinfo: res.data,
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
  },
  cancel: function (e) {
    var that = this;
    console.log(that.data.yyinfo.id)
    wx.showModal({
      title: '提示',
      content: '确认取消么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/CancelReservation',
            'cachetime': '0',
            data: { id: that.data.yyinfo.id },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../list/list?activeindex=2',
                  })
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
    that.reLoad()
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