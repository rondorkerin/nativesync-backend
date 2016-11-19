var State = require('statesync')
var assert = require('assert')
var Promise = require('bluebird')
var lodash = require('lodash')
var Emitter = require('events')
var Users = require('./users')
var Tokens = require('./tokens')
var Hashes = require('./hashes')

module.exports = function(seedUsers,seedHashes,seedTokens,handleUserChange,handleHashChange,handleTokenChange){
  var state = {}

  var methods = new Emitter()
  var users, hashes, tokens = null
  
  methods.signup = Promise.method(function(email,password){
    assert(email,'requires email')
    assert(password,'requires password')
    return users.getByEmail(email).then(function(){
      throw new Error('User with that email exists')
    }).catch(function(){
      return users.create(email)
    }).then(function(user){
      return [user,hashes.set(user.id,password)]
    }).spread(function(user){
      return user
    })
  })

  methods.login = Promise.method(function(email,password){
    return users.getByEmail(email).then(function(user){
      return [user,hashes.compare(user.id,password)]
    }).spread(function(user,valid){
      assert(valid,'incorrect password')
      return [user,tokens.getByUserID(user.id)]
    }).spread(function(user,toks){
      if(toks.length == 0) return tokens.create(user.id)
      return toks[0]
    })
  })

  methods.logout = Promise.method(function(tokenid){
    return tokens.delete(tokenid)
  })

  methods.validate = Promise.method(function(tokenid){
    assert(tokenid,'requires token')
    return tokens.get(tokenid).then(function(token){
      return users.get(token.userid)
    })
  })

  methods.changePassword = Promise.method(function(tokenid,oldpass,newpass){
    assert(tokenid,'requires token')
    assert(oldpass,'requires oldpass')
    assert(newpass,'requires newpass')
    return tokens.get(tokenid).then(function(token){
      return [token,hashes.compare(token.userid,oldpass)]
    }).spread(function(token,valid){
      assert(valid,'incorrect previous password')
      return hashes.set(token.userid,newpass)
    })
  })

  methods.init = Promise.method(function(){
    return Promise.all([
      Users(seedUsers,handleUserChange),
      Hashes(seedHashes,handleHashChange),
      Tokens(seedTokens,handleTokenChange),
    ]).spread(function(u,h,t){
      users = u
      hashes = h
      tokens = t
      return methods
    })
  })

  return methods.init()
}
