/////// variable definitions ////////
var port = 80;
var app;
var local= true;
var DomainEnding;
if(local){
	domainEnding="de";
}else{
	domainEnding="com";
}

//////// load dependencies ////////
// hash algorithm
var murmurhash = require('murmurhash');
// chronJob 24 hours kill record from db
var CronJob = require('cron').CronJob;
//parser to that we can easily access the json response
var bodyParser = require('body-parser');
//webserver framework
var express = require('express');
// to enable CORS - otherwise json post request will fail
var cors = require('cors');
var path = require('path');
var vhost = require('vhost');
//Compression for gzip Compression
var compression = require('compression');

function createVirtualHost(domainName, dirPath) {
  return vhost(domainName, express.static(dirPath));
}

////// app configuration ////////
app = express();
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, '../www')));


//Create the virtual hosts
var anzumana = createVirtualHost("www.anzumana." + domainEnding, "sites/public_html/");
var hub = createVirtualHost("hub.anzumana."+domainEnding, "sites/ContentHub/");
var overwatch = createVirtualHost("overwatch.anzumana."+domainEnding, "sites/overwatch/");
var blog = createVirtualHost("www.blog.anzumana.de"+domainEnding, "sites/blog/");
var internIp = createVirtualHost("127.0.0.1","sites/public_html/");
var redesign = createVirtualHost("redesign.anzumana."+domainEnding,"sites/anzumana-com/dist/");
sites =[anzumana,hub,overwatch,blog,internIp,redesign];
for(var i = 0; i< sites.length;i++){
	app.use(sites[i]);
}


//enable the port that the app is listening on
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
