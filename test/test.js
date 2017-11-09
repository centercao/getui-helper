/**
 * Created by center ON 17-11-7
 */
var Tran  = require("../index");
var tran = new Tran({
	appId: 'eECHDNfs5Z680lzQMEHCt6',
	appKey: 'CcArSfD8IrA7l8diZDxw46',
	masterSecret: 'VDLFyCWoyd9onOrmCP4m78',
	title: "智能家居信息"
});
async function test() {
	// var str = await  tran.getAuthToken();
	try{
		var str = await tran.sendMessage("报警",{id:123456,alarm:2},'5c4e5cf583713aaa09543d5052f11f3e');
		console.log(str);
	}catch (error){
		console.log(error);
	}
	setTimeout(async function () {
		try{
			var str = await tran.sendMessage("报警",{id:123456,alarm:2},'5c4e5cf583713aaa09543d5052f11f3e');
			console.log(str);
		}catch (error){
			console.log(error);
		}
	},3000);
	
}
async function my() {
	await test();
}
my();