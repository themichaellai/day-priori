var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var GoalItem = require('./goal-item');
var util = require('./util');

var editOverlay = function(props) {
  return React.DOM.ul({
    className: 'row-edit-overlay'
  },
    null,
    util.eitherOr(props.shouldBeRemovable,
      React.DOM.li({
          className: 'btn btn-default row-edit-action',
          onClick: props.removeRow
        },
          'remove'
        )
    )
  );
};


var GoalRow = React.createClass({displayName: 'GoalRow',
  render: function() {
    var _that = this;
    var goalItems = this.props.els.map(function(el, elIndex) {
      return GoalItem({
        key: _that.props.key + '.goalItem' + elIndex,
        name: el.name,
        rowIndex: _that.props.rowIndex,
        elIndex: elIndex,
        completed: el.completed,
        editingRows: _that.props.editingRows,
        number: _that.props.els.length,
        onGoalNameChange: _that.updateGoalText,
        rowName: _that.props.rowName,
        onChange: _that.props.onChange.bind(null, elIndex),
        swappingItem: _that.props.swappingItem,
        swap: _that.props.swap,
        startSwap: _that.props.startSwap
      });
    });
    return React.DOM.div({
      className: util.classList(
        'row',
        'goal-row',
        this.props.editingRows ? 'row-editing' : null
      )
    },
      null,
      this.props.editingRows ? editOverlay(this.props) : null,
      goalItems
    );
  },
  componentDidMount: function() {
    var goals = $(this.getDOMNode()).find('.goal-text');
    this.equalizeHeights(goals, 'outerHeight');
  },
  updateGoalText: function() {
    console.log('updateGoalText');
    var goals = $(this.getDOMNode()).find('.goal-text');
    this.equalizeHeights(goals, 'height');
  },
  equalizeHeights: function(goals, divHeightFunction) {
    var maxHeight = Math.max.apply(null, _.map(goals, function(g) {
        return $(g)[divHeightFunction]();
      })
    );
    var goalContainers = $(this.getDOMNode()).find('.goal');
    _.each(goalContainers, function(g) {
      $(g).height(maxHeight);
    });
  }
});

module.exports = GoalRow;
