var mongoose = require('mongoose');
var projectSchemas = new mongoose.Schema({
    boardId:{
        type:String,
        unique:true
    },
    boardName:String,
    members:[],
    doneCards:[],
    toDoCards:[]
});
module.exports = mongoose.model('Project', projectSchemas);