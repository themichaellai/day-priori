_ = require('underscore');

module.exports = {
  classList: function() {
    return _.compact(arguments).join(' ');
  },
  eitherOr: function(f, e, o) {
    var either = e || null;
    var or = o || null;
    return f ? either : or;
  }
};
