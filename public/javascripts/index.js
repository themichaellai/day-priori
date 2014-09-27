var GoalItem = React.createClass({displayName: 'Goal',
  render: function() {
    var numberOfCols = 12 / this.props.number;
    var colClass = 'col-xs-' + numberOfCols;
    return React.DOM.div({
        className: 'goal-container ' + colClass
      },
      null,
      React.DOM.div({
          className: 'goal ' + this.props.rowName,
        },
        this.renderText()
      )
    );
  },
  getInitialState: function() {
    return {
      //name: this.props.name,
      editing: false
    };
  },
  componentDidMount: function() {
    //console.log('goal item did mount');
  },
  componentDidUpdate: function() {
    //console.log('goal componentDidUpdate');
    this.props.onGoalNameChange();
    this.refs.goalItemInput.getDOMNode().focus();
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
      var className = this.props.name == '' ? 'empty-goal' : '';
      return React.DOM.div({
        ref: 'goalItem',
        onClick: this.toggleName,
        className: className
      },
        this.props.name || 'edit'
      );
    }
  },
  handleChange: function() {
    this.props.onChange(this.refs.goalItemInput.getDOMNode().value);
  },
  toggleName: function(e) {
    if (e) e.preventDefault();
    this.setState({editing: !this.state.editing});
  }
});

var GoalRow = React.createClass({displayName: 'GoalRow',
  render: function() {
    var _that = this;
    var goalItems = this.props.els.map(function(elName, elIndex) {
      return GoalItem({
        name: elName,
        number: _that.props.els.length,
        onGoalNameChange: _that.updateGoalText,
        rowName: _that.props.rowName,
        onChange: _that.props.onChange.bind(null, elIndex)
      })
    });
    return React.DOM.div.apply(
      this,
      [{className: 'row goal-row'}, null]
        .concat(goalItems));
  },
  componentDidUpdate: function(prevProps, prevState) {
    //console.log('goal row did update');
  },
  componentDidMount: function() {
    //console.log('goal row did mount');
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

var GoalContainer = React.createClass({displayName: 'GoalContainer',
  getInitialState: function() {
    return {
      rows: [
        {
          name: 'primary',
          els: _.times(1, function() { return ''})
        },
        {
          name: 'secondary',
          els: _.times(3, function() { return ''})
        }
      ]
    }
  },
  render: function() {
    var _that = this;
    var rows = this.state.rows.map(function(row, rowwIndex) {
      return GoalRow({
        els: row.els,
        rowName: row.name,
        onChange: _that.onChange.bind(null, rowwIndex)
      });
    });
    return React.DOM.div.apply(this, [{
      className: 'goal-container',
      onClick: this.serialize
    }, null].concat(rows));
  },
  onChange: function(rowIndex, elIndex, newValue) {
    console.log('changing', rowIndex, elIndex, 'to', newValue);
    var newRows = _.clone(this.state.rows);
    newRows[rowIndex].els[elIndex] = newValue;
    this.setState({rows: newRows});
  },
  serialize: function() {
    //console.log(this.refs);
    //console.log(this.refs.goalRow.getDOMNode());
  }
});

var container = GoalContainer(null);
React.renderComponent(
  container,
  document.getElementById('content')
);
