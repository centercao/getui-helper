/**
 * Created by center ON 17-11-7
 */
const _ = require('lodash');
var request = require('request');
var crypto = require('crypto');
var shortid = require('js-shortid');
var inst = shortid.inst({salts:5});
const defaultOptions = {
	appId: 'eECHDNfs5Z680lzQMEHCt6',
	appKey: 'CcArSfD8IrA7l8diZDxw4060',
	masterSecret: 'VDLFyCWoyd9onOrmCP4m7080',
	title: "智能家居信息"
	};
var GETUI = function (options) {
	this.options = _.merge({}, defaultOptions, options);
	this.authToken = "";
};
GETUI.prototype = {
	uuid:function() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	},
	getAuthToken:function () {
		var timeStamp = new Date().getTime();
		var sign = crypto.createHash('sha256').update(this.options.appKey + timeStamp + this.options.masterSecret).digest('hex');
		var postData ={
			"sign":sign,
			"timestamp":timeStamp,
			"appkey":this.options.appKey
		};
		var option = {
			uri:"https://restapi.getui.com/v1/" + this.options.appId + "/auth_sign",
			method: 'post',
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json'
			},
			json:true,
			body:postData
		};
		var that =this;
		return new Promise(function (resolve, reject) {
			request(option,
				function(error, response, data) {
					if (!error && response.statusCode == 200 && data.result == "ok") {
						that.authToken = data.auth_token;
						resolve(data.result);
						return;
					}else{
						that.authToken = "";
						reject(error + (data && data.result));
					}
				});
		})
	},
	sendMessage:function (title,info,cId) {
		if(!this.authToken){
			return "error"
		}
		var postData ={
			"message": {
				"appkey": this.options.appKey,
				"is_offline": true,
				"offline_expire_time":10000000,
				"msgtype": "transmission"
			},
			"transmission":{
				"transmission_type":false,
				"transmission_content":"this is the transmission_content",
				"duration_begin":"2017-03-22 11:40:00",
				"duration_end":"2017-03-29 11:40:00"
			},
			"push_info": {
				"aps": {
					"alert": {
						"title": "xxxx",
						"body": "xxxxx"
					},
					"autoBadge": "+1",
					"content-available": 1
				},
				"multimedia": [
					{
						"url": "http://ol5mrj259.bkt.clouddn.com/test2.mp4",
						"type": 3,
						"only_wifi": true
					}
				]
			},
			"cid": "5c4e5cf583713aaa09543d5052f11f3e",
			"requestid": inst.gen()
		};
		var options = {
			uri:"https://restapi.getui.com/v1/" +this.options.appId + "/push_single",
			method: 'post',
			timeout: 30000,
			headers: {
				'Content-Type': 'application/json',
				'authtoken': this.authToken
			},
			json:true,
			body:postData
		};
		return new Promise(function(resolve, reject){
			request(options,
				function(error, response, data) {
				if (!error && response.statusCode == 200) {
					resolve(data);
				}else{
					reject({
						status:800,
						msg:error
					});
				}
			});
		});
	}
};
module.exports =GETUI;