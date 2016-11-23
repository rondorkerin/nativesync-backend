var assert = require('assert')
var Promise = require('bluebird')
var lodash = require('lodash')
var uuid = require('node-uuid')

module.exports = function(seed,upsert){
  var users = {}
  var byEmail = {}
  var methods = {}

  upsert = upsert || function(item){
    if(item.id == null) item.id = uuid.v4()
    return Promise.resolve(item)
  }

  methods.init = Promise.method(function(){
    lodash.each(seed,function(user){
      users[user.id] = user
      byEmail[user.email.toUpperCase()] = user
    })
    return methods
  })

  methods.create = Promise.method(function(email){
    assert(email,'requires email')
    return upsert({email:email}).then(function(user){
      console.log(user)
      users[user.id] = user
      byEmail[user.email.toUpperCase()] = user
      return user
    })
  })

  methods.getByEmail = Promise.method(function(email){
    assert(email,'requires email')
    var upper = email.toUpperCase()
    var user = byEmail[upper]
    assert(user,'user does not exist with that email')
    return user
  })

  methods.changeEmail = Promise.method(function(id,newemail){
    assert(newemail,'requires new email')
    var upper = newemail.toUpperCase()
    assert(byEmail[upper] == null, 'user with that email already exists')
    return methods.get(id).then(function(user){
      user.email = newemail
      return upsert(user)
    }).then(function(user){
      users[user.id] = user
      byEmail[user.email.toUpperCase()] = user
      return user
    })
  })

  methods.get = Promise.method(function(id){
    assert(id,'requires user id')
    var user = users[id]
    assert(user,'user does not exist with that id')
    return user
  })

  return methods.init()
}
