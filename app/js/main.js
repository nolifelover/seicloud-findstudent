global.$ = $;
var moment = require('moment');
var needle = require('needle');
var async = require('async');
var jade = require('jade');
var ejs = require('ejs');
var config = require('config');
var logger = require('logger');
var fs = require('fs')
var sys = require('sys');
var Reader = require('reader');
var token = "";
var onView = "home";
var reader = Reader.init("/dev/ttyUSB0", "test");

var getCardData = function(cardCode, callback){
	var callUrl = config.api.uri+"/students/card"
	var data = {token: token, umd: config.umd, code:cardCode.substring(0,10), format : 'json'};
	logger.info("get card data "+sys.inspect(data));
	needle.request('get', callUrl, data, function(error, response){
		logger.debug("response "+sys.inspect(response.statusCode))
		if(!error && response.statusCode == 200){
			var body = response.body;
			//logger.debug("body "+body);
			try{
				body = JSON.parse(body);
				if(body.code == 200){
					logger.debug("--- found usercard "+body.student);
					return callback(null, body.student, body.imageUrl);
				}else{
					var error = new Error("can't fetch data or not found")
					error.code = -2
					return callback(error);
				}
			}catch(e){
				logger.error("--- get card error "+e);
				var error = new Error("can't fetch data or not found")
				error.code = -1;
				error.e = e;
				return callback(error);
			}				
		}else{
			//cb({error:true, message:"connection problem", code: -1});
			logger.error("-- error "+error);
			var err = new Error("wrong status or error");
			err.code = -3;
			return callback(err);
		}
	});
}

reader.on(Reader.Event.Connected,function(){
	logger.info("-- success start reader");		  			
}).on(Reader.Event.Error,function(){
	logger.info("-- error to connect "+port);
	//self.changeStatus("reader", false);
}).on(Reader.Event.Data, function(result){
	logger.debug("-- received card "+result.tag)
	logger.verb(sys.inspect(result));
	if(onView == "home"){
		getCardData(result.tag, function(err, student, imageUrl){
			student = JSON.parse(student);
			logger.debug("student is "+sys.inspect(student));
			logger.debug("image is "+imageUrl);
			if(!err){
				var studentData=ejs.render(fs.readFileSync(process.cwd()+"/views/_studentData.ejs", 'utf8'), {user: student, imageUrl: imageUrl});
				$("#studentData").html(studentData);
			}else{
				logger.error(""+err)
			}			
		});
	}
	//exec("xset dpms force on");
	//if(self._state == 10){
	//	self.stamp(result.tag);
	//}else{
	//	logger.debug("-- lock stamp");
	//}				
});

$(document).ready(function(){	
	//displayModal("ระบบกำลังทำงาน กรุณารอสักครู่","#f73d40");
	token = localStorage.getItem("api.token");
	logger.info("current token is "+token);

	$("#menu-search").click(function(e){
		e.preventDefault();
		$(".navbar-nav li").removeClass("active");
		$(this).addClass("active");
		var html=ejs.render(fs.readFileSync(process.cwd()+"/views/search.ejs", 'utf8'));
		$("#page-content").html(html);
	});

	$("#menu-home").click(function(e){
		e.preventDefault();
		$(".navbar-nav li").removeClass("active");
		$(this).addClass("active");
		var html=ejs.render(fs.readFileSync(process.cwd()+"/views/home.ejs", 'utf8'));
		$("#page-content").html(html);
		//var studentData=ejs.render(fs.readFileSync(process.cwd()+"/views/_studentData.ejs", 'utf8'));
		//$("#studentData").html(studentData);
	});

	if(token && token != ""){
		$("#login").hide();
		$("#main").fadeIn();
		$("#menu-home").trigger("click");
	}else{
		$("#login").hide();
		$("#login").fadeIn();
	}	

	$("#configForm").submit(function(e){
		e.preventDefault();
		$("#configModal").modal('hide');
	});

	$('#form-signin').submit(function(e){
		e.preventDefault();
		var b = $("#loggin-button")[0];
		var l = Ladda.create(b);
		l.start();
		var callUrl = config.api.uri+"/login";
		logger.debug("---- call to url "+callUrl);
		var data = {username: $('#username').val(), password: $('#password').val(), umd: config.umd};
		logger.debug("-- data "+sys.inspect(data));
		//alert(""+sys.inspect(data))
		needle.post(callUrl, JSON.stringify(data), {json:true}, function(error, response, body){
			var exception = false;
			if(!error){
				try{
					body = JSON.parse(body);
					token = body.token;
					if(body.code == 200){
						logger.debug("--- login success "+token);
						$("#login").hide();
						$("#main").fadeIn();
						localStorage.setItem("api.token", token);
					}else{
						logger.debug("--- login fail "+sys.inspect(body));
						$("#loggin-button").removeClass("btn-primary").addClass("btn-danger");
						$("#loggin-message").html(body.message).removeClass("hide").fadeIn();
					}
				}catch(e){
					logger.debug("--- authen parse error "+e);
					exception = true;
				}				
			}else{
				//cb({error:true, message:"connection problem", code: -1});
				logger.debug("-- error "+error.code);
			}
			l.stop();	
		});
		return false;
	});
	
});