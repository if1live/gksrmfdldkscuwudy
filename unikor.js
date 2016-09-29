UniKor = {
    initials: ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"],
    assemble: function(arr) {
        var initial = null;
        var medial = null;
        var fin = null;
        var out = [];
        function init() {
            initial = medial = fin = null;
        }
        function flush() {
            function flushFinal() {
                if (fin !== null) {
                    out.push(String.fromCharCode(fin + 0x11a7));
                }
            }
            if (initial === null) {
                if (medial !== null) {
                    out.push(String.fromCharCode(medial + 0x314f));
                }
                flushFinal();
            } else if (medial === null) {
                out.push(UniKor.initials[initial]);
                flushFinal();
            } else {
                out.push(String.fromCharCode(((initial * 588) + (medial * 28) + fin) + 44032));
            }
            init();
        }
        function flushNotEmpty() {
            if (initial !== null || medial !== null || fin !== null) {
                flush();
            }
        }
        _.forEach(arr, function(och) {
            var ch = och.charCodeAt(0);
            if (ch >= 0x3131 && ch <= 0x314e) {
                var newInit = _.indexOf(UniKor.initials, och);
                if (newInit === initial && medial === null && fin === null) {
                    newInit++;
                } else if (initial !== null) {
                    flush();
                }
                initial = newInit;
            } else if (ch >= 0x314f && ch <= 0x3163) {
                if (medial !== null) {
                    flush();
                }
                medial = ch - 0x314f;
            } else if (ch >= 0x11a8 && ch <= 0x11c2) {
                if (fin !== null) {
                    flush();
                }
                fin = ch - 0x11a7;
            } else {
                flushNotEmpty();
                out.push(och);
            }
        });
        flushNotEmpty();
        return out.join("");
    },
    disassemble: function(str) {
        return _.flatten(_.map(str, function(och) {
            var ch = och.charCodeAt(0);
            if (ch >= 0xac00 && ch <= 0xd7a3) {
                ch -= 44032;
                var fi = ch % 28;
                ch /= Math.floor(28);
                var medial = ch % 21;
                var initial = Math.floor(ch / 21);
                var out = [];
                if (fi !== 0) {
                    out.unshift(String.fromCharCode(fi + 0x11a7));
                }
                out.unshift(String.fromCharCode(medial + 0x314f));
                out.unshift(["ㄱ", ["ㄱ", "ㄱ"], "ㄴ", "ㄷ", ["ㄷ", "ㄷ"], "ㄹ", "ㅁ", "ㅂ", ["ㅂ", "ㅂ"], "ㅅ", ["ㅅ", "ㅅ"], "ㅇ", "ㅈ", ["ㅈ", "ㅈ"], "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"][initial]);
                return out;
            } else {
                return och;
            }
        }));
    }
}
