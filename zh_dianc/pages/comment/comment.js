// pages/comment/comment.js
var app = getApp();
var count = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../images/no-star.png',
    selectedSrc: '../images/full-star.png',
    key: 0,
    count: 0,
    url: ''
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
    count = 0;
    var that = this
    var user_id = wx.getStorageSync('users').id;//用户opinid
    console.log(options.wmddid)

    // 从订单获取的参数
    that.setData({
      wmddid: options.wmddid
    });
    var wmddid = options.wmddid
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
    //订单详情的接口
    console.log(wmddid)
    app.util.request({
      'url': 'entry/wxapp/OrderInfo',
      'cachetime': '0',
      data: { id: wmddid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          order: res.data,
          seller: res.data.store
        })
        //console.log(res)
      },
    })
    // //获取头像和名字

    // wx.login({
    //   success: function (res) {
    //     console.log(res.data)
    //     wx.getUserInfo({
    //       success: function (res) {
    //         console.log(res)
    //         var userInfo = res.userInfo
    //         var nickName = userInfo.nickName
    //         var avatarUrl = userInfo.avatarUrl
    //         var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //         var province = userInfo.province
    //         var city = userInfo.city
    //         var country = userInfo.country
    //         console.log(userInfo)
    //         that.setData({
    //           avatarUrl: userInfo.avatarUrl,
    //           nickName: userInfo.nickName
    //         })
    //       },
    //       fail: function () {
    //         console.log("111")
    //       }
    //     })

    //   }
    // })
  },
  //点击左边,半颗星
  selectLeft: function (e) {
    console.log('111111');
    var key = e.currentTarget.dataset.key
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key,
      count: count
    })

  },

  formSubmit: function (e) {
    // 评论的接口
    var that = this;
    console.log(that.data);
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var content = e.detail.value.content;//评论的内容
    var user_id = wx.getStorageSync('users').id;//用户opinid
    var seller_id = that.data.seller.id;
    var order_num = that.data.order.order.order_num;
    var order_id = that.data.order.order.id;
    var jifen = that.data.seller.integral
    console.log(order_num);
    console.log(count + '分' + '--内容是：' + content + "---用户user_id是：" + user_id + "order_id是：" + order_id + '积分' + jifen);//星星评论分数
    // console.log(nickName + '--头像是：' + avatarUrl),//星星评论分数
    var warn = "";
    var flag = true;
    if (count == 0) {
      warn = "请选择评分！";
    } else if (content == '') {
      warn = "请填写您的评论内容"
    } else {
      flag = false;
      app.util.request({
        'url': 'entry/wxapp/pl',
        header: {
          'Content-Type': 'application/xml',
        },
        method: 'GET',
        'cachetime': '0',
        data: {
          score: count,
          content: content,
          user_id: user_id,
          seller_id: seller_id,
          order_id: order_id,
          order_num: order_num,
          total_score: jifen
        },
        success: function (res) {
          console.log(res)
          that.setData({
            url: res.data
          })
        },
      })
      wx.navigateTo({
        url: '../comsuc/comsuc',
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
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