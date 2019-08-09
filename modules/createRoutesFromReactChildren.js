/* jshint -W084 */
var React = require("react");
var PropTypes = require("prop-types");
var warning = require("./warning");
var DefaultRoute = require("./components/DefaultRoute");
var NotFoundRoute = require("./components/NotFoundRoute");
var Redirect = require("./components/Redirect");
var Route = require("./Route");

function checkPropTypes(componentName, propTypes, props) {
  componentName = componentName || "UnknownComponent";

  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error = PropTypes.checkPropTypes(
        propTypes,
        props,
        propName,
        componentName
      );

      if (error instanceof Error) warning(false, error.message);
    }
  }
}

function createRouteOptions(props) {
  var options = Object.assign({}, props);
  var handler = options.handler;

  if (handler) {
    options.onEnter = handler.willTransitionTo;
    options.onLeave = handler.willTransitionFrom;
  }

  return options;
}

function createRouteFromReactElement(element) {
  if (!React.isValidElement(element)) return;

  var type = element.type;
  var props = Object.assign({}, type.defaultProps, element.props);

  if (type.propTypes) checkPropTypes(type.displayName, type.propTypes, props);

  if (type === DefaultRoute)
    return Route.createDefaultRoute(createRouteOptions(props));

  if (type === NotFoundRoute)
    return Route.createNotFoundRoute(createRouteOptions(props));

  if (type === Redirect) return Route.createRedirect(createRouteOptions(props));

  return Route.createRoute(createRouteOptions(props), function() {
    if (props.children) createRoutesFromReactChildren(props.children);
  });
}

/**
 * Creates and returns an array of routes created from the given
 * ReactChildren, all of which should be one of <Route>, <DefaultRoute>,
 * <NotFoundRoute>, or <Redirect>, e.g.:
 *
 *   var { createRoutesFromReactChildren, Route, Redirect } = require('react-router');
 *
 *   var routes = createRoutesFromReactChildren(
 *     <Route path="/" handler={App}>
 *       <Route name="user" path="/user/:userId" handler={User}>
 *         <Route name="task" path="tasks/:taskId" handler={Task}/>
 *         <Redirect from="todos/:taskId" to="task"/>
 *       </Route>
 *     </Route>
 *   );
 */
function createRoutesFromReactChildren(children) {
  var routes = [];

  React.Children.forEach(children, function(child) {
    if ((child = createRouteFromReactElement(child))) routes.push(child);
  });

  return routes;
}

module.exports = createRoutesFromReactChildren;
