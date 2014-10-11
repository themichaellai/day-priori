var React = require('react');
var _ = require('underscore');
var GoalRow = require('./goal-row');
var util = require('./util');

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

var containerTools = function(addRow, editRows, state) {
  var optionalTools = [
    React.DOM.li({
      className: 'btn btn-default container-tool action',
      onClick: addRow
    },
      'add row'
    )
  ];
  return React.DOM.div({
    className: 'container-tools-container'
  },
    null,
    util.viewApply(React.DOM.ul, {
      className: 'container-tools actions'
    },
      null,
      util.eitherOr(state.editingRows, optionalTools),
      React.DOM.li({
        className: 'btn btn-default container-tool action',
        onClick: editRows
      },
        state.editingRows ? 'stop editing' : 'edit'
      )
    )
  );
};

var GoalContainer = React.createClass({displayName: 'GoalContainer',
  getInitialState: function() {
    var lsGoals = localStorage.getItem('goals');
    if (lsGoals) {
      return {
        rows: JSON.parse(lsGoals),
        editingRows: false
      }
    } else {
      return {
        rows: [
          {
            name: 'primary',
            els: _.times(1, defaultTask)
          },
          defaultSecondary()
        ],
        editingRows: false
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
        onChange: _that.onChange.bind(null, rowIndex),
        editingRows: _that.state.editingRows,
        removeRow: _that.removeRow.bind(null, rowIndex),
        shouldBeRemovable: rowIndex > 1 ? true : false
      });
    });
    return util.viewApply(React.DOM.div, {
      className: 'goal-container'
    },
      null,
      rows,
      containerTools(this.addRow, this.editRows, this.state)
    );
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
  editRows: function() {
    this.setState({editingRows: !this.state.editingRows});
  },
  removeRow: function(rowIndex) {
    var newRows = _.clone(this.state.rows);
    newRows.splice(rowIndex, 1);
    this.setState({rows: newRows});
  },
  componentDidUpdate: _.debounce(function(prevProps, prevState) {
    if (prevState.rows != this.state.rows) {
      localStorage.setItem('goals', JSON.stringify(this.state.rows));
    }
  }, 1000)
});

module.exports = GoalContainer;
