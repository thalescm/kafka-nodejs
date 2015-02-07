/*
	Getting some 'http' power
*/
var http=require('http');

/*
	Setting where we are expecting the request to arrive.
	http://localhost:8125/upload
	
*/
var request = {
        hostname: 'localhost',
        port: 8125,
        path: '/upload',
        method: 'GET'
};

/*
	Lets create a server to wait for request.
*/
http.createServer(function(request, response)
{
	/*
		Making sure we are waiting for a JSON.
	*/
    response.writeHeader(200, {"Content-Type": "application/json"});
    
	/*
		request.on waiting for data to arrive.
	*/
	request.on('data', function (chunk)
    {
	
		/* 
			CHUNK which we recive from the clients
			For our request we are assuming its going to be a JSON data.
			We print it here on the console. 
		*/
		console.log(chunk.toString('utf8'))

		/* 
			Using kafka-node - really nice library
			create a producer and connect to a Zookeeper to send the payloads.
		*/
		var kafka = require('kafka-node'),
		Producer = kafka.Producer,
		client = new kafka.Client('kafka:2181'),
		producer = new Producer(client);
		
		/*
			Creating a payload, which takes below information
			'topic' 	-->	this is the topic we have created in kafka.
			'messages' 	-->	data which needs to be sent to kafka. (JSON in our case)
			'partition' -->	which partition should we send the request to.
							If there are multiple partition, then we optimize the code here,
							so that we send request to different partitions. 
							
		*/
			payloads = [
			{ topic: 'test', messages: chunk.toString('utf8'), partition: 0 },
		];

		/*
			producer 'on' ready to send payload to kafka.
		*/
		producer.on('ready', function(){
			producer.send(payloads, function(err, data){
					console.log(data)
			});
		});

		/*
			if we have some error.
		*/
		producer.on('error', function(err){})

    });
	/*
		end of request
	*/
    response.end();
	
/*
	Listen on port 8125
*/	
}).listen(8125);
