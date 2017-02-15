var postsData = require('../../data/posts-data.js');
Page({
  data: {

  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    });
    //reading值
    var postsViewNum = wx.getStorageSync('posts_view_num');
    if(postsViewNum){
      if(postsViewNum[postId]){
        postsViewNum[postId]++;
      }else{
        postsViewNum[postId] = 1;
      }      
    }else{
      postsViewNum = {};
    }
    postsData.postList[postId].reading = postsViewNum[postId];
    wx.setStorageSync('posts_view_num', postsViewNum);
    this.setData({
      post_content: postsData.postList
    })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    //this.data.post_content = postsData.postList;
    var postsViewNum = wx.getStorageSync('posts_view_num');
    if(!postsViewNum){
      postsViewNum = {};
      wx.setStorageSync('posts_view_num', postsViewNum);
    }
    for (var i = 0; i < postsData.postList.length; i++) {
      postsData.postList[i].reading = postsViewNum[i];
    }
    this.setData({
      post_content: postsData.postList
    });
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    console.log("onShareAppMessage")
    return {
      title: '文章列表页', // 分享标题
      desc: 'viiv的文章列表页', // 分享描述
      path: 'path' // 分享路径
    }
  },
  onSwiperItemTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  //target 和 currentTarget
  //target指的是当前点击的组件  指的是image
  //currentTarget指的是事件捕获的组件  指的是swiper
  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    });
    //reading值
    var postsViewNum = wx.getStorageSync('posts_view_num');
    if(postsViewNum){
      if(postsViewNum[postId]){
        postsViewNum[postId]++;
      }else{
        postsViewNum[postId] = 1;
      }      
    }else{
      postsViewNum = {};
    }
    postsData.postList[postId].reading = postsViewNum[postId];
    wx.setStorageSync('posts_view_num', postsViewNum);
    this.setData({
      post_content: postsData.postList
    })
  }
})