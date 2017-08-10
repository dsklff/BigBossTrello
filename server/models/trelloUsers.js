var mongoose = require('mongoose');
var trelloUsers = new mongoose.Schema({
    trelloName:{
    	type:String,
    	unique:true
    }
});
module.exports = mongoose.model('TrelloUser', trelloUsers);