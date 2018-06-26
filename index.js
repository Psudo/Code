var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var template = {
	root : function(options){
		options = options || {};
		options.list = options.list || ["\t\t<li>no projects found</li>"];
		var head = [
			"<!DOCTYPE html><html><head><title>Projects</title>",
		  	"<style type='text/css'>fieldset{float:left}br{clear:both}</style>",
		  	"</head><body>",
		  	"\t<h1>Projects</h1>",
		  	"\t<fieldset><lenged>Pick One<legend><ul>",
		''];
		var foot = [
			"\t</ul></fieldset><br>",
			"\t<div>or <a href='/proj/new/'>Start A New Project</a></div>",
			"</body></html>",
		''];
		return head.concat(options.list).concat(foot).join("\n");
	},
	new_proj : function(options){
		options = options || {};
		options.project_name = options.project_name || '';
		return ["<!DOCTYPE html><html><head><title>Projects</title>",
			"<style type='text/css'>fieldset{float:left}br{clear:both}</style>",
			"</head><body><h1>New Project</h1><form action='/proj/new/' method='post'>",
			["<div><label>Project Name:</label><input type='text' name='project_name' value=", options.project_name, "></div>"].join("'"),
			"<div><label></label><input type='submit' value='Create'/></div>",
			"</form></body></html>",
		''].join("\n");	
	},
_:0};

const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

Object.mt = {};
Object.extend = function(origin, destination){
	for(key in origin){ if(origin[key] !== Object.mt[key]){
		destination[key] = origin[key];
	}}
	return destination;
};

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');

	var path = req.url.split('/');
	switch(path[1]){
		case 'proj':
			if(path[2]-0){
				// load particular project by ID number
			} else if(path[2] == 'new'){
				// create new project
				console.log(res.body);
				console.log(req);
				res.end(template['new_proj']());
			} else {
				// project root page
			}
			return;
		default:
			fs.readdir('Projects', (err, files) => {
				var list = [];
				if(err) console.log("Directory 'Projects' doesn't exist.");
				if(files) for(var i = 0; i < files.length; i++){
					var name = files[i].split('.')[0];
					if(name.length) list.push("\t\t<li><a href='/proj/" + encodeURI(name) + "'>" + name + "</a></li>");
				}
				res.end(template['root']({'list' : list}));
			});
			return;
	}
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/*
db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
      res.write();
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});
/**/

db.close();