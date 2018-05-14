// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: '',
    date: new Date(),
    source: '',
    readCount: 0,
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getNewsDetails()
  },
  /**
   * 得到detail页面信息
   */
  getNewsDetails(){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.id
      },
      success: res => {
        if(res.data.code === 200){
          let result = res.data.result
          result.source = result.source == "" ? result.source = "网络媒体" : result.source
          result.date = result.date.slice(0, 10) + ' ' + result.date.slice(11, 16)
          this.setData({
            ...result,
            source: result.source,
            date: result.date,
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '数据加载异常，请稍后再尝试！',
            duration: 1000
          })
        }
      },
      fail(){
        wx.showToast({
          icon: 'none',
          title: '数据加载异常，请稍后再尝试！',
          duration: 1000
        })
      }
    })
  },
})