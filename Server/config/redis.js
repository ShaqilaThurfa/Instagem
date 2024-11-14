const Redis = require("ioredis");

const redis = new Redis({
  port: 14970, // Redis port
  host: "redis-14970.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com", // Redis host
  username: "default", // needs Redis >= 6
  password: '30YGckoSwyaj0MBmQoOq5is4jg2x2TtZ',
  db: 0, // Defaults to 0
});

module.exports = redis;

