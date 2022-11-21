'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var resolve = require('./');
var fixture;
var actual;

function unixify(filepath) {
  return filepath.replace(/\\/g, '/');
}

describe('resolve', function() {
  describe('posix', function() {
    it('should make a path absolute', function() {
      assert.equal(resolve('a'), unixify(path.resolve('a')));
    });

    it('should make a glob absolute', function() {
      assert.equal(resolve('a/*.js'), unixify(path.resolve('a/*.js')));
    });

    it('should retain trailing slashes', function() {
      actual = resolve('a/*/');
      assert.equal(actual, unixify(path.resolve('a/*')) + '/');
      assert.equal(actual.slice(-1), '/');
    });

    it('should retain trailing slashes with cwd', function() {
      fixture = 'fixtures/whatsgoingon/*/';
      actual = resolve(fixture, {cwd: __dirname});
      assert.equal(actual, unixify(path.resolve(fixture)) + '/');
      assert.equal(actual.slice(-1), '/');
    });

    it('should handle ./ at the beginnnig of a glob', function() {
      fixture = './fixtures/whatsgoingon/*/';
      actual = resolve(fixture, {cwd: __dirname});
      assert.equal(actual, unixify(path.resolve(fixture)) + '/');
    });

    it('should handle ../ at the beginnnig of a glob', function() {
      fixture = '../fixtures/whatsgoingon/*/';
      actual = resolve(fixture, {cwd: __dirname});
      assert.equal(actual, unixify(path.resolve(fixture)) + '/');
    });

    it('should handle multiple ../ at the beginnnig of a glob', function() {
      fixture = '../../fixtures/whatsgoingon/*/';
      actual = resolve(fixture, {cwd: __dirname});
      assert.equal(actual, unixify(path.resolve(fixture)) + '/');
    });

    it('should make a negative glob absolute', function() {
      actual = resolve('!a/*.js');
      assert.equal(actual, '!' + unixify(path.resolve('a/*.js')));
    });

    it('should make a negative glob (starting with `./`) absolute', function() {
      actual = resolve('!./a/*.js');
      assert.equal(actual, '!' + unixify(path.resolve('a/*.js')));
    });

    it('should make a negative glob (just `./`) absolute', function() {
      actual = resolve('!./');
      assert.equal(actual, '!' + unixify(path.resolve('.')) + '/');
    });

    it('should make a negative glob (just `.`) absolute', function() {
      actual = resolve('!.');
      assert.equal(actual, '!' + unixify(path.resolve('.')));
    });

    it('should make a negative glob (starting with ../) absolute', function() {
      actual = resolve('!../fixtures/whatsgoingon/*/');
      assert.equal(actual, '!' + unixify(path.resolve('../fixtures/whatsgoingon/*/')) + '/');
    });

    it('should make a negative glob (starting with multiple ../) absolute', function() {
      actual = resolve('!../../fixtures/whatsgoingon/*/');
      assert.equal(actual, '!' + unixify(path.resolve('../../fixtures/whatsgoingon/*/')) + '/');
    });

    it('should make a negative extglob absolute', function() {
      actual = resolve('!(foo)');
      assert.equal(actual, unixify(path.resolve('!(foo)')));
    });

    it('should make an escaped negative extglob absolute', function() {
      actual = resolve('\\!(foo)');
      assert.equal(actual, unixify(path.resolve('.')) + '/\\!(foo)');
    });

    it('should make a glob absolute from a cwd', function() {
      actual = resolve('a/*.js', {cwd: 'foo'});
      assert.equal(actual, unixify(path.resolve('foo/a/*.js')));
    });

    it('should escape glob patterns in an absolute cwd', function() {
      actual = resolve('a/*.js', {cwd: '/(foo)/[bar]/{baz}/*/**/?/!'});
      var expected = unixify(path.resolve('/(foo)/[bar]/{baz}/*/**/?/!/a/*.js'))
        .replace('/(foo)/[bar]/{baz}/*/**/?/!', '/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!');
      assert.equal(actual, expected);
    });

    it('should escape glob patterns in a relative cwd', function() {
      actual = resolve('a/*.js', {cwd: '(foo)/[bar]/{baz}/*/**/?/!'});
      var expected = unixify(path.resolve('(foo)/[bar]/{baz}/*/**/?/!/a/*.js'))
        .replace('(foo)/[bar]/{baz}/*/**/?/!', '\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!');
      assert.equal(actual, expected);
    });

    it('avoids double escaping in cwd', function() {
      actual = resolve('a/*.js', {cwd: '/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!'});
      var expected = unixify(path.resolve('/(foo)/[bar]/{baz}/*/**/?/!/a/*.js'))
        .replace('/(foo)/[bar]/{baz}/*/**/?/!', '/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!');
      assert.equal(actual, expected);
    });

    it('works with multiple characters in succession in cwd', function() {
      actual = resolve('a/*.js', {cwd: '/((foo))/[[bar]]/{{baz}}'});
      var expected = unixify(path.resolve('/((foo))/[[bar]]/{{baz}}/a/*.js'))
        .replace('/((foo))/[[bar]]/{{baz}}', '/\\(\\(foo\\)\\)/\\[\\[bar\\]\\]/\\{\\{baz\\}\\}');
      assert.equal(actual, expected);
    });

    it('should make a negative glob absolute from a cwd', function() {
      actual = resolve('!a/*.js', {cwd: 'foo'});
      assert.equal(actual, '!' + unixify(path.resolve('foo/a/*.js')));
    });

    it('should make a glob absolute from a root path', function() {
      actual = resolve('/a/*.js', {root: 'foo'});
      assert.equal(actual, unixify(path.resolve('foo/a/*.js')));
    });

    it('should make a glob absolute from a root slash', function() {
      actual = resolve('/a/*.js', {root: '/'});
      assert.equal(actual, unixify(path.resolve('/a/*.js')));
    });

    it('should escape glob patterns in an absolute root', function() {
      actual = resolve('/a/*.js', {root: '/(foo)/[bar]/{baz}/*/**/?/!'});
      var expected = unixify(path.resolve('/(foo)/[bar]/{baz}/*/**/?/!/a/*.js'))
        .replace('/(foo)/[bar]/{baz}/*/**/?/!', '/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!');
      assert.equal(actual, expected);
    });

    it('should escape glob patterns in a relative root', function() {
      actual = resolve('/a/*.js', {root: '(foo)/[bar]/{baz}/*/**/?/!'});
      var expected = unixify(path.resolve('(foo)/[bar]/{baz}/*/**/?/!/a/*.js'))
        .replace('(foo)/[bar]/{baz}/*/**/?/!', '\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!');
      assert.equal(actual, expected);
    });

    it('avoids double escaping in root', function() {
      actual = resolve('/a/*.js', {root: '/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!'});
      var expected = unixify(path.resolve('/(foo)/[bar]/{baz}/*/**/?/!/a/*.js'))
        .replace('/(foo)/[bar]/{baz}/*/**/?/!', '/\\(foo\\)/\\[bar\\]/\\{baz\\}/\\*/\\*\\*/\\?/\\!');
      assert.equal(actual, expected);
    });

    it('works with multiple characters in succession in root', function() {
      actual = resolve('/a/*.js', {root: '/((foo))/[[bar]]/{{baz}}'});
      var expected = unixify(path.resolve('/((foo))/[[bar]]/{{baz}}/a/*.js'))
        .replace('/((foo))/[[bar]]/{{baz}}', '/\\(\\(foo\\)\\)/\\[\\[bar\\]\\]/\\{\\{baz\\}\\}');
      assert.equal(actual, expected);
    });

    it('should make a glob absolute from a negative root path', function() {
      actual = resolve('!/a/*.js', {root: 'foo'});
      assert.equal(actual, '!' + unixify(path.resolve('foo/a/*.js')));
    });

    it('should make a negative glob absolute from a negative root path', function() {
      actual = resolve('!/a/*.js', {root: '/'});
      assert.equal(actual, '!' + unixify(path.resolve('/a/*.js')));
    });
  });

  describe('windows', function() {
    it('should make an escaped negative extglob absolute', function() {
      actual = resolve('foo/bar\\!(baz)');
      assert.equal(actual, unixify(path.resolve('foo/bar')) + '\\!(baz)');
    });

    it('should make a glob absolute from a root path', function() {
      actual = resolve('/a/*.js', {root: 'foo\\bar\\baz'});
      assert.equal(actual, unixify(path.resolve('foo/bar/baz/a/*.js')));
    });

    it('should make a glob absolute from a root slash', function() {
      actual = resolve('/a/*.js', {root: '\\'});
      assert.equal(actual, unixify(path.resolve('/a/*.js')));
    });
  });
});
