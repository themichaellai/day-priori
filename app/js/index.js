var React = require('react');
var GoalContainer = require('./goal-container');

window.React = React;

var container = GoalContainer(null);
React.renderComponent(
  container,
  document.getElementById('content')
);
