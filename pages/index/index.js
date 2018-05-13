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
  data: {
    newsType: '',
    // tab切换  
    currentTab: 0, 
    newsListByTpe: [],
    newsTypeHeaders: newsTypeMap
  },
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
  onLoad(){
    let temp = this.data.newsType === "" ? newsTypeList[0] : this.data.newsType
    this.getNewsListByType(temp)
  },
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
            //news.source = news.source == "" ? news.source = "网络媒体" : news.source
            news.firstImage = news.firstImage == "" ? news.firstImage = "/images/404.jpg" : news.firstImage
            tempList.push({
              ...news,
              date: news.date.slice(0, 10),
              //source: news.source
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
    var that = this;
    if (this.data.currentTab === event.target.dataset.current) {
      return false;
    } else {
      this.getNewsListByType(event.currentTarget.dataset.typeid)
      that.setData({
        currentTab: event.target.dataset.current,
        newsType: event.currentTarget.dataset.typeid
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
