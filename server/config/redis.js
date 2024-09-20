require('dotenv').config()
const Redis = require('ioredis');

const redis = new Redis({
  port: process.env.REDIS_PORT,  
  host: process.env.REDIS_HOST,  
  password: process.env.REDIS_PASSWORD 
});

redis.ping((err, result) => {
  if(err){
    console.log(err);
  } else {
    console.log(result);
  }
})

module.exports = redis
