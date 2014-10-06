var React = require('react');

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
        null,
        React.DOM.div({
          className: 'goalText'
        },
          this.renderText()
        ),
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

module.exports = GoalItem;
