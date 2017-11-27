var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

function mangleCocosModuleName(moduleNames) {
    var gameModules = moduleNames;
    var KeyArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
    var KeyArrLen = KeyArr.length;
    var mangleArr = [];
    gameModules = gameModules.sort(function (a, b) {
        return b.length - a.length
    });
    gameModules.forEach(function (elem, i) {
        var mangeName = "";
        var loop = Math.floor(i / KeyArrLen);
        var index = i % KeyArrLen;
        for (var j = 0; j < loop; j++) {
            mangeName += KeyArr[j];
        }
        mangeName += KeyArr[index];
        mangleArr.push(mangeName);
    });
    // 创建一个让每个文件通过的 stream 通道
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            // 返回空文件
            cb(null, file);
        }
        if (file.isBuffer()) {
            var code = String(file.contents);
            gameModules.forEach(function (elem, i) {
                code = code.replace(new RegExp(elem, 'g'), mangleArr[i]);
            })
            file.contents = new Buffer(code);
        }
        if (file.isStream()) {
            throw createError(file, 'Streaming not supported', null);
        }
        cb(null, file);
    });

};

module.exports = mangleCocosModuleName;