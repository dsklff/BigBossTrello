const express = require('express');
const User = require('../models/user.js');
const Project = require('../models/project.js');
const TrelloUser = require('../models/trelloUsers.js')
const cron = require('node-cron');
var async = require('async');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const router = new express.Router();
let multiparty = require('multiparty');
var request  = require('request');
let fs = require('fs');



//This route will load user info

router.get('/profile', (req, res) => {
  var token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if(err) {return res.status(401).end();}
    else {
      const userId = decoded.sub;
      User.findOne({_id: userId}, (err, user) => {
        if(err) { console.log(err) }
        else {
          res.send({
            user: user
          })
        }
      })
    }
  })
});

//This route will load all projects info from db

router.get('/getprojects', (req, res) =>{
  Project.find({}, function(err, projects){
    if(err) console.log(err);
    else{
      res.send({
        projects
      })
    }
  })
})

//This route will delete project info from db

router.post('/deleteproject', (req, res) => {
  var token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if(err) {return res.status(401).end();}
    else {
      Project.findOneAndRemove({boardId:req.body.projectId}, function(err){
        if(err) console.log("err");
        else {
          console.log("Проект удален")
          res.status(200).end();
        }
      })

    }
  })
})

//This route will upload image for user profile
router.post('/uploadImg', (req, res) => {

    var form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      var originalFilename = files.imageFile[0].originalFilename;
      var copyToPath = "public/userImgs/" + originalFilename;
      var tempPath = files.imageFile[0].path;
      var fileName = originalFilename;

    fs.readFile(tempPath, (err, data) => {
      fs.writeFile(copyToPath, data, (err) => {
        fs.unlink(tempPath, () => {
          var token = req.headers.authorization.split(' ')[1];
          jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if(err) {return res.status(401).end();}
            else {
                var userId = decoded.sub;
                User.findOneAndUpdate({_id: userId}, { $set: {myImg: fileName}}, { new: true }, function (err, user) {
                  if(err) { console.log(err) }
                  else {
                    res.send({
                      user: user
                    });
                  }
                })
            }
          });
        });
      });
    });
  })
});

//This route will create trelloUsers

