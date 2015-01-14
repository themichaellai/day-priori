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

var defaultSecondary = function(tasks) {
  if (tasks) {
    var cleanedTasks = tasks.concat(_.times(3-tasks.length, defaultTask));
    return {
      name: 'secondary',
      els: cleanedTasks
    };
  } else {
    return {
      name: 'secondary',
      els: _.times(3, defaultTask)
    };
  }
};

var containerTools = function(addRow, editRows, shiftSecondary, state) {
  var optionalTools = [
    React.DOM.li({
      className: 'btn btn-default container-tool action',
      onClick: addRow
    },
      'add row'
    ),
    React.DOM.li({
      className: 'btn btn-default container-tool action',
      onClick: shiftSecondary
    },
      'shift secondary'
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
      };
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
      containerTools(
        this.addRow,
        this.editRows,
        this.shiftSecondary,
        this.state
      )
    );
  },
  onChange: function(rowIndex, elIndex, newVals) {
    var newRows = _.clone(this.state.rows);
    for (var key in newVals) {
      newRows[rowIndex].els[elIndex][key] = newVals[key];
    }
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
  shiftSecondary: function() {
    var primaryRows = this.state.rows.filter(function(r) {
      return r.name === "primary";
    });
    var secondaryTasks = _.flatten(this.state.rows.filter(function(r) {
      return r.name === "secondary";
    }).map(function(r) {
      return r.els.filter(function(el) { return el.name !== ""; });
    }));
    var newSecondaryRows = [];
    for (var i = 0; i < secondaryTasks.length; i+=3) {
      newSecondaryRows.push(defaultSecondary(secondaryTasks.slice(i, i+3)));
    }
    this.setState({rows: primaryRows.concat(newSecondaryRows)});
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
