// Generated by CoffeeScript 1.8.0
(function() {
  var Scope, Value, assert, _;

  Value = require("../values/value");

  assert = require("assert");

  _ = require("../utilities");

  module.exports = Scope = (function() {
    function Scope(parent) {
      this.parent = parent;
      assert(!this.parent || _.is(this.parent, Scope));
      this.rules = {};
      this.valueMacros = [];
      this.ruleMacros = [];
    }

    Scope.prototype.getGlobalScope = function() {
      return this.parent.getGlobalScope();
    };

    Scope.prototype.addRule = function(name, expressions) {
      if (this.rules[name]) {
        throw new Error("Duplicate entries for rule '" + name + "'");
      }
      return this.rules[name] = expressions;
    };

    Scope.prototype.addValueMacro = function(name, args, expressions) {
      var ValueMacro, macro;
      assert(_.isArray(expressions));
      ValueMacro = require("../macros/ValueMacro");
      macro = ValueMacro.createFromExpressions(name, args, this, expressions);
      return this.valueMacros.push(macro);
    };

    Scope.prototype.addRuleMacro = function(name, args) {
      var RuleMacro, macro;
      RuleMacro = require("../macros/RuleMacro");
      macro = new RuleMacro(this, name, args);
      this.ruleMacros.push(macro);
      return macro.scope;
    };

    Scope.prototype.getSourceScope = function(name) {
      var _ref;
      return this.sourceScopes[name] || ((_ref = this.parent) != null ? _ref.getSourceScope(name) : void 0);
    };

    Scope.prototype.getValueMacro = function(name, argValues) {
      var _ref;
      return _.find(this.valueMacros, function(valueMacro) {
        return valueMacro.matches(name, argValues);
      }) || ((_ref = this.parent) != null ? _ref.getValueMacro(name, argValues) : void 0);
    };

    Scope.prototype.getRuleMacro = function(name, argValues) {
      var _ref;
      return _.find(this.ruleMacros, function(ruleMacro) {
        return ruleMacro.matches(name, argValues);
      }) || ((_ref = this.parent) != null ? _ref.getRuleMacro(name, argValues) : void 0);
    };

    Scope.prototype.toMGLRules = function(options, rules) {
      var expressions, name, output, ruleMacro, values;
      output = {};
      for (name in rules) {
        expressions = rules[name];
        values = _.flatten(_.map(expressions, (function(_this) {
          return function(expression) {
            return expression.toValues(_this, _.extend({
              rule: name
            }, options));
          };
        })(this)));
        if ((ruleMacro = this.getRuleMacro(name, values))) {
          _.extend(output, ruleMacro.toMGLScope(values, options));
        } else {
          if (values.length !== 1) {
            throw new Error("Cannot apply " + values.length + " args to primitive rule '" + name + "'");
          }
          output[name] = values[0].toMGLValue(_.extend({
            rule: name
          }, options));
        }
      }
      return output;
    };

    return Scope;

  })();

}).call(this);
