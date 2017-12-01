// coupon.js
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
    //进入页面
    console.log(options)
    var that = this
    that.setData({
      color: nbcolor,
      options: options
    })
    // user_id
    var user_id = wx.getStorageSync('users').id
    console.log(user_id)
    // 优惠券接口
    app.util.request({
      'url': 'entry/wxapp/Coupons',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        let idDataSet = that.getIdDataSet(res.data.ok);
        that.classify(res.data.all, idDataSet);
      }
    })
    // 代金券接口数据
    app.util.request({
      'url': 'entry/wxapp/Voucher',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        let collection = that.cash(res.data.ok);
        that.again(res.data.all, collection);
      }
    })
  },
  //重新排数组的方法
  //领取优惠券  构建ok对象的coupon_id属性集
  getIdDataSet: function (jsonArr) {
    let dataset = new Array();
    let len = jsonArr.length;
    for (let i = 0; i < len; i++) {
      dataset.push(jsonArr[i].coupons_id);
    }
    return dataset;
    console.log(dataset)
  },
  classify: function (origin, comp) {
    let received = new Array();
    let unreceive = new Array();
    let len = origin.length;
    for (let i = 0; i < len; i++) {
      if (comp.indexOf(origin[i].id) === -1) {
        unreceive.push(origin[i]);
      } else {
        received.push(origin[i]);
      }
    }
    console.log(received)
    console.log(unreceive)
    console.log(this.data.options)
    if (this.data.options.dnjr == null) {
      console.log('从个人中心进入')
      this.setData({
        received: received,
        unreceive: unreceive
      });
    }
    else {
      console.log('从店铺优惠券进入')
      var wlqyhq = [], lqyhq = [];
      for (let i = 0; i < unreceive.length; i++) {
        if (unreceive[i].store_id == getApp().sjid) {
          wlqyhq.push(unreceive[i]);
        }
      }
      this.setData({
        unreceive: wlqyhq
      });
      for (let i = 0; i < received.length; i++) {
        if (received[i].store_id == getApp().sjid) {
          lqyhq.push(received[i]);
        }
      }
      this.setData({
        unreceive: wlqyhq,
        received: lqyhq
      });
    }
  },
  cash: function (aggregate) {
    // console.log(aggregate)
    let data = new Array();
    let len = aggregate.length;
    for (let i = 0; i < len; i++) {
      data.push(aggregate[i].vouchers_id);
    }
    return data;
    console.log(data)
  },
  again: function (already, not) {
    let draw = new Array();
    let undraw = new Array();
    let len = already.length;
    for (let i = 0; i < len; i++) {
      if (not.indexOf(already[i].id) === -1) {
        undraw.push(already[i]);
      } else {
        draw.push(already[i]);
      }
    }
    console.log(draw)
    console.log(undraw)
    if (this.data.options.dnjr == null) {
      console.log('从个人中心进入')
      this.setData({
        draw: draw,
        undraw: undraw
      });
    }
    else {
      console.log('从店铺优惠券进入')
      var wlqdjq = [], lqdjq = [];
      for (let i = 0; i < undraw.length; i++) {
        if (undraw[i].store_id == getApp().sjid) {
          wlqdjq.push(undraw[i]);
        }
      }
      this.setData({
        undraw: wlqdjq
      });
      for (let i = 0; i < draw.length; i++) {
        if (draw[i].store_id == getApp().sjid) {
          lqdjq.push(draw[i]);
        }
      }
      this.setData({
        undraw: wlqdjq,
        draw: lqdjq,
      });
    }
  },
  // 点击使用跳转首页
  use: function () {
    wx.navigateBack({
      // url: '../index/index',
    })
  },
  // 点击跳转优惠券详情页
  details: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    wx: wx.navigateTo({
      url: 'coupons_details?id=' + id + '&type=' + 1 + '&state=' + 1,
    })
  },
  // 点击跳转代金券详情页
  detail: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    wx: wx.navigateTo({
      url: 'coupons_details?id=' + id + '&type=' + 2 + '&state=' + 1,
    })
  },
  //领取代金券
  draws: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index;
    var user_id = wx.getStorageSync('users').id
    let vouchers_id = this.data.undraw[index].id
    console.log(vouchers_id)
    var that = this
    app.util.request({
      'url': 'entry/wxapp/AddVoucher',
      'cachetime': '0',
      data: { user_id: user_id, vouchers_id: vouchers_id },
      success: function (res) {
        console.log(res)
        if (res.data == 1) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1000
          })
          let undraw = that.data.undraw;
          let draw = that.data.draw;
          draw.push(undraw[index]);
          undraw.splice(index, 1);
          console.log(draw)
          console.log(undraw)
          setTimeout(function () {
            that.setData({
              draw: draw,
              undraw: undraw
            });
          }, 1000)
        }
      },
    })
  },
  //领取优惠券
  receive: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index;
    var user_id = wx.getStorageSync('users').id
    let coupons_id = this.data.unreceive[index].id
    console.log(coupons_id)
    var that = this
    app.util.request({
      'url': 'entry/wxapp/AddCoupons',
      'cachetime': '0',
      data: { user_id: user_id, coupons_id: coupons_id },
      success: function (res) {
        console.log(res)
        if (res.data == 1) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1000
          })
          let unreceive = that.data.unreceive;
          let received = that.data.received;
          received.push(unreceive[index]);
          unreceive.splice(index, 1);
          console.log(received)
          console.log(unreceive)
          setTimeout(function () {
            that.setData({
              received: received,
              unreceive: unreceive
            });
          }, 1000)
        }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
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