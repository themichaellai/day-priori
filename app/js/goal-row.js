var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var GoalItem = require('./goal-item');

var GoalRow = React.createClass({displayName: 'GoalRow',
  render: function() {
    var _that = this;
    var goalItems = this.props.els.map(function(el, elIndex) {
      return GoalItem({
        key: _that.props.key + '.goalItem' + elIndex,
        name: el.name,
        completed: el.completed,
        number: _that.props.els.length,
        onGoalNameChange: _that.updateGoalText,
        rowName: _that.props.rowName,
        onChange: _that.props.onChange.bind(null, elIndex)
      });
    });
    return React.DOM.div.apply(
      this,
      [{className: 'row goal-row'}, null]
        .concat(goalItems));
  },
  componentDidMount: function() {
    var goals = $(this.getDOMNode()).find('.goalText');
    this.equalizeHeights(goals, 'outerHeight');
  },
  updateGoalText: function() {
    var goals = $(this.getDOMNode()).find('.goalText');
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
