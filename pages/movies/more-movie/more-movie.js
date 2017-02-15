// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/utils.js');
Page({
  data: {
    movies: {},
    totalCount: 0,
    requestUrl: '',
    isEmpty: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category;
    wx.setNavigationBarTitle({
      title: category
    })
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250";
    var url = '';
    switch (category) {
      case '正在热映':
        url = inTheatersUrl;
        break;
      case '即将上映':
        url = comingSoonUrl;
        break;
      case '豆瓣Top250':
        url = top250Url;
        break;
    }
    util.http(url,this.getDoubanData);
    wx.showNavigationBarLoading();
    this.setData({
      requestUrl: url
    })
  },
  //下拉刷新
  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';
     this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0
    })
    util.http(refreshUrl,this.getDoubanData);
    wx.showNavigationBarLoading();
  },
  //触底加载更多方法1  不需要scroll-view
  onReachBottom:function(event){
    var nextUrl = this.data.requestUrl + '?start='+ this.data.totalCount +'&count=20';
    util.http(nextUrl,this.getDoubanData);
    wx.showNavigationBarLoading();
  },
  //触底加载更多方法2   和scroll-view绑定有效  新版本scroll-view和下拉刷新又冲突 所以选择触底加载更多方法1
  onScrollToLower:function(event){
    var nextUrl = this.data.requestUrl + '?start='+ this.data.totalCount +'&count=20';
    util.http(nextUrl,this.getDoubanData);
    wx.showNavigationBarLoading();
  },
  getDoubanData: function (doubanData) {
    var movies = [];
    for (var idx in doubanData.subjects) {
        var subject = doubanData.subjects[idx];
        var title = subject.title;
        if(title.length > 6){
          title = title.substring(0,6) + '...';
        }
        var temp = {
          coverageUrl: subject.images.large,
          title: title,
          average: subject.rating.average,
          movieId: subject.id,
          stars: util.converToStarsArray2(subject.rating.stars)
        }
        movies.push(temp);
    }
    var totalMoives = {};
    //如果需要绑定新加载的数组 要把之前的数据结合在一起
    if(!this.data.isEmpty){
      totalMoives = this.data.movies.concat(movies);
    }else{
      totalMoives = movies;
      this.setData({
        isEmpty: false
      });
    }
    this.setData({
      totalCount: this.data.totalCount+20,
      movies: totalMoives
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  toMovieDetailView:function(event){
      var movieId = event.currentTarget.dataset.movieid;
      wx.navigateTo({
        url: '../movie-detail/movie-detail?id='+movieId,
        success: function(res){
          // success
        }
      })
  }
})