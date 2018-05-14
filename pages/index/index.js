const newsTypeList = ['gn','gj','cj','yl','js','ty','other']
const newsTypeMap = [
  {id:'gn', desc: '国内'},
  {id: 'gj', desc: '国际'},
  {id: 'cj', desc: '财经'},
  {id: 'yl', desc: '娱乐'},
  {id: 'js', desc: '军事'},
  {id: 'ty', desc: '体育'},
  {id: 'other', desc: '其他'}
]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsType: '',
    // tab切换  
    currentTab: 0, 
    newsListByTpe: [],
    newsTypeHeaders: newsTypeMap
  },
  /**
   * 页面下拉更新
   */
  onPullDownRefresh() {
    let temp = this.data.newsType === "" ? newsTypeList[0] : this.data.newsType
    console.log(temp)
    this.getNewsListByType(temp,() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '更新成功',
        duration: 1000
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(){
    let temp = this.data.newsType === "" ? newsTypeList[0] : this.data.newsType
    this.getNewsListByType(temp)
  },
  /**
   * 根据类型，得到新闻列表
   */
  getNewsListByType(newsType, callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: newsType
      },
      success: res => {
        if (res.data.code === 200 && Array.isArray(res.data.result)){
          let result = res.data.result
          let tempList = []
          result.forEach(news => {
            news.source = news.source == "" ? news.source = "网络媒体" : news.source
            news.firstImage = news.firstImage == "" ? news.firstImage = "/images/404.jpg" : news.firstImage
            tempList.push({
              ...news,
              date: news.date.slice(0, 10),
              source: news.source,
              firstImage: news.firstImage
            })
          })
          this.setData({
            newsListByTpe: tempList
          })
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#aae1fc'
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
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  /** 
   * 点击tab切换 
   */
  onTapNewsList: function (event) {
    var currentData = event.target.dataset;
    if (this.data.currentTab === currentData.current) {
      return false;
    } else {
      this.getNewsListByType(currentData.typeid)
      this.setData({
        currentTab: currentData.current,
        newsType: currentData.typeid
      })
    }
    console.log(this.data.newsType)
  },
  /**
   * 点击跳转到新闻详情页面
   */
  OnTapNewsDetail: function(event){
    wx.navigateTo({
      url: '/pages/details/details?id=' + event.currentTarget.dataset.id,
    })
  }
})
