var test = require('tape')
var Hashes = require('./hashes')
var Tokens = require('./tokens')
var Users = require('./users')
var Auth = require('./auth')

test('hashes',function(t){
  var hashes = null
  t.test('init',function(t){
    Hashes().then(function(result){
      t.ok(result)
      hashes=result
      t.end()
    }).catch(t.end)
  })
  t.test('set',function(t){
    hashes.set('test','somepass').then(function(result){
      t.ok(result)
      t.end()
    }).catch(t.end)
  })
  t.test('compare',function(t){
    t.plan(3)
    hashes.compare('test','somepass').then(function(result){
      t.ok(result)
    }).catch(t.end)

    hashes.compare('test','badpass').then(function(result){
      t.notOk(result)
    }).catch(t.end)

    hashes.compare('dne','badpass').then(t.end).catch(function(result){
      t.ok(result)
    })
  })
})

test('tokens',function(t){
  var tokens = null
  var token = null
  t.test('init',function(t){
    Tokens().then(function(result){
      t.ok(result)
      tokens=result
      t.end()
    }).catch(t.end)
  })

  t.test('create',function(t){
    tokens.create('test').then(function(result){
      token = result
      t.ok(result)
      t.end()
    }).catch(t.end)
  })
  t.test('getByUserID',function(t){
    tokens.getByUserID('test').then(function(result){
      t.equal(result.length,1)
      t.equal(result[0].userid,'test')
      t.end()
    }).catch(t.end)
  })
  t.test('delete',function(t){
    tokens.delete(token.id).then(function(result){
      t.ok(result)
      return tokens.getByUserID('test')
    }).then(function(result){
      t.equal(result.length,0)
      t.end()
    }).catch(t.end)
  })

})

test('users',function(t){
  var users = null
  var user = null
  t.test('init',function(t){
    Users().then(function(result){
      t.ok(result)
      users=result
      t.end()
    }).catch(t.end)
  })
  t.test('create',function(t){
    users.create('email').then(function(result){
      user = result
      t.ok(result)
      t.end()
    }).catch(t.end)
  })
  t.test('get',function(t){
    t.plan(2)
    users.get('dne').then(t.end).catch(function(err){
      t.ok(err)
    }).catch(t.end)
    users.get(user.id).then(function(result){
      t.deepEqual(result,user)
    }).catch(t.end)
  })
  t.test('getByEmail',function(t){
    users.getByEmail('email').then(function(result){
      t.deepEqual(result,user)
      t.end()
    }).catch(t.end)
  })
  t.test('changeEmail',function(t){
    t.plan(2)
    users.changeEmail(user.id,'email').then(t.end).catch(function(err){
      t.ok(err)
    })
    users.changeEmail(user.id,'newemail').then(function(result){
      t.equal(result.email,'newemail')
    })
  })
})

test('auth',function(t){
  var auth = null
  var user = null
  var token = null
  t.test('init',function(t){
    Auth().then(function(result){
      t.ok(result)
      auth=result
      t.end()
    }).catch(t.end)
  })
  t.test('signup',function(t){
    auth.signup('email','password').then(function(result){
      user = result
      t.ok(result)
      t.end()
    }).catch(t.end)
  })
  t.test('login',function(t){
    t.plan(2)
    auth.login('email','password').then(function(result){
      token = result
      t.equal(result.userid,user.id)
    }).catch(t.end)
    auth.login('email','bad').then(t.end).catch(function(result){
      t.ok(result)
    })
  })
  t.test('validate',function(t){
    auth.validate(token.id).then(function(result){
      t.deepEqual(result,user)
      t.end()
    }).catch(t.end)
  })
  t.test('change password',function(t){
    t.plan(2)
    auth.changePassword(token.id,'badpass','newpass').then(t.end).catch(function(result){
      t.ok(result)
    })
    auth.changePassword(token.id,'password','newpass').then(function(result){
      t.ok(result)
    })
  })
  t.test('logout/login',function(t){
    auth.logout(token.id).then(function(result){
      t.ok(result)
      return auth.login('email','newpass')
    }).then(function(result){
      t.ok(result)
      t.end()
    }).catch(t.end)
  })

})
