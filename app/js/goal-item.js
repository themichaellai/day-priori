var React = require('react');
var util = require('./util');

var GoalItem = React.createClass({displayName: 'Goal',
  render: function() {
    var numberOfCols = 12 / this.props.number;
    var colClass = 'col-xs-' + numberOfCols;
    var completedClass = this.props.completed ? 'completed' : '';
    var optional = [
      React.DOM.li({
          className: 'btn btn-default complete action',
          onClick: this.toggleCompleted
        },
        (this.props.completed ? 'uncomplete' : 'complete')
      ),
    ];
    return React.DOM.div({
        className: 'goal-content-container ' + colClass + ' ' + completedClass
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
          util.eitherOr(this.props.name.length > 0 && this.state.editing,
            React.DOM.li({
                className: 'btn btn-default clear action',
                onClick: this.reset
              },
              'clear'
            )
          ),
          React.DOM.li({
              className: 'btn btn-default edit action',
              onClick: this.toggleName,
            },
            (this.state.editing? 'done' : 'edit')
          ),
          util.eitherOr(this.props.name.length > 0 && !this.state.editing,
            React.DOM.li({
                className: 'btn btn-default complete action',
                onClick: this.toggleCompleted
              },
              (this.props.completed ? 'uncomplete' : 'complete')
            )
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
           onSubmit: this.toggleName
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
  reset: function(e) {
    this.props.onChange('name', '');
  },
  toggleCompleted: function() {
    this.props.onChange('completed', !this.props.completed);
  }
});

module.exports = GoalItem;