router.post('/addtrello', (req, res) => {
  var token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if(err) {return res.status(401).end();}
    else {
      const trelloName = req.body.trelloName
      const userId = decoded.sub;
      
      TrelloUser.findOne({trelloName:trelloName}, function(err, user){
        if(err) console.log(err);
        if(user){
          res.status(204).send(user);
        } else {
          var newTrelloUser = new TrelloUser({
            trelloName:trelloName
          })
          newTrelloUser.save(function(err, result){
            if(err) console.log(err);
            if(result){
              res.status(201).send(result);
            }
          })
        }
      })
    }
  })
});
//This is the func for loading trelloNames of all users
var getUsers = function () {
  return new Promise(function(resolve, reject) {
    return User.find({}, function (err, users) {
      if (err) reject(err)
      else if (users) {
        resolve(users)
      }
    })
  })
}
//This is the func with GET request for loading info about trello boards infos
var constructBoards = function (board) {
  var trellokey = "e0c253de836e9c4da6b9b79de664c1ba";
  var trellotoken = "0fd8eef7d9e87a3130fd37670d8d7bac2170b2c182e301a26270d5677c4a6d82"
  var path = 'https://api.trello.com/1/boards/'+board.id+'?fields=id,name,closed&lists=open&list_fields=id,name&members=all&member_fields=username,avatarHash,fullName&cards=open&card_fields=idList,name&key='+trellokey+'&token='+trellotoken;
  
  return function (allboards, callback) {
    request({
      method:'GET',
      uri: path,
      json: true
    }, function (err, response, board) {

      if (err) return (err);

        var callBack = (typeof allboards === 'function') ? allboards : callback
        var allBoards = (typeof allboards === 'function') ? [] : allboards

        var doneCards = [];
        var toDoCards = [];

        var listDone;
        board.lists.map(function(list){
          if(list.name.toLowerCase() === "done" || list.name.toLowerCase() ==="готово"){
             listDone=list.id
          }
        })

        board.cards.map(function (card){
          if(card.idList === listDone){
            doneCards.push(card)
          } else{
            toDoCards.push(card)
          }
        })

        allBoards.push({
          members:board.members,
          boardClosed:board.closed,
          boardId: board.id,
          boardName:board.name,
          doneCards: doneCards,
          toDoCards: toDoCards
        });

        callBack(null, allBoards);
    })
  }
}
// This is the middleware func for board loading
var boardFunctions = function(boards) {
  return boards.map(function(board) {
    var func = constructBoards(board)

    return func
  })
}
// This is the func with GET request for loading boards from trello and creating projects schemas in dbs
var constructUser = function (user) {
  var trellokey = "e0c253de836e9c4da6b9b79de664c1ba";
  var trellotoken = "0fd8eef7d9e87a3130fd37670d8d7bac2170b2c182e301a26270d5677c4a6d82"
  var path = 'https://api.trello.com/1/members/me?boards=all&board_fields=name&key='+trellokey+'&token='+trellotoken;
  
  return function (allusers, callback) {
    request({
      method:'GET',
      uri:path,
      json:true
    },function (err, response, body){
      if (err) return(err)
      var callBack = (typeof allusers === 'function') ? allusers : callback
      var allUsers = (typeof allusers === 'function') ? [] : allusers

      var allBoardFunctions = boardFunctions(body.boards)

      async.waterfall(allBoardFunctions, function (err, allCards) {
          if(err) console.log(err);


            allCards.map(function(trelloProject){
              if(trelloProject.boardClosed != true){
                Project.findOne({boardId:trelloProject.boardId}, function(err, project){
                  if(err) console.log(err);
                  if(project){
                    var newData = {
                      boardId:trelloProject.boardId,
                      boardName:trelloProject.boardName,
                      members:trelloProject.members,
                      doneCards:trelloProject.doneCards,
                      toDoCards:trelloProject.toDoCards
                    }
                    Project.update({_id:project._id}, {$set: newData}, function(err, status){
                      if(err) console.log(err);
                    })
                    } else {
                    var newProject = new Project({
                      boardId:trelloProject.boardId,
                      boardName:trelloProject.boardName,
                      members:trelloProject.members,
                      doneCards:trelloProject.doneCards,
                      toDoCards:trelloProject.toDoCards
                    });
                    newProject.save(function(err, newProject) {
                      if(err) console.log(err);
                    });
                  }
                });
              }            
          })

        allUsers.push(allCards)
          

        callBack(null, allUsers)

        
      })
    })
  }
}
// This is the middleware func for loading user from dbs 
var userFunctions = function(users) {
  return users.map(function (user) {
      var func = constructUser(user)
      return func
  })
}
// This route will load all info from boards
router.get('/gettrello', function (req, res, next) {
  getUsers()
    .then(function(users) {
      var arrayOfUserFunctions = userFunctions(users)
      async.waterfall(arrayOfUserFunctions,
        function (err, allusers) {
          if (err) console.log('error')

          res.status(200).send({allusers})
        }
      )
    })
});
//This is the scheduler for collecting all info from trello
cron.schedule('0 * * * *', function(){
  getUsers().then(function(users){
    var arrayOfUserFunctions = userFunctions(users)

      async.waterfall(arrayOfUserFunctions,
        function (err, allusers) {
          if (err) console.log('error')
        }
      )
  })
})

module.exports = router;

// router.get('/gettrello', (req, res) => {

