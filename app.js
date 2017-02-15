App({
  globalData:{
      g_isPlayingMusic: false,
      g_isPlayingMusicPostId: null,
      doubanBase: 'https://api.douban.com'
  },
  onLaunch: function () {
    console.log("onLaunch");
  },
  onShow: function () {
    console.log("onShow");
  },
  onHide: function () {
    console.log("onHide");
  },
  onError: function (msg) {
    console.log(msg);
  }
})