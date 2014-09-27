var GoalItem = React.createClass({displayName: 'Goal',
  render: function() {
    var numberOfCols = 12 / this.props.number;
    var colClass = 'col-xs-' + numberOfCols;
    var completedClass = this.props.completed ? 'completed' : '';
    return React.DOM.div({
        className: 'goal-container ' + colClass + ' ' + completedClass
      },
      null,
      React.DOM.div({
          className: 'goal ' + this.props.rowName,
        },
        this.renderText(),
        React.DOM.ul({
            className: 'actions'
          },
          null,
          React.DOM.li({
              className: 'complete action', onClick: this.toggleCompleted
            },
            (this.props.completed ? 'uncomplete' : 'complete')
          ),
          React.DOM.li({
              className: 'edit action',
              onClick: this.toggleName,
            },
            'edit'
          )
        )
      )
    );
  },
  getInitialState: function() {
    return {
      editing: false
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.editing !== this.state.editing ||
      nextProps.name !== this.props.name ||
      nextProps.completed !== this.props.completed ||
      nextProps.id !== this.props.id;
  },
  componentDidUpdate: function(prevProps, prevState) {
    this.props.onGoalNameChange();
    if (this.state.editing) {
      this.refs.goalItemInput.getDOMNode().focus();
    }
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
           value: this.props.name,
           onChange: this.handleChange,
           onSubmit: this.toggleName,
           onBlur: this.toggleName
         },
           null
         )
      );
    } else {
      var className = this.props.name === '' ? 'empty-goal' : '';
      return React.DOM.div({
        ref: 'goalItem',
        className: className
      },
        this.props.name || 'dust'
      );
    }
  },
  handleChange: function() {
    this.props.onChange('name', this.refs.goalItemInput.getDOMNode().value);
  },
  toggleName: function(e) {
    if (e) e.preventDefault();
    this.setState({editing: !this.state.editing});
  },
  toggleCompleted: function() {
    this.props.onChange('completed', !this.props.completed);
  }
});

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
    var goals = $(this.getDOMNode()).find('.goal');
    this.equalizeHeights(goals, Math.max.apply(
      null, _.map(goals, function(g) {
        return $(g).outerHeight(true);
      })));
  },
  updateGoalText: function() {
    this.equalizeHeights($(this.getDOMNode()).find('.goal'));
  },
  equalizeHeights: function(goals, maxHeightIn) {
    //console.log('equalizeHeights');
    var maxHeight = maxHeightIn || Math.max.apply(
      null, _.map(goals, function(g) {
        return $(g).height();
      }));
    //console.log('maxHeight', maxHeight);
    _.each(goals, function(g) {
      //console.log('setting to', maxHeight);
      $(g).height(maxHeight);
    });
  }
});

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

var container = GoalContainer(null);
React.renderComponent(
  container,
  document.getElementById('content')
);
