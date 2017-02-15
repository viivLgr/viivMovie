// welcome/welcome.js
Page({
  data:{
    username: 'sss',
    img: ''
  },
  onLoad:function(options){
    var _this = this;
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo;
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;
        var gender = userInfo.gender; //性别 0：未知、1：男、2：女 
        var province = userInfo.province;
        var city = userInfo.city;
        var country = userInfo.country;
        console.log(avatarUrl);
        _this.setData({
          username: nickName,
          img: avatarUrl
        })
      }
    })
  },
  onTap: function(event){
    wx.switchTab({
      url: '../posts/post'
    })
    //122100版本中中 如果要跳转到一个带tab选项卡的页面，必须使用wx.switchTab这个新增方法。 
    //但如果要跳转到一个不带tab选项卡的页面，还是需要使用redirect或者navigate.
  }
})