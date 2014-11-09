{parse} = require("../source/parser")
assert = require("assert")
_ = require("../source/utilities")

describe "whitespace", ->
  zero = test: {paint: { }}
  one = test: {paint: { foo: "bar" }}
  two = test: {paint: { foo: "bar"; baz: "qux" }}

  it "should allow for an empty scope", ->
    stylesheet = parse '#test {}'
    assert.deepEqual stylesheet.layers, zero

  it "should allow for a scope on one line with one statement", ->
    stylesheet = parse '#test { foo: "bar" }'
    assert.deepEqual stylesheet.layers, one

  it "should allow for a scope on one line with multiple statements", ->
    stylesheet = parse '#test { foo: "bar"; baz: "qux" }'
    assert.deepEqual stylesheet.layers, two

  it "should allow for a scope on one line with a trailing semicolon", ->
    stylesheet = parse '#test { foo: "bar"; }'
    assert.deepEqual stylesheet.layers, one

  it "should allow for a scope on multiple lines with one statement", ->
    stylesheet = parse '''
      #test {
        foo: "bar"
      }
    '''
    assert.deepEqual stylesheet.layers, one

  it "should allow for a scope with multiple statements seperated by newlines", ->
    stylesheet = parse '''
      #test {
        foo: "bar"
        baz: "qux"
      }
    '''
    assert.deepEqual stylesheet.layers, two

  it "should allow for a scope with multiple statements seperated by semicolons", ->
    stylesheet = parse '''
      #test {
        foo: "bar";
        baz: "qux"
      }
    '''
    assert.deepEqual stylesheet.layers, two

  it "should allow for a scope with a trailing semicolon", ->
    stylesheet = parse '''
      #test {
        foo: "bar"
      }
    '''
    assert.deepEqual stylesheet.layers, one

  it "should allow for a scope with empty lines", ->
    stylesheet = parse '''
      #test {

        foo: "bar"

      }
    '''
    assert.deepEqual stylesheet.layers, one

  # it "should allow for multiple scopes on the same line", ->
  #   stylesheet = parse "#foo {} #bar {}"
  #   assert.deepEqual _.keys(stylesheet.layers), ["foo", "bar"]
