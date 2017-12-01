// zh_dianc/pages/scroll/scroll.js
var app = getApp();
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
    var that = this;
    console.log(options)
    var id = options.id
    that.setData({
      id: options.id,
      types: options.types
    })
    // 网址信息
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          url: res.data
        })
      },
    }),    
    app.util.request({
    'url': 'entry/wxapp/DishesInfo',
      'cachetime': '0',
      data:{id:id},
      success: function (res) {
        console.log(res.data)
        that.setData({
          dishesinfo: res.data
        })
      },
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