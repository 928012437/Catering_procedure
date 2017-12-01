// pages/pay/pay.js
var app = getApp()
var distance;
var form_id;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0,//商品总金额
    // address: '',
    distance: '0',
    form_id: '',
    beizhu: ''
  },
  jsmj:function(num,arr){
    var index;
    for(let i=0;i<arr.length;i++){
      if (Number(num)>=Number(arr[i].full)){
         index=i;
         break;
      }
    }
    return index
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (options.preferential == null) {
      var pre = 0
    } else {
      var pre = Number(options.preferential)
    }
    var users = wx.getStorageSync('users')
    var new_user = wx.getStorageSync('new_user')
    that.setData({
      coupons_id: options.coupons_id,
      pre: pre,
      new_user: new_user,
      users: users,
      vouchers_id: options.vouchers_id
    })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
        that.setData({
          ptxx: res.data
        })
      },
    })
    // 商家信息
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: getApp().sjid },
      success: function (res) {
        console.log(res)
        console.log(res.data.coordinates.split(','))
        var loc = res.data.coordinates.split(',')
        //设置导航栏背景色
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
        that.setData({
          color: res.data.color,
          sd_time: res.data.sd_time
        })
        //满减
        app.util.request({
          'url': 'entry/wxapp/Reduction',
          'cachetime': '0',
          data: { id: getApp().sjid },
          success: function (res1) {
            console.log(res1)
            // 配送费
            var fre = Number(res.data.freight)
            // 满减的优惠条件数组
            if(res1.data.length==0){
              var con = [{'full':'1000000'}]
            }
            else{
              var con = res1.data
            }
            // 满减的条件的索引
            var conindex=con.length-1
            // 满减的优惠金额
            var cut
            // 获取从上一个页面保存的数据
            var order = wx.getStorageSync('order')
            console.log(order)
            // 计算订单的总金额
            var totalPrice = 0;
            // 餐盒费
            var totalbox = 0;
            for (var i = 0; i < order.length; i++) {
              totalPrice += order[i].money * order[i].num + order[i].box_fee * order[i].num;
              totalbox += order[i].box_fee * order[i].num;
            }
            console.log(totalPrice,con)
            // 配送费
            var freight = Number(res.data.freight)
            console.log('配送费为' + freight)
            if (freight > 0) {
              var freight = Number(res.data.freight)
            } else {
              var freight = 0
            }
            // 用户的身份

            // 判断商家是否开启新用户立减优惠
            var xyh_open = Number(res.data.xyh_open)
            // 下单立减优惠金额
            var xyh_money = Number(res.data.xyh_money)
            if (xyh_open == 1) {
              // 商家开启了新用户下单立减  需要根据用户身份去计算用户的支付金额
              if (new_user == 1) {
                console.log('这是一个新用户')
                var money = totalPrice - xyh_money + freight
                if (money <= 0) {
                  money = 0.01
                }
                console.log('商家开启了下单立减优惠，而且用户是一个新用户，不享受满减活动以及优惠券，支付的金额为' + money)
              } else {
                // 订单总金额大于满减金额
                if (Number(totalPrice) >= Number(con[con.length - 1].full)) {
                  console.log(that.jsmj(totalPrice, con))
                  conindex = that.jsmj(totalPrice, con)
                  cut = Number(con[conindex].reduction)
                  console.log(cut)
                  // 用户没有选择优惠券
                  if (pre == 0) {
                    var money = totalPrice + freight - cut
                    console.log('商家开启了下单立减优惠，而且用户是一老用户，没有使用优惠券，支付的金额为' + money)
                  } 
                  else {
                    if (totalPrice + freight - cut - pre <= 0) {
                      var money = 0.01
                      console.log('商家开启了下单立减优惠，而且用户是一老用户，使用了优惠券并且优惠超出总价，支付的金额为' + money)
                    } 
                    else {
                      var money = totalPrice + freight - cut - pre
                      console.log('商家开启了下单立减优惠，而且用户是一老用户，使用了优惠券并且总价大于优惠，支付的金额为' + money)
                    }
                  }
                }
                 else {
                  if (pre == 0) {
                    var money = totalPrice + freight
                  } 
                  else {
                    // 判断总支付金额是否小于等于0
                    if (totalPrice + freight - pre <= 0) {
                      var money = 0.01
                    } 
                    else {
                      var money = totalPrice + freight - pre
                    }
                  }
                  console.log('用户是一个老用户，不享受新用户下单立减活动，订单的金额小于满减的金额' + money,con)
                }
              }
            } else {
              // 商家没有开启新用户下单立减   不显示用户身份  也不计算价格
              if (Number(totalPrice) >= Number(con[con.length - 1].full)) {
                console.log(that.jsmj(totalPrice, con))
                conindex = that.jsmj(totalPrice, con)
                cut = Number(con[conindex].reduction)
                console.log(cut)
                if (pre == 0) {
                  var money = totalPrice + freight - cut
                }
                 else {
                  // 判断总支付金额是否小于等于0
                  if (totalPrice + freight - cut - pre <= 0) {
                    var money = 0.01
                  } 
                  else {
                    var money = totalPrice + freight - cut - pre
                  }
                }
                console.log('商家没有开启新用户立减，而且用户是一个老用户，订单的金额大于满减的金额，用户支付的金额为' + money)
              } else 
              {
                if (pre == 0) {
                  var money = totalPrice + freight
                } 
                else {
                  // 判断总支付金额是否小于等于0
                  if (totalPrice + freight - pre <= 0) {
                    var money = 0.01
                  }
                   else {
                    var money = totalPrice + freight - pre
                  }
                }
                console.log('商家没有开启开启新用户立减，而且用户是一个老用户，订单的金额小于满减的金额，用户支付的金额为' + money,con)
              }
            }
            that.setData({
              xyh_open: xyh_open,
              xyh_money: xyh_money,
              store: res.data,
              money: money.toFixed(2),
              totalPrice: totalPrice,
              totalbox: totalbox,
              freight: freight,
              fre: fre,
              order: order,
              con: con,
              yh: Number(con[conindex].full),
              cut: cut,
              seller_id: res.data.id
            })
            console.log(that.data)
          }
        })
        distance = Number(res.data.distance) * 1000
        // app.util.request({
        //   'url': 'entry/wxapp/zhuanh',
        //   'cachetime': '0',
        //   data: { op: res.data.coordinates },
        //   success: function (res) {
        //     console.log(res)
        //     console.log(res.data.locations[0].lat + ',' + res.data.locations[0].lng)
        //     that.setData({
        //       start: res.data.locations[0].lat + ',' + res.data.locations[0].lng
        //     })
        //     app.util.request({
        //       'url': 'entry/wxapp/map',
        //       'cachetime': '0',
        //       data: { op: res.data.locations[0].lat + ',' + res.data.locations[0].lng },
        //       success: function (res) {
        //         console.log(res)
        //       }
        //     })
        //   },
        //   fail:function(res){
        //     console.log(res)
        //   }
        // })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: loc[0],
            longitude: loc[1]
          },
          coord_type: 3,
          success: function (res) {
            console.log(res);
            console.log('坐标转地址后的经纬度起点：', res.result.ad_info.location)
            that.setData({
              start: res.result.ad_info.location
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
    })
    // 获取用户poenid
    var openid = wx.getStorageSync('openid')
    console.log(openid)
    // 获取用户user_id
    var user_id = wx.getStorageSync('users').id
    that.setData({
      openid: openid,
      user_id: user_id
    })
  },
  reload: function (e) {

  },
  //自定义算距离方法
  distance: function (f, t, cbk) {
    // 调用距离接口
    var distance;
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: {
        latitude: f.lat,
        longitude: f.lng
      },
      to: [{
        latitude: t.lat,
        longitude: t.lng
      }],
      success: function (res) {
        console.log(res);
        if (res.status == 0) {
          distance = Math.round(res.result.elements[0].distance)
          cbk(distance)
        }
      },
      fail: function (res) {
        console.log(res);
        if (res.status == 373) {
          distance = 15000;
          cbk(distance)
        }
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  // juli: function (f, t, callback) {
  //   var distance;
  //   app.util.request({
  //     'url': 'entry/wxapp/JuLi',
  //     'cachetime': '0',
  //     dataType: 'json',
  //     data: { start: f, end: t },
  //     success: function (res) {
  //       console.log(res);
  //       if (res.data.status == '373') {
  //         distance = 10000;
  //       }
  //       else {
  //         distance = Math.round(res.data.result.elements[0].distance)
  //       }
  //       callback(distance)
  //     }
  //   })
  // },
  //订单备注
  ddbz: function (e) {
    console.log(e.detail.value)
    this.setData({
      beizhu: e.detail.value
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
    // that.onload()
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
  //—————————————————— 开关的点击事件————————————
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
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
        var user_tel = res.telNumber
        var user_address = res.cityName + res.countyName + res.detailInfo
        var user_name = res.userName
        console.log(user_address)
        that.setData({
          user_tel: user_tel,
          user_address: user_address,
          user_name: user_name,
        })
        app.util.request({
          'url': 'entry/wxapp/UpdAdd',
          'cachetime': '0',
          data: { user_id: user_id, user_tel: user_tel, user_address: user_address, user_name: user_name },
          success: function (res) {
            console.log(res)
          }
        })
      }

    })
  },
  formSubmit: function (e) {
    var that = this
    var totalPrice = that.data.totalPrice
    var money = that.data.money
    var yhje = (Number(totalPrice) - Number(money)).toFixed(2)
    console.log(yhje)
    console.log(that.data)
    var beizhu = that.data.beizhu
    // 菜品信息
    var order = that.data.order
    console.log(order)
    // 重新构建数组
    var list = []
    order.map(function (item) {
      if (item.num > 0) {
        var obj = {};
        obj.name = item.name;
        obj.img = item.icon;
        obj.num = item.num;
        obj.money = item.money;
        obj.dishes_id = item.id;
        list.push(obj);
      }
    })
    console.log(list)
    // 满减的优惠条件
    var con = that.data.con
    // 满减的优惠金额
    var cut = that.data.cut
    // 配送费
    var fre = that.data.fre
    console.log("商家的配送费为" + fre)
    // 判断用户是否选择了优惠券以及代金券
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
    // 查看商家是否开启了新用户下单立减
    var xyh_open = that.data.xyh_open
    // 商家设置的下单立减的优惠额度
    var xyh_money = that.data.xyh_money
    // 判断用户是否是新用户
    var new_user = that.data.new_user
    // 获取表单form_id
    var form_id = e.detail.formId
    // user_id
    var user_id = that.data.user_id
    // openid
    var openid = that.data.openid
    // 配送费
    var freight = that.data.freight
    // 状态
    var type = 1
    // 名字
    if (that.data.user_name != null) {
      var name = that.data.user_name
    } else {
      var name = that.data.users.user_name
    }
    // 地址
    if (that.data.user_address != null) {
      var address = that.data.user_address
    } else {
      var address = that.data.users.user_address
    }
    // 电话
    if (that.data.user_tel != null) {
      var tel = that.data.user_tel
    } else {
      var tel = that.data.users.user_tel
    }
    console.log('用户的名字为' + name)
    console.log('用户的地址为' + address)
    console.log('用户的电话号码为' + tel)

    // 餐盒费
    var box_fee = that.data.totalbox;

    // 商家id
    var seller_id = that.data.seller_id
    console.log(seller_id)
    // 判断支付条件
    if (openid == '') {
      wx: wx.showToast({
        title: 'id为空',
        icon: '',
        image: '',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      if (address == '') {
        // 判断用户是否选择了收货地址
        wx: wx.showToast({
          title: '请先选择地址',
          icon: '',
          image: '',
          duration: 1000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        var shdz = address.replace(" ", "")
        console.log(shdz)
        //区域
        var index = shdz.indexOf('市')
        console.log(shdz.substring(0, index))
        var area = shdz.substring(0, index)
        // 地图
        // // 调用接口
        // qqmapsdk.geocoder({
        //   address: shdz,
        //   success: function (res) {
        //     console.log(res);
        //     console.log('终点:',res.result.location)
        //   },
        //   fail: function (res) {
        //     console.log(res);
        //   },
        //   complete: function (res) {
        //     console.log(res);
        //   }
        // });
        app.util.request({
          'url': 'entry/wxapp/map2',
          'cachetime': '0',
          data: { op: shdz },
          success: function (res) {
            console.log(res)
            console.log('终点:', res.data.result.location)
            console.log(res.data.result.location.lat + ',' + res.data.result.location.lng)
            var shdzlat = res.data.result.location.lat;
            var shdzlng = res.data.result.location.lng;
            var end = res.data.result.location;
            console.log(shdzlat, shdzlng)
            that.distance(that.data.start, end, function (juli) {
              console.log(juli, distance)
              if (distance < juli) {
                wx.showModal({
                  title: '提示',
                  content: '超出商家配送距离',
                  showCancel: false
                })
              }
              else {
                // 提交订单接口
                if (form_id == '') {
                  wx: wx.showToast({
                    title: '网络不好',
                    icon: '',
                    image: '',
                    duration: 500,
                    mask: true,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                } else {
                  // 提交订单
                  app.util.request({
                    'url': 'entry/wxapp/AddOrder',
                    'cachetime': '0',
                    data: {
                      type: type, seller_id: seller_id, money: money, user_id: user_id, preferential: yhje, freight: freight, name: name, address: address, tel: tel, box_fee: box_fee, sz: list, coupons_id: coupons_id, voucher_id: voucher_id, note: beizhu,
                      area: area, lat: shdzlat, lng: shdzlng
                    },
                    success: function (res) {
                      // 获取本次下单的id
                      console.log(res)
                      var order_id = res.data
                      console.log('本次的订单id为' + order_id)
                      if (order_id != "下单失败") {
                        // 支付接口
                        app.util.request({
                          'url': 'entry/wxapp/pay',
                          'cachetime': '0',
                          data: { openid: openid, order_id: order_id, money: money },
                          success: function (res) {
                            console.log(res)
                            // 支付
                            wx.requestPayment({
                              'timeStamp': res.data.timeStamp,
                              'nonceStr': res.data.nonceStr,
                              'package': res.data.package,
                              'signType': res.data.signType,
                              'paySign': res.data.paySign,
                              'success': function (res) {
                                console.log(res)
                                wx.showToast({
                                  title: '支付成功',
                                  duration: 1000
                                })
                                // 打印机
                                app.util.request({
                                  'url': 'entry/wxapp/Print',
                                  'cachetime': '0',
                                  data: { order_id: order_id },
                                  success: function (res) {
                                    console.log(res)
                                  },
                                })
                                app.util.request({
                                  'url': 'entry/wxapp/Print2',
                                  'cachetime': '0',
                                  data: { order_id: order_id },
                                  success: function (res) {
                                    console.log(res)

                                  },
                                })
                                console.log(that.data.store)
                                if (that.data.store.ps_mode == '1') {
                                  //达达
                                  app.util.request({
                                    'url': 'entry/wxapp/dada',
                                    'cachetime': '0',
                                    data: { area: area, order_id: order_id, lat: shdzlat, lng: shdzlng },
                                    success: function (res) {
                                      console.log(res)
                                    },
                                  })
                                }
                                if (that.data.ptxx.is_email == '1') {
                                  app.util.request({
                                    'url': 'entry/wxapp/email',
                                    'cachetime': '0',
                                    data: { store_id: seller_id, type: '外卖' },
                                    success: function (res) {
                                      console.log(res)
                                    },
                                  })
                                }
                                // 下单改变订单状态
                                app.util.request({
                                  'url': 'entry/wxapp/PayOrder',
                                  'cachetime': '0',
                                  data: { user_id: user_id, order_id: order_id, coupons_id: coupons_id, voucher_id: voucher_id },
                                  success: function (res) {
                                    console.log(res)
                                    // 支付成功一秒后返回到首页
                                    setTimeout(function () {
                                      wx.switchTab({
                                        url: '../list/list'
                                      })
                                    }, 1000)
                                    console.log(form_id)

                                    // 下单发送模板消息
                                    app.util.request({
                                      'url': 'entry/wxapp/message',
                                      'cachetime': '0',
                                      data: { openid: openid, form_id: form_id, id: order_id },
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
                                  }
                                })
                              },
                              'complete': function (res) {
                                wx.switchTab({
                                  url: '../list/list'
                                })
                              }
                            })
                          },
                        })
                      }
                    },
                  })
                }
              }
            })
          }
        })
      }

    }
    console.log(e)
  },
  // 去选择优惠券
  coupon: function (e) {
    var that = this
    console.log(that.data)
    wx: wx.navigateTo({
      url: '../coupons/mine_coupons?totalPrice=' + that.data.totalPrice + '&state=' + 1,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 支付
  pay: function (e) {




  }
})