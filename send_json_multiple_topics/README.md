# Sending JSON to NodeJS to Multiple Topicd in Kafka.

What we are trying to achieve ?

1. Send `json` from and browser/`curl` to `nodejs`.
2. `nodejs` will redirect `json` data based on url to each `topic` in `kafka`. Example : URL `/upload/topic/A` will send the `json` to `topic_a` in `kafka`
3. Further processing is done on `kafka`.
4. We can then see the `json` arrival in `kafka`, using `kafka-console-consumer.sh` script.

###Step 1 : Get the `json_nodejs_multiple_topics.js` from git. 


###Step 2 : Start above script on the `nodejs` server.

	[nodejs-admin@nodejs nodejs]$ vim json_nodejs_multiple_topics.js
	[nodejs-admin@nodejs nodejs]$ node json_nodejs_multiple_topics.js


###Step 3 : Execute `curl` command to send the JSON to `nodejs`.

NOTE : Assuming that we have already created topics in kafka as shown in Step 5.

	[nodejs-admin@nodejs nodejs]$ curl -H "Content-Type: application/json" -d '{"username":"xyz","password":"xyz"}' http://localhost:8125/upload/topic/A
	[nodejs-admin@nodejs nodejs]$ curl -H "Content-Type: application/json" -d '{"username":"abc","password":"xyz"}' http://localhost:8125/upload/topic/B
	[nodejs-admin@nodejs nodejs]$ curl -H "Content-Type: application/json" -d '{"username":"efg","password":"xyz"}' http://localhost:8125/upload/topic/C
	[nodejs-admin@nodejs nodejs]$ curl -H "Content-Type: application/json" -d '{"username":"efg","password":"xyz"}' http://localhost:8125/upload/topic/D


###Step 4 :  Output on nodejs console

Running `node` 

    [nginx-admin@nginx nodejs]$ node json_nodejs_multiple_topics.js 
    For Topic A
    {"username":"xyz","password":"xyz"}
    { topic_a: { '0': 16 } }
    For Topic B
    {"username":"abc","password":"xyz"}
    { topic_b: { '0': 1 } }
    For Topic C
    {"username":"efg","password":"xyz"}
    { topic_c: { '0': 0 } }
    ERROR: Could not Process this URL :/upload/topic/D
    {"username":"efg","password":"xyz"}


To check `cluster` details like worker pid use the below command. Currently VM is running a single core.
If we have multi-core cpu, then we will see multiple lines like below.

    23521,Master Worker 23524 online
    23521,Master Worker 23526 online
    23521,Master Worker 23523 online
    23521,Master Worker 23528 online

Here is the command.

    [nginx-admin@nginx nodejs]$ NODE_DEBUG=cluster node json_nodejs_multiple_topics.js 
    15644,Master Worker 15646 online
    ERROR: Could not Process this URL :/upload/topic/D
    {"username":"efg","password":"xyz"}
    For Topic C
    {"username":"efg","password":"xyz"}
    { topic_c: { '0': 1 } }


`{"username":"xyz","password":"xyz"}` request from the `curl` command.
`{ test: { '0': 29 } }` response from the kafka cluster that, it has received the `json`.


####Step5 : Output on the `kafka` consumer side.

NOTE : Assuming that we have already created topics in kafka. using below command.
    
    [kafka-admin@kafka kafka]$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic topic_a
    [kafka-admin@kafka kafka]$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic topic_b
    [kafka-admin@kafka kafka]$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic topic_c
    [kafka-admin@kafka kafka_2.9.2-0.8.2.0]$ bin/kafka-topics.sh --list --zookeeper localhost:2181
    topic_a
    topic_b
    topic_c
    [kafka-admin@kafka kafka_2.9.2-0.8.2.0]$ 

Here is the output after running `curl` command on the `nodejs` server

	[kafka-admin@kafka kafka_2.9.2-0.8.2.0]$ bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic topic_a --from-beginning
	{"username":"xyz","password":"xyz"}

	[kafka-admin@kafka kafka_2.9.2-0.8.2.0]$ bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic topic_b --from-beginning
	{"username":"abc","password":"xyz"}
	
	[kafka-admin@kafka kafka_2.9.2-0.8.2.0]$ bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic topic_c --from-beginning
	{"username":"efg","password":"xyz"}	

`{"username":"xyz","password":"xyz"}` data received from `nodejs` server.
`{"username":"abc","password":"xyz"}` data received from `nodejs` server.
`{"username":"efg","password":"xyz"}` data received from `nodejs` server.



##### Useful Links.

[http://kafka.apache.org/documentation.html](http://kafka.apache.org/documentation.html "Kafka Documentation")

[http://nodejs.org/](http://nodejs.org/)

[http://nodejs.org/api/http.html](http://nodejs.org/api/http.html)

<https://www.npmjs.com/package/kafka-node>

<https://cwiki.apache.org/confluence/display/KAFKA/Index>

<https://github.com/pelger/Kafkaesque>

<https://github.com/joyent/node/wiki/installing-node.js-via-package-manager#enterprise-linux-and-fedora>

<http://stackoverflow.com/questions/7172784/how-to-post-json-data-with-curl-from-terminal-commandline-to-test-spring-rest>