//   var trellokey = "8cb68cae49674c1888f615a6ff332c26";
//   var userMap = [];
// User.find({}, function(err, users){
//         if(err) console.log(err);
//         else if(users){
//           users.map(function(user) {
//             if(user.trelloName){
//               var path = 'https://api.trello.com/1/members/'+user.trelloName+'?boards=all&key='+trellokey;
//               request({
//                 method:'GET',
//                 uri:path,
//                 json:true
//               }, function(err, response, body){
//                     if(err) console.log(err);
//                     if(response.statusCode == 200){
//                       var myBoards = [];
//                       body.boards.map(function(board){
//                         myBoards.push(board);
//                       })
//                     }
//                     myBoards.map(function(board){
//                       var pathSec = 'https://api.trello.com/1/boards/'+board.id+'/lists?cards=open&card_fields=name&fields=name&key='+trellokey;
//                       request({
//                           method:'GET',
//                           uri: pathSec,
//                           json: true
//                         },
//                         function(err, response, lists){

//                           if(err){
//                               console.log(err)
//                           }
//                           else if(response.statusCode == 200){

//                             lists.map(function(list){
//                                 var pathThree = 'https://api.trello.com/1/lists/'+list.id+'/cards?key='+trellokey;
//                                 request({
//                                     method:'GET',
//                                     uri: pathThree,
//                                     json: true
//                                   },
//                                   function(err, response, cards){
//                                     if(err){
//                                       console.log(err)
//                                     }
//                                     else if(response.statusCode == 200){
//                                       cards.map(function(card){
//                                         if(list.name === "Done" || list.name === "DONE"){
//                                           doneCards.push(card)
//                                         }
//                                         else{
//                                           toDoCards.push(card)
//                                         }
//                                       })
//                                     }
//                                   }
//                                 )
//                             })
//                           }
//                         }
//                       )
//                     })
//                  }
//               )
//             }
//           });
//         }
//       });
//   
// });

    // function(done){
    //   User.find({}, function(err, users){
    //     if(err) console.log(err);
    //     else if(users){
    //       users.map(function(user) {
    //         if(user.trelloName){
    //           done(null, user)
    //         }
    //       })
    //     }
    //   })
    // }, function(user, done){
    //       var temp = [];
    //       temp.push(user.name)
    //       var path = 'https://api.trello.com/1/members/'+user.trelloName+'?boards=all&key='+trellokey;
    //       request({
    //         method:'GET',
    //         uri:path,
    //         json:true
    //       }, function(err, response, body){
    //           if(err){
    //             console.log(err)
    //           }
    //           else if(response.statusCode == 200){
    //             body.boards.map(function(board){
    //               done(null, board, temp)
    //             })
    //           }
    //       })
    // }, function(board, temp, done){
    //       temp.push(board.name);
    //       var pathSec = 'https://api.trello.com/1/boards/'+board.id+'/lists?cards=open&card_fields=name&fields=name&key='+trellokey;
    //       request({
    //         method:'GET',
    //         uri: pathSec,
    //         json: true
    //       }, function(err, response, lists){
    //             if(err){
    //               console.log(err)
    //             }
    //             else if(response.statusCode == 200){
    //               lists.map(function(list){
    //                 done(null, list, temp)
    //               })
    //             }
    //         })
    // }, function(list, temp, done){
    //       var toDoCards = [];
    //       var doneCards = [];
    //       var pathThree = 'https://api.trello.com/1/lists/'+list.id+'/cards?key='+trellokey;
    //       request({
    //         method:'GET',
    //         uri: pathThree,
    //         json: true
    //       }, function(err, response, cards){
    //             if(err){
    //               console.log(err)
    //             }
    //             else if(response.statusCode == 200){
    //               cards.map(function(card){
    //                 if(list.name === "Done" || list.name === "DONE"){
    //                   doneCards.push(card)
    //                 }
    //                 else{
    //                   toDoCards.push(card)
    //                 }
    //               })
    //               temp.push(toDoCards);
    //               temp.push(doneCards);
    //             }
    //       })
    //       info.push(temp)
    //       done();
    //           console.log(info)

    // }