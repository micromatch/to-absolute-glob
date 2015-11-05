'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var resolve = require('./');
var actual, fixture;

describe('resolve', function () {
  it('should make a path absolute', function () {
    assert.equal(resolve('a'), path.resolve('a'));
  });

  it('should make a glob absolute', function () {
    assert.equal(resolve('a/*.js'), path.resolve('a/*.js'));
  });

  it('should retain trailing slashes', function () {
    actual = resolve('a/*/');
    assert.equal(actual, path.resolve('a/*') + '/');
    assert(actual.slice(-1) === '/');
  });

  it('should retain trailing slashes with cwd', function () {
    fixture = './fixtures/whatsgoingon/*/';
    actual = resolve(fixture, {cwd: __dirname});
    assert.equal(actual, path.resolve(fixture) + '/');
    assert(actual.slice(-1) === '/');
  });

  it('should make a negative glob absolute', function () {
    actual = resolve('!a/*.js');
    assert.equal(actual, '!' + path.resolve('a/*.js'));
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
