import * as redis from "redis"

export class Handler {
	private client: redis.RedisClient = null;
	constructor(public config: any = null) {
		this.client = redis.createClient(config);
	}

	get(key: string, callback: Function) {
		if(this.config.prefix) {
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
	set(key: string, value: Buffer, header: any, rawUrl: string, expire: number = null, callback?: Function) {
		if(this.config.prefix) {
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

	del(key: string) {
		if(this.config.prefix) {
			key = this.config.prefix + "_" + key;
		}

		this.client.DEL(key);
	}

	delGroup(group: string) {
		if(this.config.prefix) {
			group = this.config.prefix + "_" + group;
		}

		this.client.KEYS(group + "_*", function(err, rows) {
			if(!err) {
				this.client.DEL(rows);
			}
		});
	}
}

