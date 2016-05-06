// initialize clipboard.js
new Clipboard('.btn-clipboard');

// alphabet -> hangul table
var ALPHABET_TABLE = {
  a: 'ㅁ',
  b: 'ㅠ',
  c: 'ㅊ',
  d: 'ㅇ',
  e: 'ㄷ',
  f: 'ㄹ',
  g: 'ㅎ',
  h: 'ㅗ',
  i: 'ㅑ',
  j: 'ㅓ',
  k: 'ㅏ',
  l: 'ㅣ',
  m: 'ㅡ',
  n: 'ㅜ',
  o: 'ㅐ',
  p: 'ㅔ',
  q: 'ㅂ',
  r: 'ㄱ',
  s: 'ㄴ',
  t: 'ㅅ',
  u: 'ㅕ',
  v: 'ㅍ',
  w: 'ㅈ',
  x: 'ㅌ',
  y: 'ㅛ',
  z: 'ㅋ',
};

var SHIFT_TABLE = {
  Q: 'ㅃ',
  W: 'ㅉ',
  E: 'ㄸ',
  R: 'ㄲ',
  T: 'ㅆ',
  O: 'ㅒ',
  P: 'ㅖ',
};

function convertAlphabetToHangulCharacter(ch) {
  // a~z
  if(ch >= 'a' && ch <= 'z') {
    var idx = ch.toLowerCase();
    return ALPHABET_TABLE[idx];
  }

  // A~Z
  if(ch >= 'A' && ch <= 'Z') {
    var candidate = SHIFT_TABLE[ch];
    if(candidate) {
      return candidate;
    }
    var idx = ch.toLowerCase();
    return  ALPHABET_TABLE[idx];
  }

  return ch;
}

function convertAlphabetToHangleArray(arr) {
  var line = arr.map(convertAlphabetToHangulCharacter);
  return line;
}

$('#src-text').on('change keyup paste', function() {
  var text = $(this).val();
  if(!text) { return; }

  var inputLines = text.match(/[^\r\n]+/g);

  var outputLines = inputLines.map(function(line) {
    var arr = line.split("");
    var converted = convertAlphabetToHangleArray(arr);
    return Hangul.assemble(converted);
  });

  var output = outputLines.join('\n');
  $('#dst-text').val(output);
});
