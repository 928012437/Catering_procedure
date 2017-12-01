// pages/fukuan/fukuan.js
var app = getApp();
var form_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0.00,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  money: function (e) {
    var money;
    console.log(e.detail.value)
    if (e.detail.value!=''){
     money = e.detail.value
    }
    else{
     money=0
    }
    this.setData({
      money: parseFloat(money).toFixed(2)
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    form_id = e.detail.formId
    that.setData({
      form_id: form_id
    })
  },
  onPay:function(){
    var openid=wx.getStorageSync('openid')
    var money=this.data.money
    var sjname=this.data.store.name
    console.log(openid,money,sjname)
    if(money==0){
      wx.showModal({
        title: '提示',
        content: '付款金额不能等于0',
      })
      return false
    }
    if (form_id == '') {
      wx: wx.showToast({
        title: '网络不好',
        icon: 'loading',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/pay',
        'cachetime': '0',
        data: { openid: openid, money: money},
        success: function (res) {
          console.log(res)
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log(res.data)
              console.log(res)
              console.log(form_id)
              // 下单发送模板消息
              app.util.request({
                'url': 'entry/wxapp/Message2',
                'cachetime': '0',
                data: { openid: openid, form_id: form_id,name: sjname,money:money+'元'},
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '支付成功',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta:1
                    })
                  }, 1000)
                },
              })
            },
            'complete': function (res) {
              console.log(res.errMsg);
              wx.showToast({
                title: '支付失败',
                icon:'loading',
                duration: 1000
              })
            }
          })
        },
      }) 
    }
  },
  onLoad: function (options) {
    var nbcolor = wx.getStorageSync('nbcolor')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
    this.setData({
      money: parseFloat(0).toFixed(2)
    })
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data:{id:getApp().sjid},
      success: function (res) {
        console.log(res)
        that.setData({
          store: res.data,
          color:res.data.color
        })
      },
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