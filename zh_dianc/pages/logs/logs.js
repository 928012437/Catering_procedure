//logs.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon:0,
    Vouchers:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ptxx = wx.getStorageSync('bqxx')
    if(ptxx.more=='1'){
      var nbcolor = wx.getStorageSync('bqxx').color
    }
    if (ptxx.more == '2'){
      var nbcolor = wx.getStorageSync('nbcolor')
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
    var that = this
    var bqxx = wx.getStorageSync('bqxx')
    console.log(bqxx)
    this.setData({
      bqxx: bqxx,
      color:nbcolor
    })
    var user_id = wx.getStorageSync('users').id
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
    var time = getNowFormatDate()
    var current_time = time.slice(0, 10)//当前时间
    // 积分
    app.util.request({
      'url': 'entry/wxapp/Jfmx',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        var score = res.data
        console.log(res)
        var integral = 0
        for (var i = 0; i < score.length; i++) {
          if (score[i].type==1){
            integral += Number(score[i].score)
          }
        }
        console.log(integral)
        that.setData({
          integral: integral
        })
      }
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
        console.log(coupons.length)
        if (coupons.length>0){
          for (var i = 0; i < coupons.length; i++) {
            console.log(coupons[i])
            coupons[i].conditions = Number(coupons[i].conditions)
            if (current_time <= coupons[i].end_time) {
              console.log('有可以用的优惠券')
              if (coupons[i].state == 2) {
                coupon.push(coupons[i].length)
                console.log(coupons[i])
                that.setData({
                  coupon: coupon.length
                })
              }
            }else{
              console.log('没有可以用的优惠券')
              that.setData({
                coupon: 0
              })
            }
          }
        }else{
          that.setData({
            coupon: 0
          })
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
        var Vouchers = []
        if (Voucher.length>0){
          for (var i = 0; i < Voucher.length; i++) {
            Voucher[i].conditions = Number(Voucher[i].conditions)
            console.log(Voucher[i])
            if (current_time <= Voucher[i].end_time) {
              
              if (Voucher[i].state == 2) {
                console.log('有可以用的代金券')
                Vouchers.push(Voucher[i])
                that.setData({
                  Vouchers: Vouchers.length
                })

              } else {
                console.log('没有可以用的代金券')
                that.setData({
                  Vouchers: 0
                })
              }
            }
          }
        }else{
          that.setData({
            Vouchers: 0
          })
        }
       

      }
    })
    //获取头像和名字
    wx.login({
      success: function (res) {
        console.log(res.data)
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            console.log(userInfo)
            that.setData({
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName
            })
          },
          fail: function () {
            console.log("111")
          }
        })

      }
    }),
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
    var bqxx = wx.getStorageSync('bqxx')
    console.log(bqxx)
    this.setData({
      bqxx: bqxx,
      color: nbcolor
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

  },
  //————————————————————地图————————————
  map: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
        var tel = res.telNumber
        var address = res.countyName + res.detailInfo
        var user_name = res.userName
        app.util.request({
          'url': 'entry/wxapp/UpdAdd',
          'cachetime': '0',
          data: { user_id: user_id, user_tel: tel, user_address: address, user_name: user_name },
          success: function (res) {
            console.log(res)
          }
        })
      }

    })
  },
  seller: function (e) {
    wx.navigateTo({
      url: '../seller/seller'
    })
  },
  youhui: function (e) {
    wx.navigateTo({
      url: '../coupons/shop_coupons'
    })
  },
  youhui2: function (e) {
    wx.navigateTo({
      url: '../coupons/mine_coupons'
    })
  },
  wallet: function (e) {
    wx.navigateTo({
      url: 'wallet'
    })
  },
  integral:function(e){
    wx.navigateTo({
      url: 'integral'
    })
  },
  // 跳转小程序
  tzxcx: function (e) {
    var appid = this.data.bqxx.tz_appid
    console.log(appid)
    wx.navigateToMiniProgram({
      appId: appid,
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  }
})