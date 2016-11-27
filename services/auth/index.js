var Auth = require('./auth')
var Promise = require('bluebird')
var lodash = require('lodash')


module.exports = function(Models){
  return Promise.props({
    users: Models.User.findAll().then(function(result){
      return lodash.map(result,'dataValues')
    }),
    hashesTokens: Models.UserSystemAuth.findAll().then(function(result){
      return lodash.map(result,'dataValues')
    }),
    upsertUser: function(x){
      return Models.User.upsert(x).then(function(){
        return Models.User.findOne({where:{email:x.email}})
      }).then(function(result){
        console.log('upsertuser',result.dataValues)
        return result.dataValues
      }) 
    },
    upsertHash: function(x){
      //hashes contain id, and hash
      return Models.UserSystemAuth.upsert(x).then(function(){
        return Models.User.findOne({where:{id:x.id}})
      }).then(function(result){
        console.log('upserthash',result.dataValues)
        return result.dataValues
      }) 
    },
    upsertToken: function(x){
      //tokens contain userid, 
      return Models.UserSystemAuth.upsert(x).then(function(){
        return Models.User.findOne({where:{user_id:x.user_id}})
      }).then(function(result){
        console.log('upserttoken',result.dataValues)
        return result.dataValues
      })
    }
  }).then(function(result){
    console.log(result.users,console.log(result.hashesTokens))
    return Auth(result.users,result.hashesTokens,result.hashesTokens,result.upsertHash,result.upsertToken)
  })
}
