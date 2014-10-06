var React = require('react');
var _ = require('underscore');
var GoalRow = require('./goal-row');

var defaultTask = function() {
  return {
    name: '',
    completed: false
  };
};

var GoalContainer = React.createClass({displayName: 'GoalContainer',
  getInitialState: function() {
    var lsGoals = localStorage.getItem('goals');
    if (lsGoals) {
      return JSON.parse(lsGoals);
    } else {
      return {
        rows: [
          {
            name: 'primary',
            els: _.times(1, defaultTask)
          },
          {
            name: 'secondary',
            els: _.times(3, defaultTask)
          }
        ]
      };
    }
  },
  render: function() {
    var _that = this;
    var rows = this.state.rows.map(function(row, rowIndex) {
      return GoalRow({
        key: 'goalRow' + rowIndex,
        els: row.els,
        rowName: row.name,
        onChange: _that.onChange.bind(null, rowIndex)
      });
    });
    return React.DOM.div.apply(this, [{
      className: 'goal-container'
    }, null].concat(rows));
  },
  onChange: function(rowIndex, elIndex, key, newValue) {
    var newRows = _.clone(this.state.rows);
    newRows[rowIndex].els[elIndex][key] = newValue;
    this.setState({rows: newRows});
    localStorage.setItem('goals', JSON.stringify(this.state));
  }
});

module.exports = GoalContainer;
