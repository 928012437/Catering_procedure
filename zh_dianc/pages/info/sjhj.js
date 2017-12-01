// zh_dianc/pages/info/sjhj.js
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
    var nbcolor = wx.getStorageSync('nbcolor')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
    this.reLoad()
  },
  reLoad:function(){
    var that = this;
    var imgurl = wx.getStorageSync('imglink')
    console.log(imgurl)
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data:{id:getApp().sjid},
      success: function (res) {
        var storeimg = res.data.environment
        var storeyyzz = res.data.yyzz
        for (var i = 0; i < storeimg.length; i++) {
          storeimg[i] = imgurl + storeimg[i]
        }
        for (var i = 0; i < storeyyzz.length; i++) {
          storeyyzz[i] = imgurl + storeyyzz[i]
        }
        console.log(res)
        that.setData({
          store: res.data,
          storeimg: storeimg,
          storeyyzz: storeyyzz
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, 
      urls: e.currentTarget.dataset.urls 
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
    this.reLoad()
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },1500)
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