var React = require('react');
var GoalContainer = require('./goal-container');

var container = GoalContainer(null);
React.renderComponent(
  container,
  document.getElementById('content')
);
