{ literal } = require("../expressions/LiteralExpression")
_ = require "../utilities"

module.exports = class RuleMacro

  # TODO allow for subclasses, sublayers?

  constructor: (parentScope, @name, @argNames, @body = null) ->
    ClassScope = require("../scopes/ClassScope")
    @scope = new ClassScope(parentScope)

  toMGLScope: (argValues, options) ->
    if argValues.length != @argNames.length
      throw "Expecting #{@argNames.length} arguments for macro '#{@name}', got #{argValues.length}"

    args = _.objectZip(@argNames, argValues.map(literal))
    _.extend(@scope.valueMacros, args)
    _.extend(@scope.evaluateRules(), @body?.apply({}, argValues))