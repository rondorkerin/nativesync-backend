var assert = require('assert')
var Promise = require('bluebird')
var lodash = require('lodash')
var uuid = require('node-uuid')

var bcrypt = require('bcryptjs')

var Hash = Promise.promisify(bcrypt.hash)
var Compare  = Promise.promisify(bcrypt.compare)

module.exports = function(upsert,seed){
  var methods = {}
  var hashes = {}

  upsert = upsert || function(item){
    if(item.id == null) item.id = uuid.v4()
    return Promise.resolve(item)
  }

  methods.init = Promise.method(function(){
    hashes = lodash.keyBy(seed,'id')
    return methods
  })

  methods.compare = Promise.method(function(id,password){
    var hash = hashes[id]
    assert(hash,'hash does not exist')
    return Compare(password,hash) 
  })

  methods.set = Promise.method(function(id,password){
    return Hash(password,10).then(function(hash){
      return upsert({ id:id,hash:hash }).then(function(result){
        hashes[result.id] = result.hash
        return true
      })
    })
  })


  return methods.init()
}
