var util = require('../../utils/utils.js');
var app = getApp();
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchMovies: {},
        searchPannelShow: false,
        containerShow: true,
        searchUrl: '',
        totalCount: 0
    },
    onBindFocus: function (event) {
        this.setData({
            searchPannelShow: true,
            containerShow: false
        })
    },
    onCancelTap: function (event) {
        this.setData({
            searchPannelShow: false,
            containerShow: true
        })
    },
    onBindConfirm: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text + '&start=0&count=20';
        this.setData({
            searchUrl: searchUrl,
            totalCount: 20
        })
        this.getMovieListData(searchUrl, 'searchMovies', '');
    },
    onLoad: function () {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + '?start=0&count=3';
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + '?start=0&count=3';
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + '?start=0&count=3';

        this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
        this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
        this.getMovieListData(top250Url, 'top250', '豆瓣Top250');
    },
    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-Type': 'json'
            }, // 设置请求的 header    application/json和“”都访问不到
            success: function (res) {
                // success
                that.processDouBanData(res.data, settedKey, categoryTitle)
            },
            fail: function (error) {
                // fail
                console.log(error);
            }
        })
    },
    processDouBanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var listTitle = moviesDouban.title;
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }

            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.converToStarsArray2(subject.rating.stars)
            }
            movies.push(temp);
        }
        var readyData = {};
        readyData[settedKey] = {
            tit: categoryTitle,
            category: settedKey,
            movies: movies
        };
        this.setData(readyData);
    },
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    toMovieDetailView: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId,
            success: function (res) {
                // success
            }
        })
    }
})