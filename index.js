'use strict';

var path = require('path');
var extend = require('extend-shallow');
var isNegated = require('is-negated-glob');
var isAbsolute = require('is-absolute');

module.exports = function(glob, options) {
  // shallow clone options
  var opts = extend({}, options);
  // ensure cwd is absolute
  var cwd = path.resolve(opts.cwd ? opts.cwd : process.cwd());

  var rootDir = opts.root;
  // if `options.root` is defined, ensure it's absolute
  if (rootDir && !isAbsolute(opts.root)) {
    rootDir = path.resolve(rootDir);
  }

  // store last character before glob is modified
  var suffix = glob.slice(-1);

  // check to see if glob is negated (and not a leading negated-extglob)
  var ing = isNegated(glob);
  glob = ing.pattern;

  // make glob absolute
  if (rootDir && glob.charAt(0) === '/') {
    glob = path.join(rootDir, glob);
  } else if (!isAbsolute(glob)) {
    glob = path.resolve(cwd, glob);
  }

  // if glob had a trailing `/`, re-add it now in case it was removed
  if (suffix === '/' && glob.slice(-1) !== '/') {
    glob += '/';
  }

  // re-add leading `!` if it was removed
  return ing.negated ? '!' + glob : glob;
};
