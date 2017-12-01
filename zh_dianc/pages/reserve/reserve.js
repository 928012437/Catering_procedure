// pages/reserve/reserve.js
var app = getApp()
var form_id;
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    index: 0,
    time: '12:00',
    array: []
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this
    form_id = e.detail.formId
    that.setData({
      form_id: form_id
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var openid = wx.getStorageSync('openid')
    var sjname = this.data.store.name
    var uid = wx.getStorageSync('users').id;
    var storeid = this.data.store.id;
    var date = e.detail.value.datepicker, time = e.detail.value.timepicker, zwtype = e.detail.value.zwpicker.name,
      zwid = e.detail.value.zwpicker.id, zdxf= e.detail.value.zwpicker.zd_cost, lxr = e.detail.value.lxr, jcrs = e.detail.value.jcrs, tel = e.detail.value.tel,
      beizhu = e.detail.value.beizhu;
    console.log(openid,sjname,uid, storeid, date, time, zwtype, zwid, lxr, jcrs, tel, beizhu)
    var warn = "";
    var flag = true;
    if (lxr == "") {
      warn = "请填写您的姓名！";
    } else if (jcrs == '') {
      warn = "请选择您的就惨人数"
    } else if (tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(tel))) {
      warn = "手机号格式不正确";
    } else {
      flag = false;
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
          'url': 'entry/wxapp/Reservation',
          'cachetime': '0',
          data: {
            store_id: storeid, user_id: uid, xz_date: date, yjdd_date: time,
            table_type_id: zwid, table_type_name: zwtype,zd_cost:zdxf,link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu
          },
          success: function (res) {
            console.log(res)
            if(res.data!='预定失败'){
              wx.showToast({
                title: '预约成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'reserveinfo?ydid='+res.data,
                })
              }, 1000)
              //发邮件
              if (that.data.ptxx.is_email == '1') {
                app.util.request({
                  'url': 'entry/wxapp/email',
                  'cachetime': '0',
                  data: { store_id: storeid, type: '预约' },
                  success: function (res) {
                    console.log(res)
                  },
                })
              }
              //发短信 
              app.util.request({
                'url': 'entry/wxapp/sms2',
                'cachetime': '0',
                success: function (res) {
                },
              })
              //发模板消息
              app.util.request({
                'url': 'entry/wxapp/Message3',
                'cachetime': '0',
                data: {
                  openid: openid, form_id: form_id, xz_date: date, store_name: sjname, yjdd_date: time,
                  link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu
                },
                success: function (res) {
                  console.log(res)
                },
              })
            }
            else{
              wx.showToast({
                title: '请重试',
                icon:'loading',
                duration:1000,
              })
            }
          },
        })
      }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var end =util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(end.toString())
    this.setData({
      date:end
    })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          ptxx: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      data:{store_id:getApp().sjid},
      success: function (res) {
        console.log(res)
        that.setData({
          array: res.data
        })
      },
    })
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
        that.setData({
          store: res.data,
          color:res.data.color
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