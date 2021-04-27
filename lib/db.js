var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'3.14.151.80',
	user:'mukesh_local',
	password:"mukesh2103",
	database:'emp-db'
});


connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;
