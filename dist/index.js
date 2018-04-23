"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
class Handler {
    constructor(config = null) {
        this.config = config;
        this.client = null;
        this.client = redis.createClient(config);
    }
    get(key, callback) {
        if (this.config.prefix) {
            key = this.config.prefix + "_" + key;
        }
        this.client.HGETALL(key, (err, data) => {
            if (err !== null)
                return callback(err, null);
            if (data !== null) {
                data.header = JSON.parse(data.header);
                return callback(null, data);
            }
            return callback(null, null);
        });
    }
    set(key, value, header, rawUrl, expire = null, callback) {
        if (this.config.prefix) {
            key = this.config.prefix + "_" + key;
        }
        this.client.HMSET(key, [
            "content", value.toString(),
            "header", JSON.stringify(header),
            "url", rawUrl
        ], () => {
            if (expire !== null) {
                this.client.EXPIRE(key, expire);
            }
            else if (this.config.default_expire) {
                this.client.EXPIRE(key, this.config.default_expire);
            }
            callback && callback(key);
        });
    }
    del(key) {
        if (this.config.prefix) {
            key = this.config.prefix + "_" + key;
        }
        this.client.DEL(key);
    }
    delGroup(group) {
        if (this.config.prefix) {
            group = this.config.prefix + "_" + group;
        }
        this.client.KEYS(group + "_*", function (err, rows) {
            if (!err) {
                this.client.DEL(rows);
            }
        });
    }
}
exports.Handler = Handler;
