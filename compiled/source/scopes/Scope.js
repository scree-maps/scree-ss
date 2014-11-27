var Value = require("../values/value");
var Values = require("../Values");
var ValuesDefinition = require('../ValuesDefinition');
var assert = require("assert");
var LiteralExpression = require('../expressions/LiteralExpression');
var Stack = require('../Stack');
var _ = require("../utilities");
var Globals = require('../globals');
var Scope = (function () {
    function Scope(parent) {
        this.parent = parent;
        this.properties = {};
        this.valueMacros = [];
        this.propertyMacros = [];
        this.loops = [];
        this.classScopes = {};
        this.layerScopes = {};
        this.sources = {};
        this.isGlobal = !this.parent;
        if (this.parent == null) {
            for (var name in Globals.valueMacros) {
                var fn = Globals.valueMacros[name];
                this.addValueMacro(name, null, fn);
            }
            for (var name in Globals.propertyMacros) {
                var fn = Globals.propertyMacros[name];
                this.addPropertyMacro(name, null, fn);
            }
        }
    }
    Scope.prototype.addSource = function (source) {
        if (this.isGlobal) {
            var hash = _.hash(JSON.stringify(source)).toString();
            this.sources[hash] = source;
            return hash;
        }
        else {
            return this.parent.addSource(source);
        }
    };
    Scope.prototype.getGlobalScope = function () {
        return this.isGlobal ? this : this.parent.getGlobalScope();
    };
    Scope.prototype.getSource = function (name) {
        return this.isGlobal ? this.getSource(name) : this.parent.getSource(name);
    };
    Scope.prototype.addProperty = function (name, expressions) {
        if (this.properties[name]) {
            throw new Error("Duplicate entries for property " + name);
        }
        return this.properties[name] = expressions;
    };
    Scope.prototype.addClassScope = function (name) {
        if (!this.classScopes[name]) {
            this.classScopes[name] = new Scope(this);
        }
        return this.classScopes[name];
    };
    Scope.prototype.addLayerScope = function (name, scope) {
        if (this.layerScopes[name]) {
            throw new Error("Duplicate entries for layer scope " + name);
        }
        var _LayerScope = require('./LayerScope');
        return this.layerScopes[name] = new _LayerScope(name, this);
    };
    Scope.prototype.addLiteralValueMacros = function (values) {
        for (name in values) {
            var value = values[name];
            this.addValueMacro(name, ValuesDefinition.ZERO, [new LiteralExpression(value)]);
        }
    };
    Scope.prototype.addValueMacro = function (name, argDefinition, body) {
        var ValueMacro_ = require("../macros/ValueMacro");
        var macro;
        if (_.isArray(body)) {
            macro = new ValueMacro_(name, argDefinition, this, body);
        }
        else if (_.isFunction(body)) {
            macro = new ValueMacro_(name, argDefinition, this, body);
        }
        else {
            assert(false);
        }
        return this.valueMacros.unshift(macro);
    };
    Scope.prototype.addPropertyMacro = function (name, argDefinition, body) {
        var PropertyMacro = require("../macros/PropertyMacro");
        var macro = new PropertyMacro(this, name, argDefinition, body);
        this.propertyMacros.unshift(macro);
        return macro.scope;
    };
    Scope.prototype.addLoop = function (valueIdentifier, collection) {
        var loop = {
            valueIdentifier: valueIdentifier,
            collection: collection,
            scope: new Scope(this)
        };
        this.loops.push(loop);
        return loop.scope;
    };
    Scope.prototype.getValueMacro = function (name, argValues, stack) {
        for (var i in this.valueMacros) {
            var macro = this.valueMacros[i];
            if (macro.matches(name, argValues) && !_.contains(stack.valueMacro, macro)) {
                return macro;
            }
        }
        if (this.isGlobal && argValues.length == 0) {
            var ValueMacro_ = require("../macros/ValueMacro");
            return new ValueMacro_(name, ValuesDefinition.ZERO, this, [new LiteralExpression(name)]);
        }
        else if (this.parent) {
            return this.parent.getValueMacro(name, argValues, stack);
        }
        else {
            return null;
        }
    };
    Scope.prototype.getPropertyMacro = function (name, argValues, stack) {
        for (var i in this.propertyMacros) {
            var macro = this.propertyMacros[i];
            if (macro.matches(name, argValues) && !_.contains(stack.propertyMacro, macro)) {
                return macro;
            }
        }
        // TODO create super parent class that returns null for everything to
        // avoid this.
        return this.parent ? this.parent.getPropertyMacro(name, argValues, stack) : null;
    };
    Scope.prototype.evaluateProperties = function (stack, properties) {
        var output = {};
        for (var name in properties) {
            var expressions = properties[name];
            // TODO refactor Values constructor to accept this
            var argValues = new Values(_.map(expressions, function (expression) {
                return { expression: expression };
            }), this, stack);
            var propertyMacro;
            if (propertyMacro = this.getPropertyMacro(name, argValues, stack)) {
                stack.propertyMacro.push(propertyMacro);
                _.extend(output, propertyMacro.evaluate(argValues, stack));
                stack.propertyMacro.pop();
            }
            else {
                if (argValues.length != 1 || argValues.positional.length != 1) {
                    throw new Error("Cannot apply " + argValues.length + " args to primitive property " + name);
                }
                output[name] = Value.evaluate(argValues.positional[0], stack);
            }
        }
        return output;
    };
    Scope.prototype.evaluateGlobalScope = function (stack) {
        if (stack === void 0) { stack = new Stack(); }
        stack.scope.push(this);
        var layers = _.map(this.layerScopes, function (layer) {
            return layer.evaluateLayerScope(stack);
        });
        var properties = this.evaluateProperties(stack, this.properties);
        var sources = _.objectMapValues(this.sources, function (source, name) {
            return _.objectMapValues(source, function (value, key) {
                return Value.evaluate(value, stack);
            });
        });
        var transition = {
            duration: properties["transition-delay"],
            delay: properties["transition-duration"]
        };
        delete properties["transition-delay"];
        delete properties["transition-duration"];
        stack.scope.pop();
        return _.extend(properties, {
            version: 6,
            layers: layers,
            sources: sources,
            transition: transition
        });
    };
    Scope.prototype.evaluateClassScope = function (stack) {
        // TODO assert there are no child layers or classes
        stack.scope.push(this);
        this.evaluateProperties(stack, this.properties);
        stack.scope.pop();
    };
    return Scope;
})();
module.exports = Scope;
//# sourceMappingURL=Scope.js.map