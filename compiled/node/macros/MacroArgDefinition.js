// Generated by CoffeeScript 1.8.0
(function() {
  var MacroArgDefinition, assert, _;

  assert = require('assert');

  _ = require('../utilities');

  module.exports = MacroArgDefinition = (function() {
    function MacroArgDefinition(definitions, scope) {
      var definition, index, _i, _len, _ref;
      this.definitions = definitions;
      this.scope = scope;
      if (this.definitions.length > 0) {
        assert(this.scope !== null);
      }
      this.namedArgs = {};
      _ref = this.definitions;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        definition = _ref[index];
        definition.index = index;
        if (definition.name) {
          this.namedArgs[definition.name] = definition;
        }
      }
      this.length = this.definitions.length;
    }

    return MacroArgDefinition;

  })();

  MacroArgDefinition.ZERO = new MacroArgDefinition([], null);

}).call(this);
