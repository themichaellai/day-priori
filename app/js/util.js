_ = require('underscore');

module.exports = {
  viewApply: function(viewConsructor) {
    var els = _.flatten(Array.prototype.slice.call(arguments, 1));
    els = _.first(els, 2).concat(_.compact(_.rest(els, 2)));
    return viewConsructor.apply(this, els)
  },
  classList: function() {
    return _.compact(arguments).join(' ');
  },
  eitherOr: function(f, e, o) {
    var either = e || null;
    var or = o || null;
    return f ? e : o;
  }
}
