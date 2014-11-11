// Generated by CoffeeScript 1.8.0
(function() {
  var ClassScope, Scope, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Scope = require("./Scope");

  _ = require("../utilities");

  module.exports = ClassScope = (function(_super) {
    __extends(ClassScope, _super);

    function ClassScope() {
      return ClassScope.__super__.constructor.apply(this, arguments);
    }

    ClassScope.prototype.toMGLClassScope = function(options) {
      options = _.extend({
        scope: "class"
      }, options);
      return this.toMGLRules(options, this.rules);
    };

    return ClassScope;

  })(Scope);

}).call(this);
