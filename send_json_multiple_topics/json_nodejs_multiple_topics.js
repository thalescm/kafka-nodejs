/*
	Getting some 'http' power
*/
var http=require('http');

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

	if(request.method === "POST")
	{
        /*
            Using kafka-node - really nice library
            create a producer and connect to a Zookeeper to send the payloads.
        */
        var kafka = require('kafka-node'),
        Producer = kafka.Producer,
        client = new kafka.Client('kafka:2181'),
        producer = new Producer(client);

	    if (request.url === "/upload/topic/A")
	    {
            request.on('data', function (chunk)
            {

                /*
                    CHUNK which we recive from the clients
                    For our request we are assuming its going to be a JSON data.
                    We print it here on the console.
                */
                console.log("For Topic A")
                console.log(chunk.toString('utf8'))



                /*
                    Creating a payload, which takes below information
                    'topic' 	-->	this is the topic we have created in kafka.
                    'messages' 	-->	data which needs to be sent to kafka. (JSON in our case)
                    'partition' -->	which partition should we send the request to.
                                    If there are multiple partition, then we optimize the code here,
                                    so that we send request to different partitions.

                */
                    payloads = [
                    { topic: 'topic_a', messages: chunk.toString('utf8'), partition: 0 },
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
        }
        else if (request.url === "/upload/topic/B")
	    {
            request.on('data', function (chunk)
            {

                /*
                    CHUNK which we recive from the clients
                    For our request we are assuming its going to be a JSON data.
                    We print it here on the console.
                */
                console.log("For Topic B")
                console.log(chunk.toString('utf8'))


                /*
                    Creating a payload, which takes below information
                    'topic' 	-->	this is the topic we have created in kafka.
                    'messages' 	-->	data which needs to be sent to kafka. (JSON in our case)
                    'partition' -->	which partition should we send the request to.
                                    If there are multiple partition, then we optimize the code here,
                                    so that we send request to different partitions.

                */
                    payloads = [
                    { topic: 'topic_b', messages: chunk.toString('utf8'), partition: 0 },
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
        }
        else if (request.url === "/upload/topic/C")
	    {
            request.on('data', function (chunk)
            {

                /*
                    CHUNK which we recive from the clients
                    For our request we are assuming its going to be a JSON data.
                    We print it here on the console.
                */
                console.log("For Topic C")
                console.log(chunk.toString('utf8'))

                /*
                    Creating a payload, which takes below information
                    'topic' 	-->	this is the topic we have created in kafka.
                    'messages' 	-->	data which needs to be sent to kafka. (JSON in our case)
                    'partition' -->	which partition should we send the request to.
                                    If there are multiple partition, then we optimize the code here,
                                    so that we send request to different partitions.

                */
                    payloads = [
                    { topic: 'topic_c', messages: chunk.toString('utf8'), partition: 0 },
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
        }

        else
	    {
            request.on('data', function (chunk)
            {

                /*
                    CHUNK which we recive from the clients
                    For our request we are assuming its going to be a JSON data.
                    We print it here on the console.
                */
                console.log("ERROR: Could not Process this URL :" + request.url)
                console.log(chunk.toString('utf8'))

            });
        }
    }


	/*
		end of request
	*/
    response.end();

/*
	Listen on port 8125
*/
}).listen(8125);

/*

Useful Links:

http://stackoverflow.com/questions/15427220/how-to-handle-post-request-in-node-js

*/