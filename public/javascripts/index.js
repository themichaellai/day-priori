var GoalItem = React.createClass({displayName: 'Goal',
  render: function() {
    var numberOfCols = 12 / this.props.number;
    var colClass = 'col-xs-' + numberOfCols;
    return React.DOM.div({
        className: 'goal-container ' + colClass
      },
      null,
      React.DOM.div({
          className: 'goal ' + this.props.specialClass,
        },
        this.renderText()
      )
    );
  },
  getInitialState: function() {
    return {
      name: this.props.name,
      editing: false
    };
  },
  componentDidMount: function() {
    console.log('goal item did mount');
  },
  componentDidUpdate: function() {
    console.log('goal componentDidUpdate');
    this.props.onGoalNameChange();
  },
  renderText: function() {
    if (this.state.editing) {
      return React.DOM.form({
          onSubmit: this.toggleName
        },
        null,
        React.DOM.input({
           ref: 'goalItemInput',
           type: 'text',
           value: this.state.name,
           onChange: this.handleChange,
           onSubmit: this.toggleName,
           onBlur: this.toggleName
         },
           null
         )
      );
    } else {
      return React.DOM.div({
        ref: 'goalItem',
        onClick: this.toggleName
      },
        this.state.name
      );
    }
  },
  handleChange: function() {
    this.setState({name:this.refs.goalItemInput.getDOMNode().value});
  },
  toggleName: function(e) {
    if (e) e.preventDefault();
    this.setState({editing: !this.state.editing});
  }
});

var GoalRow = React.createClass({displayName: 'GoalRow',
  render: function() {
    var _that = this;
    this.goalItems = _.times(this.props.number, function(i) {
      return GoalItem(_.extend(_that.props, {
        name: 'a name ' + i,
        onGoalNameChange: _that.updateGoalText
      }));
    });
    return React.DOM.div.apply(
      this,
      [{className: 'row goal-row'}, null]
        .concat(this.goalItems));
  },
  componentDidUpdate: function(prevProps, prevState) {
    console.log('goal row did update');
  },
  componentDidMount: function() {
    console.log('goal row did mount');
    var goals = $(this.getDOMNode()).find('.goal')
    this.equalizeHeights(goals, Math.max.apply(
      null, _.map(goals, function(g) {
        return $(g).outerHeight(true);
      })));
  },
  updateGoalText: function() {
    this.equalizeHeights($(this.getDOMNode()).find('.goal'));
  },
  equalizeHeights: function(goals, maxHeightIn) {
    console.log('equalizeHeights');
    var maxHeight = maxHeightIn || Math.max.apply(
      null, _.map(goals, function(g) {
        return $(g).height();
      }));
    console.log('maxHeight', maxHeight);
    _.each(goals, function(g) {
      console.log('setting to', maxHeight);
      $(g).height(maxHeight);
    });
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
