var express = require('express');
var router = express.Router();

//test 
router.get('/', function(req, res){
    res.send("Admin area");
});



//Exports
module.exports = router;