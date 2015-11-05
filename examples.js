
var toAbsGlob = require('./');
console.log(toAbsGlob('a'))
console.log(toAbsGlob('a/*.js'))
console.log(toAbsGlob('a/*/'))
console.log(toAbsGlob('./fixtures/whatsgoingon/*/', {cwd: __dirname}))
console.log(toAbsGlob('!a/*.js'))
console.log(toAbsGlob('a/*.js', {cwd: 'foo'}))
console.log(toAbsGlob('!a/*.js', {cwd: 'foo'}))
console.log(toAbsGlob('/a/*.js', {root: 'baz'}))
console.log(toAbsGlob('/a/*.js', {root: '/'}))
console.log(toAbsGlob('!/a/*.js', {root: 'baz'}))
console.log(toAbsGlob('!/a/*.js', {root: '/'}))
