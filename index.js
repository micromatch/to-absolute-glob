'use strict';

var path = require('path');
var extend = require('extend-shallow');
var isNegated = require('is-negated-glob');

module.exports = function(glob, options) {
  var opts = extend({}, options);
  opts.cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();

  // store last character before glob is modified
  var suffix = glob.slice(-1);

  var ing = isNegated(glob);
  glob = ing.pattern;

  if (opts.root && glob.charAt(0) === '/') {
    glob = path.join(path.resolve(opts.root), '.' + glob);
  } else {
    glob = path.resolve(opts.cwd, glob);
  }

  if (suffix === '/' && glob.slice(-1) !== '/') {
    glob += '/';
  }

  return ing.negated ? '!' + glob : glob;
};
