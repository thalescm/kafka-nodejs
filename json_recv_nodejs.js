//	Getting some 'http' power
var http=require('http');

//	Setting where we are expecting the request to arrive.
//	http://localhost:8125/upload
var request = {
				hostname: 'localhost',
				port: 8125,
				path: '/upload',
				method: 'GET'
			};

//	Lets create a server to wait for request.
http.createServer(function(request, response) 
{
	//	Making sure we are waiting for a JSON.
    response.writeHeader(200, {"Content-Type": "application/json"});
	
	//	request.on waiting for data to arrive.
    request.on('data', function (chunk) 
	{
		//	CHUNK which we recive from the clients
		//	For out request we are assuming its going to be a JSON data.
		//	We print it here on the console. 
		console.log(chunk.toString('utf8'))
    });
	//end of request
    response.end();
//	Listen on port 8125
}).listen(8125);