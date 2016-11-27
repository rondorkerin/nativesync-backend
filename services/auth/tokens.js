var assert = require('assert')
var Promise = require('bluebird')
var lodash = require('lodash')
var uuid = require('node-uuid')

module.exports = function(seed,upsert){
  var methods = {}
  var tokens = {}

  upsert = upsert || function(item){
    if(item.id == null) item.id = uuid.v4()
    return Promise.resolve(item)
  }

  methods.init = Promise.method(function(){
    tokens = lodash.keyBy(seed,'token')
    // lodash.each(seed,function(token){
    //   tokens[token.id] = token
    // })
    return methods
  })

  methods.getByUserID = Promise.method(function(userid){
    return lodash.filter(tokens,function(token){
      return token.user_id == userid
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
    return upsert({token:uuid.v4(),user_id:userid,active:true}).then(function(token){
      tokens[token.token] = token
      return token
    })
  })

  return methods.init()
}
