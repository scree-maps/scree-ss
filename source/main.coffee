if module.exports
  module.exports = require("../compiled/parser")
else if window
  window.ScreeSS = require("../compiled/parser")