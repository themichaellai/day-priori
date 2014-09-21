var GoalItem = React.createClass({displayName: 'Goal',
  render: function() {
    console.log(this.props);
    var numberOfCols = 12 / this.props.number;
    var colClass = 'col-xs-' + numberOfCols;
    return React.DOM.div({
      className: 'goal-container ' + colClass
    },
      null,
      React.DOM.div({
        className: 'goal ' + this.props.specialClass
      },
        this.props.name
      )
    )
  }
});

var GoalRow = React.createClass({displayName: 'GoalRow',
  render: function() {
    var _that = this;
    var goalItems = _.times(this.props.number, function(i) {
      return GoalItem(_.extend(_that.props, {name: 'a name ' + i}));
    });
    return React.DOM.div.apply(
      this,
      [{className: 'row goal-row'}, null]
        .concat(goalItems));
  }
});

var GoalContainer = React.createClass({displayName: 'GoalContainer',
  render: function() {
    return React.DOM.div({
      className: 'goal-container'
    },
      GoalRow({number: 1, specialClass: 'primary'}),
      GoalRow({number: 3, specialClass: 'secondary'})
    )
  }
});

React.renderComponent(
  GoalContainer(null),
  document.getElementById('content')
);
