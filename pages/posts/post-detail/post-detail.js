var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
    data: {
        isPlayMusic: false
    },
    onLoad: function (options) {
        var globalData = app.globalData;
        // 生命周期函数--监听页面加载
        var postId = options.id;
        this.setData({
            currentPostId: postId
        })
        var postData = postsData.postList[postId];
        //this.data.postData = postData; //无用
        this.setData({
            postData: postData
        });
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        this.setMusicMonitor();
    },
    //监听音乐
    setMusicMonitor: function () {
        var that = this;
        var currentPostId = this.data.currentPostId;
        if (app.globalData.g_isPlayingMusic && app.globalData.g_isPlayingMusicPostId === currentPostId) {
            this.setData({
                isPlayMusic: true
            });
        }
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_isPlayingMusicPostId = currentPostId;
        })
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_isPlayingMusicPostId = null;
        })

    },
    onCollectionTap: function (event) {
        //同步
        //this.getPostCollectedSyc();
        this.getPostCollected()
    },
    //异步
    getPostCollected: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                // success
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                //取反
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },
    //同步
    getPostCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //取反
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },
    showToast: function (postsCollected, postCollected) {
        //更新缓存文章是否收藏
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消成功',
            icon: 'success',
            duration: 1000
        })
    },
    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: '收藏',
            content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
            showCancel: 'true',
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '确认',
            confirmColor: '#f40',
            success: function (res) {
                if (res.confirm) {
                    //更新缓存文章是否收藏
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据绑定
                    that.setData({
                        collected: postCollected
                    });
                }
            }
        })
    },
    onShareTap: function (event) {
        var itemList = [
            '分享给微信好友',
            '分享到朋友圈',
            '分享到QQ',
            '分享到微博'
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#f40',
            success: function (res) {
                //red.cancel  用户是否点击取消按钮
                wx.showToast({
                    title: '用户' + itemList[res.tapIndex]
                })
            },
            fail: function (res) {
                console.log(2)
                console.log(res.errMsg)
            }
        });
    },
    onMusicTap: function () {
        var isPlayMusic = this.data.isPlayMusic;
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        if (isPlayMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayMusic: false
            })
            app.globalData.g_isPlayingMusicPostId = null;
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            });
            this.setData({
                isPlayMusic: true
            })
            app.globalData.g_isPlayingMusicPostId = currentPostId;
        }

    },
    onHide:function(){
        var postsViewNum = wx.getStorageSync('posts_view_num');
        wx.setStorageSync('posts_view_num', postsViewNum);
    }
})