//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js')
const APP_ID = '';//输入小程序appid
const APP_SECRET = '';//输入小程序app_secret
var OPEN_ID = ''//储存获取到openid
var SESSION_KEY = ''//储存获取到session_key
Page({
  /**
   * 页面的初始数据
   */
  data: {
    xzggindex: '0',
    showModal: false,
    boxfre: true,
    changeHidden1: true,
    changeHidden: true,
    toastHidden: true,
    selected1: true,
    selected2: false,
    selected3: false,
    showview: true,
    hidden1: false,
    hidden2: true,
    hidden3: true,
    // 商家部分开始
    catalogSelect: 0,
    store: [],
    http: [],
    showView: false,
    close: false,
    login: [],
    rest: '',
    start_at: '',
    conditions: '',
    preferential: '',
    dishes: [],
    link: '',
    toView: '0',
    store_name: '',//餐厅名字
    scrollTop: 100,
    totalPrice: 0,// 总价格
    totalCount: 0, // 总商品数
    carArray: [],
    freight: 0,//配送费
    payDesc: 0,
    userInfo: {},
    parentIndex: 0,
    url: '',
    //商家部分结束
    // 切换部分的数据
    hidden: false,
    curNav: 1,
    curIndex: 0,
    cart: [],
    cartTotal: 0,
    one: 1,
    ping: '',
    hdnum: 0,
    star1: [
      { url: '../images/full-star.png' },
      { url: '../images/no-star.png' },
      { url: '../images/no-star.png' },
      { url: '../images/no-star.png' },
      { url: '../images/no-star.png' }
    ],
    star2: [
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/no-star.png' },
      { url: '../images/no-star.png' },
      { url: '../images/no-star.png' }
    ],
    star3: [
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/no-star.png' },
      { url: '../images/no-star.png' }
    ],
    star4: [
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/no-star.png' }
    ],
    star5: [
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' },
      { url: '../images/full-star.png' }
    ]
  },
  ycgg: function () {
    this.setData({
      showModal: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    console.log(options)
    var that = this
    var types = Number(options.type)
    if (types == 1) {
      console.log('用户选择的是店内点餐')
    } else {
      console.log('用户选择的是外卖点餐')
    }
    that.setData({
      types: types
    })
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    if (scene != 'undefined') {
      this.setData({
        types: 1,
        tableid: scene
      })
      // 获取桌子信息
      app.util.request({
        'url': 'entry/wxapp/Zhuohao',
        'cachetime': '0',
        data: { id: scene },
        success: function (res) {
          console.log(res)
          if (res.data.status == '0') {
            wx.showModal({
              title: '提示',
              content: '桌位信息：' + res.data.type_name + '--' + res.data.table_name,
              showCancel: false,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
          else {
            wx.showModal({
              title: '提示',
              content: '此桌已开台暂不能点餐,请选择其他座位',
              showCancel: false,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
        },
      })
      // wx.setStorageSync('tableid', scene)
    }
    showview: (options.showview == "true" ? true : false)
    showView: (options.showView == "true" ? true : false)
    that.reload()
  },
  reload: function (e) {
    var that = this
    // 获取用户点击的状态是店内点餐还是外卖
    var time = util.formatTime(new Date());
    var current_time = time.slice(11, 16)
    var key = this.data.store_name
    wx.showShareMenu({
      withShareTicket: true
    })

    // 接口数据

    // 商家信息
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: getApp().sjid },
      success: function (res) {
        //设置导航栏背景色
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
        //商家地址
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
        console.log(res)
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
        var seller_id = res.data.id
        var shop_time = res.data.time
        var close_time = res.data.time2
        var rest = res.data.is_rest
        console.log('当前的系统时间为' + current_time)
        console.log('商家的营业时间从' + shop_time + '至' + close_time)

        if (rest == 1) {
          console.log('商家正在休息' + rest)
        } else {
          console.log('商家正在营业' + rest)
        }
        if (current_time > shop_time && current_time < close_time) {
          console.log('商家正在营业哇')
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
        console.log("商家的id为" + seller_id)

        //评分接口
        app.util.request({
          'url': 'entry/wxapp/Score',
          'cachetime': '0',
          data: { seller_id: seller_id },
          success: function (res) {
            console.log(res)
            var score = res.data
            score = score.toFixed(1)
            console.log(score)
            that.setData({
              score: score
            })
          },
        })

        // 评论的接口
        app.util.request({
          'url': 'entry/wxapp/StorePl',
          headers: {
            'Content-Type': 'application/json',
          },
          'cachetime': '0',
          data: { id: seller_id },
          success: function (res) {
            console.log(res.data)
            var length = res.data.length
            console.log(length)
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].score = res.data[i].score.slice(0, 2)
            }
            console.log(res.data)
            that.setData({
              ping: res.data
            })
          },
        })
        that.setData({
          store: res.data,
          rest: rest,
          color: res.data.color,
          seller_id: seller_id,
          start_at: res.data.start_at
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

    // 菜品信息
    var that = this
    var dishes_type = that.data.types
    console.log(dishes_type)
    app.util.request({
      'url': 'entry/wxapp/Dishes',
      'cachetime': '0',
      data: { id: getApp().sjid, dishes_type: dishes_type },
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < res.data[i].goods.length; j++) {
            res.data[i].goods[j].xs_num = Number(res.data[i].goods[j].xs_num)
            res.data[i].goods[j].sit_ys_num = Number(res.data[i].goods[j].sit_ys_num)
          }
        }
        console.log(res.data)
        that.setData({
          dishes: res.data
        })
      },
    })
  },
  // ————————————点击事件开始——————————

  // 点击切换商品
  selected1: function (e) {
    this.setData({
      selected2: false,
      selected3: false,
      selected1: true,
      hidden1: false,
      hidden2: true,
      hidden3: true
    })
  },
  // 点击切换到评价
  selected2: function (e) {
    this.setData({
      selected1: false,
      selected2: true,
      selected3: false,
      hidden1: true,
      hidden2: false,
      hidden3: true
    })
  },
  // 点击切换到评价
  selected3: function (e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected3: true,
      hidden1: true,
      hidden2: true,
      hidden3: false
    })
  },

  // ————————————点击事件结束——————————

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.types == 1) {
      wx.setNavigationBarTitle({
        title: '堂内点餐'
      })
    } else if (this.data.types == 2) {
      wx.setNavigationBarTitle({
        title: '外卖点餐'
      })
    }

    console.log(this.data.types)
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
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    // pageNum = 1;
    that.reload()
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
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString(),
      catalogSelect: e.currentTarget.dataset.itemIndex
    })
    console.log('order' + index.toString())

  },
  // 商家打烊
  close: function () {
    // wx.showToast({
    //   title: '商家已经打烊',
    //   icon: 'success',
    //   duration: 2000
    // })
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 
  addShopCart: function (e) {
    var that = this;
    console.log(this.data.dishes)
    console.log(this.data.carArray)
    console.log(e.currentTarget.dataset)
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    var gwcindex = e.currentTarget.dataset.gwcindex
    var ggindex = e.currentTarget.dataset.ggindex
    if (ggindex != null) {
      this.data.dishes[parentIndex].goods[index].one++;//菜品里的数字加
      this.data.dishes[parentIndex].goods[index].gg[ggindex].num++;
      var mark = 'a' + index + 'b' + parentIndex + 'c' + this.data.dishes[parentIndex].goods[index].gg[ggindex].id
      if (this.data.types == 2) {
        var money = this.data.dishes[parentIndex].goods[index].gg[ggindex].cost;
      } else {
        var money = this.data.dishes[parentIndex].goods[index].gg[ggindex].cost;
      }
      var box_fee = this.data.dishes[parentIndex].goods[index].box_fee;
      console.log("餐盒费是：" + box_fee)
      var num = this.data.dishes[parentIndex].goods[index].gg[ggindex].num;
      var name = this.data.dishes[parentIndex].goods[index].name + this.data.dishes[parentIndex].goods[index].gg[ggindex].name;
      var id = this.data.dishes[parentIndex].goods[index].id;
      // console.log(id)
      var icon = this.data.dishes[parentIndex].goods[index].img;
      var store = this.data.store
      var obj = { ggindex: ggindex, money: money, num: num, id: id, mark: mark, name: name, index: index, parentIndex: parentIndex, icon: icon, store: store, box_fee: box_fee };
      var carArray1 = this.data.carArray.filter(item => item.mark != mark)
      carArray1.splice(index, 0, obj)
      console.log(carArray1)
      this.setData({
        shop_cart: carArray1,
        carArray: carArray1,
        dishes: this.data.dishes
      })
      console.log(this.data.carArray)
      this.calTotalPrice();
      this.setData({
        payDesc: this.payDesc()
      })
    }
    else {
      console.log(ggindex)
      that.data.dishes[parentIndex].goods[index].one++;
      var mark = 'a' + index + 'b' + parentIndex
      if (that.data.types == 2) {
        var money = that.data.dishes[parentIndex].goods[index].wm_money;
      } else {
        var money = that.data.dishes[parentIndex].goods[index].money;
      }
      var box_fee = that.data.dishes[parentIndex].goods[index].box_fee;
      console.log("餐盒费是：" + box_fee)
      var num = that.data.dishes[parentIndex].goods[index].one;
      var name = that.data.dishes[parentIndex].goods[index].name;
      var id = that.data.dishes[parentIndex].goods[index].id;
      // console.log(id)
      var icon = that.data.dishes[parentIndex].goods[index].img;
      var store = that.data.store
      var obj = { money: money, num: num, id: id, mark: mark, name: name, index: index, parentIndex: parentIndex, icon: icon, store: store, box_fee: box_fee };
      var carArray1 = that.data.carArray.filter(item => item.mark != mark)
      carArray1.splice(index, 0, obj)
      console.log(carArray1)
      that.setData({
        shop_cart: carArray1,
        carArray: carArray1,
        dishes: that.data.dishes
      })
      console.log(that.data.dishes)
      that.calTotalPrice();
      that.setData({
        payDesc: that.payDesc()
      })
    }
  },
  // 
  decreaseShopCart: function (e) {
    var that = this;
    console.log(this.data.dishes)
    console.log(this.data.carArray)
    console.log(e.currentTarget.dataset)
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    var gwcindex = e.currentTarget.dataset.gwcindex
    var ggindex = e.currentTarget.dataset.ggindex
    if (ggindex != null) {
      this.data.dishes[parentIndex].goods[index].one--;//菜品里的数字减
      this.data.dishes[parentIndex].goods[index].gg[ggindex].num--;
      var mark = 'a' + index + 'b' + parentIndex + 'c' + this.data.dishes[parentIndex].goods[index].gg[ggindex].id
      if (this.data.types == 2) {
        var money = this.data.dishes[parentIndex].goods[index].gg[ggindex].cost;
      } else {
        var money = this.data.dishes[parentIndex].goods[index].gg[ggindex].cost;
      }
      var box_fee = this.data.dishes[parentIndex].goods[index].box_fee;
      console.log("餐盒费是：" + box_fee)
      var num = this.data.dishes[parentIndex].goods[index].gg[ggindex].num;
      var name = this.data.dishes[parentIndex].goods[index].name + this.data.dishes[parentIndex].goods[index].gg[ggindex].name;
      var id = this.data.dishes[parentIndex].goods[index].id;
      // console.log(id)
      var icon = this.data.dishes[parentIndex].goods[index].img;
      var store = this.data.store
      var obj = { ggindex: ggindex, money: money, num: num, id: id, mark: mark, name: name, index: index, parentIndex: parentIndex, icon: icon, store: store, box_fee: box_fee };
      var carArray1 = this.data.carArray.filter(item => item.mark != mark)
      carArray1.splice(index, 0, obj)
      console.log(carArray1)
      this.setData({
        shop_cart: carArray1,
        carArray: carArray1,
        dishes: this.data.dishes
      })
      console.log(this.data.carArray)
      this.calTotalPrice();
      this.setData({
        payDesc: this.payDesc()
      })
    }
    else {
      console.log(ggindex)
      that.data.dishes[parentIndex].goods[index].one--;
      var mark = 'a' + index + 'b' + parentIndex
      if (that.data.types == 2) {
        var money = that.data.dishes[parentIndex].goods[index].wm_money;
      } else {
        var money = that.data.dishes[parentIndex].goods[index].money;
      }
      var box_fee = that.data.dishes[parentIndex].goods[index].box_fee;
      console.log("餐盒费是：" + box_fee)
      var num = that.data.dishes[parentIndex].goods[index].one;
      var name = that.data.dishes[parentIndex].goods[index].name;
      var id = that.data.dishes[parentIndex].goods[index].id;
      var icon = that.data.dishes[parentIndex].goods[index].img;
      var store = that.data.store
      var obj = { money: money, num: num, id: id, mark: mark, name: name, index: index, parentIndex: parentIndex, icon: icon, store: store, box_fee: box_fee };
      var carArray1 = that.data.carArray.filter(item => item.mark != mark)
      carArray1.splice(index, 0, obj)
      // console.log(this.data.dishes[parentIndex].goods)
      that.setData({
        shop_cart: carArray1,
        carArray: carArray1,
        dishes: that.data.dishes
      })
      that.calTotalPrice();
      that.setData({
        payDesc: that.payDesc()
      })
      console.log(that.data.dishes)
    }
  },
  decreaseCart: function (e) {
    console.log('你点击了减号')
    var that = this;
    console.log(this.data)
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    console.log(index, parentIndex)
    console.log(parentIndex, that.data.dishes[parentIndex].goods[index].id)
    // 请求此菜品是否多规格
    app.util.request({
      'url': 'entry/wxapp/DishesGg',
      'cachetime': '0',
      data: { dishes_id: that.data.dishes[parentIndex].goods[index].id },
      success: function (res) {
        console.log(res)
        if (res.data.length != 0) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '多规格商品只能在购物车删除哦',
          })
        }
        else {
          that.data.dishes[parentIndex].goods[index].one--;
          var mark = 'a' + index + 'b' + parentIndex
          if (that.data.types == 2) {
            var money = that.data.dishes[parentIndex].goods[index].wm_money;
          } else {
            var money = that.data.dishes[parentIndex].goods[index].money;
          }
          var box_fee = that.data.dishes[parentIndex].goods[index].box_fee;
          console.log("餐盒费是：" + box_fee)
          var num = that.data.dishes[parentIndex].goods[index].one;
          var name = that.data.dishes[parentIndex].goods[index].name;
          var id = that.data.dishes[parentIndex].goods[index].id;
          var icon = that.data.dishes[parentIndex].goods[index].img;
          var store = that.data.store
          var obj = { money: money, num: num, id: id, mark: mark, name: name, index: index, parentIndex: parentIndex, icon: icon, store: store, box_fee: box_fee };
          var carArray1 = that.data.carArray.filter(item => item.mark != mark)
          carArray1.splice(index, 0, obj)
          // console.log(this.data.dishes[parentIndex].goods)
          that.setData({
            shop_cart: carArray1,
            carArray: carArray1,
            dishes: that.data.dishes
          })
          that.calTotalPrice();
          that.setData({
            payDesc: that.payDesc()
          })
          console.log(that.data.dishes)
        }
      },
    })
  },
  //
  xzggClick: function (e) {
    this.setData({
      xzggindex: e.currentTarget.id
    });
  },
  //
  xhl: function () {
    var index = this.data.zindex;
    var parentIndex = this.data.findex;
    console.log(this.data.zindex, this.data.findex)
    console.log(this.data.dishes)
    this.data.dishes[parentIndex].goods[index].one++;
    this.data.dishes[parentIndex].goods[index].gg[this.data.xzggindex].num++;
    var mark = 'a' + index + 'b' + parentIndex + 'c' + this.data.gg[this.data.xzggindex].id
    var ggindex = this.data.xzggindex
    if (this.data.types == 2) {
      var money = this.data.gg[this.data.xzggindex].cost;
    } else {
      var money = this.data.gg[this.data.xzggindex].cost;
    }
    var box_fee = this.data.dishes[parentIndex].goods[index].box_fee;
    console.log("餐盒费是：" + box_fee)
    var num = this.data.dishes[parentIndex].goods[index].gg[this.data.xzggindex].num;
    var name = this.data.ggbt + this.data.gg[this.data.xzggindex].name;
    var id = this.data.dishes[parentIndex].goods[index].id;
    // console.log(id)
    var icon = this.data.dishes[parentIndex].goods[index].img;
    var store = this.data.store
    var obj = { ggindex: ggindex, money: money, num: num, id: id, mark: mark, name: name, index: index, parentIndex: parentIndex, icon: icon, store: store, box_fee: box_fee };
    var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    carArray1.splice(index, 0, obj)
    console.log(carArray1)
    this.setData({
      shop_cart: carArray1,
      carArray: carArray1,
      dishes: this.data.dishes
    })
    this.calTotalPrice();
    this.setData({
      payDesc: this.payDesc()
    })
    this.setData({
      showModal: false,
      xzggindex: 0
    })
  },
  //——————————————点击加号——————添加到购物车
  addCart: function (e) {
    console.log(this.data)
    var that = this;
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.setData({
      zindex: index,
      findex: parentIndex
    })
    console.log(parentIndex, that.data.dishes[parentIndex].goods[index].id)
    // 请求此菜品是否多规格
    app.util.request({
      'url': 'entry/wxapp/DishesGg',
      'cachetime': '0',
      data: { dishes_id: that.data.dishes[parentIndex].goods[index].id },
      success: function (res) {
        console.log(res)
        //是多规格
        if (res.data.length != 0) {
          //如果是多规格且第一次点
          if (that.data.dishes[parentIndex].goods[index].gg == null) {
            that.setData({
              showModal: true,
              gg: res.data,
              ggbt: that.data.dishes[parentIndex].goods[index].name
            })
            that.data.dishes[parentIndex].goods[index].gg = res.data
            that.setData({
              dishes: that.data.dishes
            })
            console.log(that.data.dishes)
          }
          //如果是多规格且不是第一次点
          else {
            that.setData({
              showModal: true,
              gg: res.data,
              ggbt: that.data.dishes[parentIndex].goods[index].name
            })
            console.log(that.data.dishes)
          }
        }//不是多规格
        else {
          that.data.dishes[parentIndex].goods[index].one++;
          var mark = 'a' + index + 'b' + parentIndex
          if (that.data.types == 2) {
            var money = that.data.dishes[parentIndex].goods[index].wm_money;
          } else {
            var money = that.data.dishes[parentIndex].goods[index].money;
          }
          var box_fee = that.data.dishes[parentIndex].goods[index].box_fee;
          console.log("餐盒费是：" + box_fee)
          var num = that.data.dishes[parentIndex].goods[index].one;
          var name = that.data.dishes[parentIndex].goods[index].name;
          var id = that.data.dishes[parentIndex].goods[index].id;
          // console.log(id)
          var icon = that.data.dishes[parentIndex].goods[index].img;
          var store = that.data.store
          var obj = { money: money, num: num, id: id, mark: mark, name: name, index: index, parentIndex: parentIndex, icon: icon, store: store, box_fee: box_fee };
          var carArray1 = that.data.carArray.filter(item => item.mark != mark)
          carArray1.splice(index, 0, obj)
          console.log(carArray1)
          that.setData({
            shop_cart: carArray1,
            carArray: carArray1,
            dishes: that.data.dishes
          })
          console.log(that.data.dishes)
          that.calTotalPrice();
          that.setData({
            payDesc: that.payDesc()
          })
        }
      },
    })
  },

  //计算总价
  calTotalPrice: function () {
    // console.log(this.data)
    var carArray = this.data.carArray;
    var totalPrice = 0;
    var totalbox = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      if (this.data.types == 2) {
        totalPrice += carArray[i].money * carArray[i].num + carArray[i].box_fee * carArray[i].num;
        totalCount += carArray[i].num;
        totalbox += carArray[i].box_fee * carArray[i].num;
      } else {
        totalPrice += carArray[i].money * carArray[i].num;
        totalCount += carArray[i].num;
      }
      console.log(totalPrice)

    }
    // console.log(carArray)
    this.setData({
      shop_cart: carArray,
      totalPrice: totalPrice.toFixed(2),
      totalCount: totalCount,
      totalbox: totalbox
    });
  },
  //差几元起送
  payDesc() {
    console.log(this.data)
    var totalPrice = parseFloat(this.data.totalPrice)
    var start_at = parseFloat(this.data.start_at)
    if (this.data.types == 2) {
      if (this.data.totalPrice == 0) {
        return '￥' + this.data.start_at + '元起送';
      } else if (this.data.totalPrice <= 0) {
        return '￥' + this.data.start_at + '元起送';
      } else if (totalPrice < start_at) {
        console.log(this.data.totalPrice)
        let diff = start_at - totalPrice;
        return '还差' + diff.toFixed(2) + '元起送';
        console.log(start_at - totalPrice)
      } else {
        console.log(totalPrice)
        return '去结算';
      }
    } else {
      if (this.data.totalPrice >= 0) {
        return '去下单';
      }
    }

  },
  clear: function (e) {
    var that = this
    that.setData({
      shop_cart: [],
      carArray: [],
      carArray1: [],
      changeHidden: true
    })
    that.calTotalPrice();
    that.reload()
  },
  // 点击预览图片
  clickImage: function (e) {
    var that = this
    // 第一种放在scroll-view标签里面，苹果不显示
    // var id = e.currentTarget.id
    // var dishes = this.data.dishes
    // for (var i = 0, len = dishes.length; i < len; ++i) {
    //   // console.log(dishes[i].goods)
    //   for (var j = 0; j < dishes[i].goods.length; j++) {
    //     // console.log(dishes[i].goods[j])
    //     if (dishes[i].goods[j].id == id) {
    //       dishes[i].goods[j].open = !dishes[i].goods[j].open
    //     } else {
    //       dishes[i].goods[j].open = false
    //     }
    //     that.setData({
    //       dishes: dishes,
    //       id: e.currentTarget.id
    //     });
    //   }
    // }
    console.log(e)
    console.log(that.data)
    // 第二种，跳转页面,请求菜品详情的接口
    var url = that.data.url
    var urls = []
    var index = e.target.dataset.id
    console.log(index)
    var img = []
    // console.log(index)
    for (var n = 0; n < that.data.dishes.length; n++) {
      // console.log(that.data.dishes[n].goods)
      for (var m = 0; m < that.data.dishes[n].goods.length; m++) {
        console.log(that.data.dishes[n].goods[m].id)
        if (that.data.dishes[n].goods[m].id == index) {
          img.splice(index, 0, that.data.dishes[n].goods[m].img)
          // console.log(that.data)
          var goodm = that.data.dishes[n].goods[m]
          app.util.request({
            'url': 'entry/wxapp/DishesInfo',
            'cachetime': '0',
            data: { id: goodm.id },
            success: function (res) {
              console.log(res.data)
              wx: wx.navigateTo({
                url: '../dishinfo/dishinfo?id=' + goodm.id + '&types=' + that.data.types,
              })
            },
          })

        }
      }
    }

    // 第二种，微信自带的预览图片
    // urls.splice(index, 0,url + img);
    // wx.previewImage({
    //   // current: url + '/attachment/',
    //   urls: urls// 需要预览的图片http链接列表
    // })
  },
  bomb: function (e) {
    var that = this
    var id = e.currentTarget.id
    var dishes = this.data.dishes
    for (var i = 0, len = dishes.length; i < len; ++i) {
      // console.log(dishes[i].goods)
      var goods = dishes[i].goods;
      for (var j = 0; j < goods.length; j++) {
        // console.log(goods[j])
        if (goods[j].id == id) {
          goods[j].open = !goods[j].open
        } else {
          goods[j].open = false
        }
      }
    }
    this.setData({
      dishes: dishes,
      id: e.currentTarget.id
    });
  },
  jcgwc: function (arr) {
    var a = 0;
    for (var i in arr) {
      if (arr[i].num != 0) {
        a++
      }
    }
    return a;
  },
  //結算
  pay(e) {
    console.log(this.data.types)
    console.log(this.data.shop_cart)
    if (this.data.types == 2) {
      var pay = this.data.shop_cart;
      console.log(this.data.shop_cart)
      console.log(this.jcgwc(pay))
      console.log(this.data)
      wx.setStorageSync("store", this.data.store)
      wx.setStorageSync("order", this.data.shop_cart)
      if (pay == null || pay.length == 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择菜品',
        })
        return
      }
      if (this.jcgwc(pay) == 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择菜品',
        })
        return
      }
      if (parseFloat(this.data.totalPrice) < parseFloat(this.data.start_at)) {
        return;
      }
      var resultType = "success";
      wx.navigateTo({
        url: '../pay/pay?types=' + this.data.types
      })
    } else {
      var tableid = this.data.tableid;
      var pay = this.data.shop_cart;
      console.log(this.data.shop_cart)
      console.log(this.data)
      wx.setStorageSync("store", this.data.store)
      wx.setStorageSync("order", this.data.shop_cart)
      var resultType = "success";
      wx.navigateTo({
        url: '../order/order?types=' + this.data.types + '&tableid=' + tableid
      })
    }

  },
  navInfo: function (e) {
    wx.switchTab({
      url: '../info/info',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ————————————————————底部弹框——————————————————————
  change: function (e) {
    console.log('1111')
    this.setData({ changeHidden: true })
  },
  toastChange: function (e) {
    this.setData({ toastHidden: true })
  },
  change1: function (e) {
    console.log('1111')
    this.setData({ changeHidden: false })
  },
})

