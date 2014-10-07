var React = require('react');
var _ = require('underscore');
var GoalRow = require('./goal-row');

var defaultTask = function() {
  return {
    name: '',
    completed: false
  };
};

var defaultSecondary = function() {
  return {
    name: 'secondary',
    els: _.times(3, defaultTask)
  };
};

var containerTools = function(addRow) {
  return React.DOM.div({
    className: 'container-tools-container'
  },
    null,
    React.DOM.ul({
      className: 'container-tools actions'
    },
      null,
      React.DOM.li({
        className: 'container-tool action',
        onClick: addRow
      },
        'add row'
      )
    )
  );
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
          defaultSecondary()
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
    }, null].concat(rows).concat([containerTools(this.addRow)]));
  },
  onChange: function(rowIndex, elIndex, key, newValue) {
    var newRows = _.clone(this.state.rows);
    newRows[rowIndex].els[elIndex][key] = newValue;
    this.setState({rows: newRows});
  },
  addRow: function() {
    var newRows = _.clone(this.state.rows);
    newRows.push(defaultSecondary());
    this.setState({rows: newRows});
  },
  componentDidUpdate: _.debounce(function() {
    console.log('saving to localstorage');
    localStorage.setItem('goals', JSON.stringify(this.state));
  }, 3000)
});

module.exports = GoalContainer;
