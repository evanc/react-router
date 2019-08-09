"use strict";

var ReactPropTypes = require("prop-types");
var Route = require("./Route");

var PropTypes = Object.assign({}, ReactPropTypes, {
  /**
   * Indicates that a prop should be falsy.
   */
  falsy: function falsy(props, propName, componentName) {
    if (props[propName]) return new Error("<" + componentName + "> should not have a \"" + propName + "\" prop");
  },

  /**
   * Indicates that a prop should be a Route object.
   */
  route: ReactPropTypes.instanceOf(Route),

  /**
   * Indicates that a prop should be a Router object.
   */
  //router: ReactPropTypes.instanceOf(Router) // TODO
  router: ReactPropTypes.func
});

module.exports = PropTypes;