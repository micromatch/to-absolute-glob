'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var resolve = require('./');
var sep = path.sep;
var fixture;
var actual;

describe('resolve', function () {
  describe('posix', function () {
    it('should make a path absolute', function () {
      assert.equal(resolve('a'), path.resolve('a'));
    });

    it('should make a glob absolute', function () {
      assert.equal(resolve('a/*.js'), path.resolve('a/*.js'));
    });

    it('should retain trailing slashes', function () {
      actual = resolve('a/*/');
      assert.equal(actual, path.resolve('a/*') + '/');
      assert.equal(actual.slice(-1), '/');
    });

    it('should retain trailing slashes with cwd', function () {
      fixture = './fixtures/whatsgoingon/*/';
      actual = resolve(fixture, {cwd: __dirname});
      assert.equal(actual, path.resolve(fixture) + '/');
      assert.equal(actual.slice(-1), '/');
    });

    it('should make a negative glob absolute', function () {
      actual = resolve('!a/*.js');
      assert.equal(actual, '!' + path.resolve('a/*.js'));
    });

    it('should make a negative extglob absolute', function () {
      actual = resolve('!(foo)');
      assert.equal(actual, path.resolve('!(foo)'));
    });

    it('should make an escaped negative extglob absolute', function () {
      actual = resolve('\\!(foo)');
      assert.equal(actual, path.resolve('\\!(foo)'));
    });

    it('should make a glob absolute from a cwd', function () {
      actual = resolve('a/*.js', {cwd: 'foo'});
      assert.equal(actual, path.resolve('foo/a/*.js'));
    });

    it('should make a negative glob absolute from a cwd', function () {
      actual = resolve('!a/*.js', {cwd: 'foo'});
      assert.equal(actual, '!' + path.resolve('foo/a/*.js'));
    });

    it('should make a glob absolute from a root path', function () {
      actual = resolve('/a/*.js', {root: 'foo'});
      assert.equal(actual, path.resolve('foo/a/*.js'));
    });

    it('should make a glob absolute from a root slash', function () {
      actual = resolve('/a/*.js', {root: '/'});
      assert.equal(actual, path.resolve('/a/*.js'));
    });

    it('should make a glob absolute from a negative root path', function () {
      actual = resolve('!/a/*.js', {root: 'foo'});
      assert.equal(actual, '!' + path.resolve('foo/a/*.js'));
    });

    it('should make a negative glob absolute from a negative root path', function () {
      actual = resolve('!/a/*.js', {root: '/'})
      assert.equal(actual, '!' + path.resolve('/a/*.js'));
    });
  });

  describe('windows', function () {
    it('should make an escaped negative extglob absolute', function () {
      actual = resolve('foo/bar\\!(baz)', {unixify: true});
      assert.equal(actual, path.resolve('foo/bar\\!(baz)'));
    });

    it('should make a glob absolute from a root path', function () {
      actual = resolve('/a/*.js', {root: 'foo\\bar\\baz', unixify: true});
      assert.equal(actual, path.resolve('foo/bar/baz/a/*.js'));
    });

    it('should make a glob absolute from a root slash', function () {
      actual = resolve('/a/*.js', {root: '\\\\', unixify: true});
      assert.equal(actual, path.resolve('/a/*.js'));
    });
  });
});
