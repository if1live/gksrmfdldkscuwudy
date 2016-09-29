// initialize clipboard.js
new Clipboard('.btn-clipboard');

function loadTable(tableName, cb) {
    if (typeTable.hasOwnProperty(tableName)) {
        return;
    }
    typeTable[tableName] = null;
    $.getJSON("./data/" + tableName + ".json", function(data) {
        typeTable[tableName] = prepareTable(data);
        if (_.includes(typeTable, null)) {
            return;
        } else if (cb) {
            cb();
        }
    }).fail(function(err) { JSON.parse(err.responseText); console.log(err); });
}

function prepareTable(table) {
    var specialKeys = _.keys(table).filter(function(k) { return k.startsWith("$") && k.length > 1; });
    var specials = _.zipObject(specialKeys, _.map(specialKeys, function(k) {
        var val = table[k];
        if (k.startsWith("$")) {
            return eval(val);
        } else {
            return val;
        }
    }));
    return _.assign({
        from: _.zipObject(_.values(table), _.keys(table)),
        to: table
    }, specials);
}

function decodeCharacter(ch, table) {
    if (table.from.hasOwnProperty(ch)) {
        return table.from[ch];
    } else {
        return ch;
    }
}

function encodeCharacter(ch, table) {
    if (table.to.hasOwnProperty(ch)) {
        return table.to[ch];
    } else {
        return ch;
    }
}

function decodeString(str, table) {
    return _.map(str, function(ch) { return decodeCharacter(ch, table); });
}

function encodeString(str, table) {
    return _.map(str, function(ch) { return encodeCharacter(ch, table); });
}

var typeTable = {};

$("#input-type,#output-type").change(function(event) {
    var tableName = $(event.target).val();
    loadTable(tableName, function() {
        updateResult.bind($('#src-text'))();
    });
});

function updateResult() {
  var text = $(this).val();
  if(!text) { return; }
  var inTable = typeTable[$("#input-type").val()];
  var outTable = typeTable[$("#output-type").val()];

  var inputLines = text.match(/[^\r\n]+/g);

  var outputLines = inputLines.map(function(line) {
    var arr;
    if (inTable.hasOwnProperty("$in")) {
      arr = inTable["$in"](line);
    } else {
      arr = line.split("");
    }
    var decoded = decodeString(arr, inTable);
    var encoded = encodeString(decoded, outTable);
    if (outTable.hasOwnProperty("$out")) {
      return outTable["$out"](encoded);
    }
    return encoded.join("");
  });

  var output = outputLines.join('\n');
  $('#dst-text').val(output);
}

$('#src-text').on('change keyup paste', updateResult);

// init list
$.getJSON("./data/list.json", function(data) {
    var types = $("#input-type,#output-type");
    types.empty();
    _.forEach(data, function(name, type) { types.append("<option value=" + type + ">" + name + "</option>") });
    $("#input-type").val("qwerty");
    $("#output-type").val("2bulsik");
    _.map(["qwerty", "2bulsik"], loadTable);
});
