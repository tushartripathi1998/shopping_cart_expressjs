var express = require('express');
var router = express.Router();

//test 
router.get('/', function(req, res){
    res.render('index',
    {title:"home"});
});

//Exports
module.exports = router;