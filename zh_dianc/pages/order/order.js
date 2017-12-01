// pages/order/order.js
var app = getApp()
var util = require('../../utils/util.js')
var form_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_id: '',
    index:0,
    inde:0,
    array: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取扫码传的桌位id
    // var tableid=wx.getStorageSync('tableid')
    var tableid = options.tableid
    console.log(tableid)
    var that = this
    // 获取桌子信息
    app.util.request({
      'url': 'entry/wxapp/Zhuohao',
      'cachetime': '0',
      data: { id: tableid},
      success: function (res) {
        console.log(res)
        that.setData({
          tabletypename: res.data.type_name,
          tablename: res.data.table_name,
          table_id:tableid
        })
      },
    })
    // 获取桌子类型
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          array: res.data
        })
      },
    })
   
    if (options.preferential == null) {
      var pre = 0
    } else {
      var pre = Number(options.preferential)
    }
    console.log(pre)
    var time = util.formatTime(new Date());
    // 获取从上一个页面保存的数据
    var order = wx.getStorageSync('order')
    var url = wx.getStorageSync('imglink')
    console.log(url)
    var store = wx.getStorageSync('store')
    console.log(store)
    var totalPrice = 0
    for (var i = 0; i < order.length; i++) {
      totalPrice += order[i].money * order[i].num;
    }
    that.setData({
      order: order,
      store:store,
      url:url,
      color:store.color,
      types:options.types,
      totalPrice: totalPrice,
      time: time,
      pre: pre,
      coupons_id: options.coupons_id,
      vouchers_id: options.vouchers_id
    })
  },
  formSubmit: function (e) {
    var that = this
    form_id = e.detail.formId
    that.setData({
      form_id: form_id
    })
    console.log(e)
  },
  coupon:function(e){
    var that = this
    console.log(that.data)
    wx: wx.navigateTo({
      url: '../coupons/mine_coupons?totalPrice=' + that.data.totalPrice + '&state=' + 2,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    
  },
  pay: function (e) {
    var that = this
    console.log(that.data)
    var store_id = that.data.store.id
    console.log(store_id)
    var order = that.data.order
    // 获取用户的openid
    var openid = wx.getStorageSync('openid')
    // 获取表单form_id
    var form_id = that.data.form_id
    console.log(form_id)
    // user_id
    var user_id = wx.getStorageSync('users').id
    // 判断用户是否选择优惠券或者代金券
    if (that.data.coupons_id == null) {
      console.log('用户没有选择优惠券')
      var coupons_id = ''
    } else {
      console.log('用户选择了优惠券')
      // 选择的优惠券id
      var coupons_id = that.data.coupons_id
    }
    if (that.data.vouchers_id == null) {
      console.log('用户没有选择代金券')
      var voucher_id = ''
    } else {
      console.log('用户选择了代金券')
      // 选择的代金券id
      var voucher_id = that.data.vouchers_id
    }
    console.log('代金券id' + voucher_id)
    console.log('优惠券id' + coupons_id)
    //  
    if (pre == NaN) {
      var pre = 0
    } else {
      var pre = that.data.pre
    }
    // 订单金额
    var totalPrice = Number(that.data.totalPrice)
    // 总金额
    var money = totalPrice - pre
    console.log(money)
    // var moneys = money
    // 状态
    var type = 2
    console.log(type)
    // 桌号
    var table_id = that.data.table_id
    console.log('桌号'+table_id)
    // 桌子类型
    var tabletype_id = that.data.tabletype_id
    console.log('桌子类型' + tabletype_id)
    var list = []
    order.map(function (item) {
      var obj = {};
      obj.name = item.name;
      obj.img = item.icon;
      obj.num = item.num;
      obj.money = item.money;
      obj.dishes_id = item.id;
      list.push(obj);
    })
    // console.log(list)
    // 店内点餐提交订单
    // 提交订单接口
    if(money<=0){
      wx:wx.showToast({
        title: '金额不能为0',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      app.util.request({
        'url': 'entry/wxapp/AddOrder',
        'cachetime': '0',
        data: { type: type, money: money, user_id: user_id, table_id: table_id, seller_id: store_id, coupons_id: coupons_id, voucher_id: voucher_id, sz: list },
        success: function (res) {
          var order_id = res.data
          console.log('本次的订单id为' + order_id)
          if (order_id != "下单失败") {
            wx.showModal({
              title: '提示',
              content: '请选择立即支付或餐后支付',
              showCancel: true,
              cancelText: '餐后支付',
              confirmText: '立即支付',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户选择立即支付')
                  // 支付接口
                  app.util.request({
                    'url': 'entry/wxapp/pay',
                    'cachetime': '0',
                    data: { openid: openid, order_id: order_id, money: money },
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
                          wx.showToast({
                            title: '支付成功',
                            duration: 1000
                          })
                          // 打印机
                          app.util.request({
                            'url': 'entry/wxapp/DnPrint',
                            'cachetime': '0',
                            data: { order_id: order_id, pay_type: '微信支付' },
                            success: function (res) {
                              console.log(res)
                            },
                          })
                          app.util.request({
                            'url': 'entry/wxapp/DnPrint2',
                            'cachetime': '0',
                            data: { order_id: order_id, pay_type: '微信支付' },
                            success: function (res) {
                              console.log(res)
                            },
                          })
                          // 支付完成发送短信给商家
                          app.util.request({
                            'url': 'entry/wxapp/sms',
                            'cachetime': '0',
                            success: function (res) {
                              console.log(res)

                            },
                          })
                          // 下单改变订单状态
                          app.util.request({
                            'url': 'entry/wxapp/PayOrder',
                            'cachetime': '0',
                            data: { user_id: user_id, order_id: order_id, coupons_id: coupons_id, voucher_id: voucher_id },
                            success: function (res) {
                              console.log(res)
                              setTimeout(function () {
                                wx.switchTab({
                                  url: '../list/list'
                                })
                              }, 1000)
                            },
                          })
                        }, 'complete': function (res) {
                          wx.showToast({
                            title: '取消支付',
                          })
                        }
                      })
                    },
                  })
                } else if (res.cancel) {
                  console.log('用户点击餐后支付')
                  // 打印机
                  app.util.request({
                    'url': 'entry/wxapp/DnPrint',
                    'cachetime': '0',
                    data: { order_id: order_id ,pay_type:'餐后支付'},
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/DnPrint2',
                    'cachetime': '0',
                    data: { order_id: order_id,pay_type: '餐后支付' },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  // 支付完成发送短信给商家
                  app.util.request({
                    'url': 'entry/wxapp/sms',
                    'cachetime': '0',
                    success: function (res) {
                      console.log(res)

                    },
                  })
                  wx.switchTab({
                    url: '../list/list'
                  })
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        },
      })
      // if (tabletype_id==null){
      //   wx:wx.showToast({
      //     title: '没有选择桌子类型',
      //     icon: '',
      //     image: '',
      //     duration: 1000,
      //     mask: true,
      //     success: function(res) {},
      //     fail: function(res) {},
      //     complete: function(res) {},
      //   })
      // }else{
      //   if (table_id == null) {
      //     wx: wx.showToast({
      //       title: '没有选择桌号',
      //       icon: '',
      //       image: '',
      //       duration: 1000,
      //       mask: true,
      //       success: function (res) { },
      //       fail: function (res) { },
      //       complete: function (res) { },
      //     })
      //   }
      //   else {
      //     app.util.request({
      //       'url': 'entry/wxapp/AddOrder',
      //       'cachetime': '0',
      //       data: { type: type, money: money, user_id: user_id, table_id: table_id, seller_id: store_id, coupons_id: coupons_id, voucher_id: voucher_id, sz: list },
      //       success: function (res) {
      //         var order_id = res.data
      //         console.log('本次的订单id为' + order_id)
      //         if (order_id != "下单失败") {
      //           // 支付接口
      //           app.util.request({
      //             'url': 'entry/wxapp/pay',
      //             'cachetime': '0',
      //             data: { openid: openid, order_id: order_id, money: money },
      //             success: function (res) {
      //               console.log(res)
      //               wx.requestPayment({
      //                 'timeStamp': res.data.timeStamp,
      //                 'nonceStr': res.data.nonceStr,
      //                 'package': res.data.package,
      //                 'signType': res.data.signType,
      //                 'paySign': res.data.paySign,
      //                 'success': function (res) {
      //                   console.log(res.data)
      //                   console.log(res)
      //                   wx.showToast({
      //                     title: '支付成功',
      //                     duration: 1000
      //                   })
      //                   // 打印机
      //                   app.util.request({
      //                     'url': 'entry/wxapp/DnPrint',
      //                     'cachetime': '0',
      //                     data: { order_id: order_id },
      //                     success: function (res) {
      //                       console.log(res)
      //                     },
      //                   })
      //                   app.util.request({
      //                     'url': 'entry/wxapp/DnPrint2',
      //                     'cachetime': '0',
      //                     data: { order_id: order_id },
      //                     success: function (res) {
      //                       console.log(res)
      //                     },
      //                   })
      //                   // 下单改变订单状态
      //                   app.util.request({
      //                     'url': 'entry/wxapp/PayOrder',
      //                     'cachetime': '0',
      //                     data: { user_id: user_id, order_id: order_id, coupons_id: coupons_id, voucher_id: voucher_id },
      //                     success: function (res) {
      //                       console.log(res)
      //                       setTimeout(function () {
      //                         wx.switchTab({
      //                           url: '../list/list'
      //                         })
      //                       }, 1000)
      //                     },
      //                   })
      //                 }, 'fail': function (res) {
      //                   wx.switchTab({
      //                     url: '../list/list'
      //                   })
      //                 }
      //               })
      //             },
      //           })
      //         }
      //       },
      //     })
      //   }
      // }
     
     
    }
    
  },
  bindPickerChange: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value
    that.setData({
      index: index,
      inde:0
    })
    console.log(that.data)
    // 获取桌子类型
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      success: function (res) {
        var tabletype_id = res.data[index].id
        app.util.request({
          'url': 'entry/wxapp/Table',
          'cachetime': '0',
          data: { type_id: tabletype_id },
          success: function (res) {
            console.log(res)
            that.setData({
              not_use: res.data,
              tabletype_id: tabletype_id,
              table_id: res.data[that.data.inde].id
            })
          },
        })
      },
    })
    
  },
  bindPickerChange_one:function(e){
    var that = this
    console.log(that.data)
    if (that.data.index != 0) {
      var inde = 0
    }
    var tabletype_id = that.data.tabletype_id
    app.util.request({
      'url': 'entry/wxapp/Table',
      'cachetime': '0',
      data: { type_id: tabletype_id },
      success: function (res) {
        console.log(res)
        that.setData({
          not_use: res.data,
          table_id: res.data[that.data.inde].id
        })
      },
    })
   
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      inde: e.detail.value,
      value: e.detail.value
    })
    // that.setData({
    //   table_id: that.data.not_use[that.data.inde].id
    // })
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
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: getApp().sjid },
      success: function (res) {
        console.log(res)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
      },
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
  formSubmit: function () { }
})