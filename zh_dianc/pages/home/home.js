// pages/home/home.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapFile = require('../../utils/amap-wx.js');
var util = require('../../utils/util.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    huise: false,
    huangse: true,
    hdnum: 0,
    kpgg: true,
    slider: [],
    currentTab: 0,
    swiperCurrent: 0,
    listarr: ['推荐排序', '销量', '评分', '距离'],
    activeIndex: 0,
    qqsj: false,
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    //当前时间
    var time = util.formatTime(new Date());
    var current_time = time.slice(11, 16)
    console.log(current_time)
    this.setData({
      current_time: current_time
    })
    //
    var that = this;
    //tq
    var myAmapFun = new amapFile.AMapWX({ key: 'd03d1ecd781de95397abc7c9f60273e2' });
    myAmapFun.getWeather({
      success: function (data) {
        //成功回调
        console.log(data)
        that.setData({
          tianqi: data
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
    // 系统设置
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
          mdxx: res.data
        })
        if (res.data.more == '1') {
          that.duoreLoad();
          wx.setNavigationBarTitle({
            title: res.data.pt_name
          })
        }
        if (res.data.more == '2') {
          that.danreLoad();
        }
        wx.setStorageSync('bqxx', res.data)
      },
    })
    // 网址信息
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // console.log(res.data)
        wx.setStorageSync('imglink', res.data)
        that.setData({
          url: res.data
        })
      },
    })
    //home轮播图和开屏公告
    app.util.request({
      'url': 'entry/wxapp/ad2',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var lb = [], kpggimg = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '1') {
            lb.push(res.data[i])
          }
          if (res.data[i].type == '2') {
            kpggimg.push(res.data[i])
          }
        }
        console.log(lb, kpggimg)
        that.setData({
          slider: lb,
        })
        if (kpggimg.length != 0) {
          that.setData({
            kpgg: false,
            kpggimg: kpggimg
          })
        }
      },
    })
    //home分类
    app.util.request({
      'url': 'entry/wxapp/storetype',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var navs = [];
        for (var i = 0, len = res.data.length; i < len; i += 8) {
          navs.push(res.data.slice(i, i + 8));
        }
        console.log(navs)
        that.setData({
          navs: navs,
        })
      },
    })
    //获取头像
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        var userInfo = res.userInfo;
        that.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        })
      }, fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,无法正常显示个人信息,点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                    wx.getUserInfo({
                      success: function (res) {
                        console.log(res.userInfo)
                        var userInfo = res.userInfo;
                        that.setData({
                          nickName: userInfo.nickName,
                          avatarUrl: userInfo.avatarUrl,
                        })
                      }
                    })
                  } else {
                    that.setData({
                      nickName: '',
                      avatarUrl: '',
                    })
                  }
                },
                fail: function (res) {
                }
              })
            }
          }
        })
      }, complete: function (res) {
      }
    })
    //登录
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", res.code)
        app.util.request({
          'url': 'entry/wxapp/openid',
          'cachetime': '0',
          data: { code: code },
          success: function (res) {
            console.log(res)
            wx.setStorageSync("key", res.data.session_key)
            // var img = that.data.userInfo.avatarUrl
            // var name = that.data.userInfo.nickName
            // 异步保存用户openid
            wx.setStorageSync("openid", res.data.openid)
            var openid = res.data.openid
            console.log(openid)
            // 获取用户登录信息
            if (openid == '') {
              wx: wx.showToast({
                title: '没有获取到openid',
                icon: '',
                image: '',
                duration: 1000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              app.util.request({
                'url': 'entry/wxapp/Login',
                'cachetime': '0',
                data: { openid: openid, img: that.data.avatarUrl, name: that.data.nickName },
                success: function (res) {
                  console.log(res)
                  // 异步保存用户登录信息
                  wx.setStorageSync('users', res.data)
                  // 获取用户状态
                  app.util.request({
                    'url': 'entry/wxapp/New',
                    'cachetime': '0',
                    data: { user_id: res.data.id, store_id: that.data.mdxx.default_store },
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync('new_user', res.data)
                    },
                  })
                },
              })
            }

          },
        })
      }
    })
  },
  //关闭开屏公告
  closekpgg: function () {
    this.setData({
      kpgg: true
    })
  },
  //多店的自定义方法
  duoreLoad: function () {
    var that = this;
    //定位用户地址
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        console.log(op)
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          coord_type: 1,
          success: function (res) {
            var start = res.result.ad_info.location
            console.log(res);
            console.log(res.result.formatted_addresses.recommend);
            console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
            that.setData({
              weizhi: res.result.formatted_addresses.recommend,
            })
            //推荐商家列表
            app.util.request({
              'url': 'entry/wxapp/StoreList',
              'cachetime': '0',
              success: function (res) {
                console.log(res.data)
                var storelist = res.data
                for (let i = 0; i < storelist.length; i++) {
                  var sjjwd = (storelist[i].coordinates).split(',')
                  console.log(sjjwd)
                  that.changejwd(sjjwd[0], sjjwd[1], function (data) {
                    console.log(data, start)
                    var end = data;
                    that.distance(start, end, function (distance) {
                      console.log(distance)
                      if (distance < 1000) {
                        storelist[i].aa = distance + 'm'
                        storelist[i].aa1 = distance
                      }
                      else if (distance < 15000) {
                        storelist[i].aa = (distance / 1000).toFixed(1) + 'km'
                        storelist[i].aa1 = distance
                      }
                      else {
                        storelist[i].aa = '>15km'
                        storelist[i].aa1 = distance
                      }
                      that.setData({
                        tjstorelist: storelist,
                        jlpx: storelist,
                        xlpx: storelist,
                        pfpx: storelist,
                        qqsj: true,
                      })
                    })
                  })
                }
                // setTimeout(function(){
                //   that.setData({
                //     tjstorelist: storelist,
                //     jlpx:storelist,
                //     xlpx: storelist,
                //     pfpx: storelist,
                //     qqsj:true,
                //   })

                // },1000)
                console.log(storelist)
              },
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
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,无法正常使用功能，点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'wgs84',
                      success: function (res) {
                        let latitude = res.latitude
                        let longitude = res.longitude
                        let op = latitude + ',' + longitude;
                        console.log(op)
                        // 调用接口
                        qqmapsdk.reverseGeocoder({
                          location: {
                            latitude: latitude,
                            longitude: longitude
                          },
                          coord_type: 1,
                          success: function (res) {
                            var start = res.result.ad_info.location
                            console.log(res);
                            console.log(res.result.formatted_addresses.recommend);
                            console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
                            that.setData({
                              weizhi: res.result.formatted_addresses.recommend,
                            })
                            //推荐商家列表
                            app.util.request({
                              'url': 'entry/wxapp/StoreList',
                              'cachetime': '0',
                              success: function (res) {
                                console.log(res.data)
                                var storelist = res.data
                                for (let i = 0; i < storelist.length; i++) {
                                  var sjjwd = (storelist[i].coordinates).split(',')
                                  console.log(sjjwd)
                                  that.changejwd(sjjwd[0], sjjwd[1], function (data) {
                                    console.log(data, start)
                                    var end = data;
                                    that.distance(start, end, function (distance) {
                                      console.log(distance)
                                      if (distance < 1000) {
                                        storelist[i].aa = distance + 'm'
                                        storelist[i].aa1 = distance
                                      }
                                      else if (distance < 15000) {
                                        storelist[i].aa = (distance / 1000).toFixed(1) + 'km'
                                        storelist[i].aa1 = distance
                                      }
                                      else {
                                        storelist[i].aa = '>15km'
                                        storelist[i].aa1 = distance
                                      }
                                      that.setData({
                                        tjstorelist: storelist,
                                        jlpx: storelist,
                                        xlpx: storelist,
                                        pfpx: storelist,
                                        qqsj: true,
                                      })
                                    })
                                  })
                                }
                                //  setTimeout(function () {
                                //    that.setData({
                                //      tjstorelist: storelist,
                                //      jlpx: storelist,
                                //      xlpx: storelist,
                                //      pfpx: storelist,
                                //      qqsj: true,
                                //    })

                                //  }, 1000)
                                console.log(storelist)
                              },
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
                  } else {
                    that.reLoad();
                  }
                },
                fail: function (res) {
                }
              })
            }
          }
        })
      },
      complete: function (res) {
      }
    })
  },
  //点击切换排序
  tabClick: function (e) {
    var that = this;
    var index = e.currentTarget.id
    console.log(index)
    this.setData({
      activeIndex: e.currentTarget.id,
      qqsj: false,
    });
    if (index == '0') {
      that.setData({
        // tjstorelist: that.data.tjpx,
        qqsj: true
      })
    }
    if (index == '1') {
      console.log(that.data.xlpx)
      that.setData({
        xlstorelist: that.data.xlpx.sort(that.comparejx("sales")),
        qqsj: true
      })
    }
    if (index == '2') {
      console.log(that.data.pfpx)
      that.setData({
        pfstorelist: that.data.pfpx.sort(that.comparejx("score")),
        qqsj: true
      })
    }
    if (index == '3') {
      that.setData({
        jlstorelist: that.data.jlpx.sort(that.comparesx("aa1")),
        qqsj: true
      })
    }
  },
  // 滑动切换
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  comparesx: function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  comparejx: function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    }
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
  //自定义转换方法
  changejwd: function (lat, lng, cbk) {
    //坐标转地址
    var jwd;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      coord_type: 3,
      success: function (res) {
        console.log(res);
        console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
        jwd = res.result.ad_info.location
        cbk(jwd)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  tzsj: function (e) {
    console.log(e.currentTarget.dataset.sjid)
    getApp().sjid = e.currentTarget.dataset.sjid
    wx.navigateTo({
      url: '../info/info'
    })
  },
  tzfl: function (e) {
    console.log(e.currentTarget.dataset.flinfo)
    wx.navigateTo({
      url: 'sjfl?flid=' + e.currentTarget.dataset.flinfo.id + '&flname=' + e.currentTarget.dataset.flinfo.type_name
    })
  },

  //单店的自定义方法
  danreLoad: function () {
    this.setData({
      hdnum: 0,
    })
    var that = this
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    var settime = time.slice(11, 16)
    console.log(settime)
    // 商家信息
    console.log(that.data)
    var current_time = that.data.current_time
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: that.data.mdxx.default_store },
      success: function (res) {
        console.log(res)
        //背景音乐
        if (res.data.store_mp3 != '' && res.data.is_mp3=='1') {
          wx.playBackgroundAudio({
            dataUrl: res.data.store_mp3,
          })
          wx.getBackgroundAudioPlayerState({
            success: function (res) {
              console.log(res)
              var status = res.status
              var dataUrl = res.dataUrl
              var currentPosition = res.currentPosition
              var duration = res.duration
              var downloadPercent = res.downloadPercent
            },
            fail: function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            }
          })
        }
        //背景色
        wx.setStorageSync('nbcolor', res.data.color)
        getApp().sjid = res.data.id
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
        that.setData({
          color: res.data.color
        })
        //满减
        app.util.request({
          'url': 'entry/wxapp/Reduction',
          'cachetime': '0',
          data: { id: getApp().sjid },
          success: function (res1) {
            console.log(res1)
            that.setData({
              mj: res1.data
            })
            if (res1.data.length != 0 && res.data.xyh_open == '1') {
              that.setData({
                hdnum: 2
              })
            }
            else if ((res1.data.length != 0 && res.data.xyh_open != '1') || (res1.data.length == 0 && res.data.xyh_open == '1')) {
              that.setData({
                hdnum: 1
              })
            }
            else {
              that.setData({
                hdnum: 0
              })
            }
          }
        })
        var shop_time = res.data.time
        var close_time = res.data.time2
        var rest = res.data.is_rest
        console.log('当前的系统时间为' + current_time)
        console.log('商家的营业时间从' + shop_time + '至' + close_time)
        that.setData({
          rest: res.data.is_rest
        })
        if (rest == 1) {
          console.log('商家正在休息')

        } else {
          console.log('商家没有休息')
          if (current_time > shop_time && current_time < close_time) {
            console.log('商家正常营业')
            that.setData({
              time: 1
            })
          }
          if (current_time < shop_time) {
            console.log('商家还没开店呐，稍等一会儿可以吗？')
            that.setData({
              time: 2
            })
          }
          if (current_time > close_time) {
            console.log('商家以及关店啦，明天再来吧')
            that.setData({
              time: 3
            })
          }
        }

        var distance = Number(res.data.distance)
        that.setData({
          store: res.data,
          distance: distance
        })
        app.util.request({
          'url': 'entry/wxapp/zhuanh',
          'cachetime': '0',
          data: { op: res.data.coordinates },
          success: function (res) {
            console.log(res)
            console.log(res.data.locations[0].lat + ',' + res.data.locations[0].lng)
            that.setData({
              sjdzlat: res.data.locations[0].lat,
              sjdzlng: res.data.locations[0].lng
            })
          }
        })
      },
    })
  },
  facing: function (e) {
    wx.navigateTo({
      url: '../fukuan/fukuan'
    })
  },
  breakout: function (e) {
    // var path = "zh_dianc/pages/index/index?scene=5"
    // console.log(path.substring(15))
    // var tnurl = '../' + path.substring(15)
    // console.log(tnurl)
    // wx.navigateTo({
    //   url: tnurl
    // })
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '../' + path.substring(15)
        wx.navigateTo({
          url: tnurl,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        // wx.showToast({
        //   title: '二维码错误',
        //   image:'../images/x.png'
        // })
      }
    })
  },
  takeOut: function (e) {
    wx.navigateTo({
      url: '../index/index?type=' + 2
    })
  },

  // 点击拨打电话
  call_phone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.store.tel
    })
  },
  // ——————————————点击跳转地图页面——————————
  tomap: function (e) {
    var that = this
    wx.openLocation({
      latitude: that.data.sjdzlat,
      longitude: that.data.sjdzlng,
      name: that.data.store.name,
      address: that.data.store.address
    })
  },
  tzsjhj: function (e) {
    console.log(e.currentTarget.dataset.sjid)
    wx.navigateTo({
      url: '../info/sjhj',
    })
  },
  // 跳转小程序
  tzxcx: function (e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      success(res) {
        // 打开成功
        console.log(res)
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
    // function Rad(d) {
    //   return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    // }
    // //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    // function GetDistance(lat1, lng1, lat2, lng2) {
    //   var radLat1 = Rad(lat1);
    //   var radLat2 = Rad(lat2);
    //   var a = radLat1 - radLat2;
    //   var b = Rad(lng1) - Rad(lng2);
    //   var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    //     Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    //   s = s * 6378.137;// EARTH_RADIUS;
    //   s = Math.round(s * 10000) / 10000; //输出为公里
    //   //s=s.toFixed(4);
    //   return s;
    // }
    // console.log(GetDistance(30.507528, 114.333908, 30.590691, 114.310844))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      kpgg: true
    })
    wx.stopBackgroundAudio()
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
    if (that.data.mdxx.more == '1') {
      that.duoreLoad();
    }
    if (that.data.mdxx.more == '2') {
      that.danreLoad();
    }
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
  // xzwz:function(){
  //   var that=this;
  //   wx.chooseLocation({
  //     success: function(res) {
  //       console.log(res)
  //   // 调用接口
  //   qqmapsdk.reverseGeocoder({
  //     location: {
  //       latitude: res.latitude,
  //       longitude: res.longitude
  //     },
  //     success: function (res) {
  //       console.log(res);
  //       that.setData({
  //         weizhi: res.result.formatted_addresses.recommend,
  //       })
  //     },
  //     fail: function (res) {
  //       console.log(res);
  //     },
  //     complete: function (res) {
  //       console.log(res);
  //     }
  //   });
  //     },
  //   })
  // },
})