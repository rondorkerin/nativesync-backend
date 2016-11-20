var assert = require('assert')
var Promise = require('bluebird')
var lodash = require('lodash')
var uuid = require('node-uuid')

module.exports = function(upsert,seed){
  var methods = {}
  var tokens = {}

  upsert = upsert || function(item){
    if(item.id == null) item.id = uuid.v4()
    return Promise.resolve(item)
  }

  methods.init = Promise.method(function(){
    lodash.each(seed,function(token){
      if(token.active){
        tokens[token.id] = token
      }
    })
    return methods
  })

  methods.getByUserID = Promise.method(function(userid){
    return lodash.filter(tokens,function(token){
      return token.userid == userid
    })
  })

  methods.get = Promise.method(function(id){
    var token = tokens[id]
    assert(token,'token does not exist')
    return token
  })
  
  methods.delete = Promise.method(function(id){
    var token = tokens[id]
    if(token == null) return true
    token.active = false
    return upsert(token).then(function(){
      delete tokens[id]
      return true
    })
  })

  methods.create = Promise.method(function(userid){
    assert(userid,'create token requires userid')
    return upsert({userid:userid,active:true}).then(function(token){
      tokens[token.id] = token
      return token
    })
  })

  return methods.init()
}
