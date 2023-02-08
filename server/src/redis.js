const redis = require('redis');
const { promisifyAll } = require('bluebird');
const config = require('../config.json');


/* Using bluebird to turn all of redis's functions into promises we can use asynchronously */
promisifyAll(redis);


/**
 * Global that stores the host of our redis cache. By default it is **"localhost"**
 * 
 * __/!\ Warning : If the redis cache runs in a local docker container, it may be the name of the container not "localhost" /!\\__
 * @global
 * @constant
 * @type {string}
 * @default "localhost"
 */
const HOST = (config.redis && config.redis.host) ? config.redis.host : "localhost";


/**
 * Global that stores the port of our redis cache. By default it is **"6379"**
 * 
 * __/!\ Warning : If the redis cache runs in a local docker container, it may be the port you linked to /!\\__
 * @global
 * @constant
 * @type {string}
 * @default "6379"
 */
const PORT = (config.redis && config.redis.port) ? config.redis.port : "6379";

let client;

/**
 * Function to connect to redis.
 * @function connect
 */
function connect() {
    client = redis.createClient({
        host: HOST,
        port: PORT,
        password: (config.redis && config.redis.password) ? config.redis.password : undefined
    });
    client.on('connect', (_) => {
        console.log('Connected to redis');
    });
    client.on('error', err => {
        console.log("Redis: ", err);
        close();
    });
}

/**
 * Function to close redis client
 * @function close
 */
function close() {
    client.quit();
}

/**
 * Function to get redis client
 * @function get
 */
function get() {
    return client;
}

module.exports = {
    connect,
    get
}
