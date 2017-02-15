//只取[1,1,1,0,0,]
function converToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 0; i < 5; i++) {
        if (i < num) {
            array.push(1);
        } else {
            array.push(0)
        }
    }
    return array;
}
//取半星
function converToStarsArray2(stars) {
    var array = [];
    var num = stars.toString().substring(0, 1);
    var half = stars % 10;
    for (var i = 0; i < 5; i++) {
        if (i < num) {
            array.push(1);
        } else {
            array.push(0)
        }
    }
    if (half != 0) {
        array[num] = 2;
    }
    return array;
}

function http(url,callback){
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
          'Content-Type':'json'
      }, // 设置请求的 header
      success: function(res){
        // success
        callback(res.data);
      },
      fail: function(msg) {
        // fail
        console.log(msg);
      }
    })
}

function converToCastString(casts){
    var castsjoin = '';
    for(var idx in casts){
        castsjoin = castsjoin + casts[idx].name + ' / ';
    }
    return castsjoin.substring(0,castsjoin.length-2);
}

function convertToCastInfos(casts){
    var castsArray = [];
    for(var idx in casts){
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : '',
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;

}

module.exports = {
    converToStarsArray: converToStarsArray,
    converToStarsArray2: converToStarsArray2,
    http: http,
    converToCastString: converToCastString,
    convertToCastInfos: convertToCastInfos
}