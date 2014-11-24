import Value = require('../values/Value')

class Expression {

  toValue(scope, options):any {
    var values = this.toValues(scope, options);

    if (values.length > 1) {
      console.log(values);
      throw new Error("Expected 1 value but found " + values.length + " values");
    }

    return values[0];
  }

  // TODO use union types on return type
  toValues(scope, options):any[] {
    throw new Error("Abstract method");
  }

  evaluate(scope, options):any[] {
    return Value.evaluate(this.toValue(scope, options), options);
  }

  evaluateFilter(scope, options):any[] {
    throw new Error("Abstract method");
  }

}

export = Expression