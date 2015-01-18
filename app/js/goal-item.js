var React = require('react');
var DOM = React.DOM;
var util = require('./util');
var eitherOr = util.eitherOr;
var classList = util.classList;

var GoalItem = React.createClass({displayName: 'Goal',
  render: function() {
    var numberOfCols = 12 / this.props.number;
    var colClass = 'col-xs-' + numberOfCols;
    var completedClass = this.props.completed ? 'completed' : '';
    var optional = [
      DOM.li({
          className: 'btn btn-default complete action',
          onClick: this.toggleCompleted
        },
        (this.props.completed ? 'uncomplete' : 'complete')
      ),
    ];
    return DOM.div({
        className: classList(
          'goal-content-container',
          colClass,
          completedClass
        ),
        onClick: eitherOr(this.props.swappingItem, this.swap)
      },
      null,
      DOM.div({
        className: classList(
          'goal',
          this.props.rowName,
          util.eitherOr(this.beingSwapped(), 'being-swapped'),
          util.eitherOr(
            !this.beingSwapped() && this.props.swappingItem,
            'swap-in-progress')
        )
      },
        null,
        DOM.div({
          className: 'goal-text'
        },
          this.renderText()
        ),
        this.actionRow()
      )
    );
  },
  getInitialState: function() {
    return {
      editing: false
    };
  },
  componentDidUpdate: function(prevProps, prevState) {
    console.log('componentDidUpdate');
    this.props.onGoalNameChange();
    if (this.state.editing) {
      this.refs.goalItemInput.getDOMNode().focus();
    }
  },
  renderText: function() {
    if (this.state.editing) {
      return DOM.form({
          onSubmit: this.toggleName
        },
        null,
        DOM.input({
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
      return DOM.div({
        ref: 'goalItem',
        className: className
      },
        this.props.name || 'dust'
      );
    }
  },
  handleChange: function() {
    this.props.onChange({name: this.refs.goalItemInput.getDOMNode().value});
  },
  toggleName: function(e) {
    if (e) e.preventDefault();
    this.setState({editing: !this.state.editing});
  },
  reset: function(e) {
    this.props.onChange({name: '', completed: false});
  },
  startSwap: function() {
    this.setState({editing: false});
    this.props.startSwap({
      rowIndex: this.props.rowIndex,
      elIndex: this.props.elIndex
    });
  },
  swap: function() {
    this.props.swap(this.props.rowIndex, this.props.elIndex);
  },
  beingSwapped: function() {
    if ((si = this.props.swappingItem) !== null) {
      return si.rowIndex === this.props.rowIndex &&
          si.elIndex === this.props.elIndex;
    } else {
      return false;
    }
  },
  toggleCompleted: function() {
    this.props.onChange({completed: !this.props.completed});
  },
  actionRow: function() {
    return eitherOr(this.props.swappingItem === null,
      eitherOr(!this.props.editingRows,
        DOM.ul({
          className: 'actions'
        },
          null,
          eitherOr(this.props.name.length > 0 && this.state.editing,
            [
              DOM.li({
                className: 'btn btn-default swap action',
                onClick: this.startSwap
              },
                'swap'
              ),
              DOM.li({
                  className: 'btn btn-default clear action',
                  onClick: this.reset
                },
                'clear'
              )
            ]
          ),
          DOM.li({
              className: 'btn btn-default edit action',
              onClick: this.toggleName,
            },
            (this.state.editing? 'done' : 'edit')
          ),
          eitherOr(this.props.name.length > 0 && !this.state.editing,
            DOM.li({
                className: 'btn btn-default complete action',
                onClick: this.toggleCompleted
              },
              (this.props.completed ? 'uncomplete' : 'complete')
            )
          )
        )
      )
    );
  }
});

module.exports = GoalItem;
