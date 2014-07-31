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

var reader = Reader.init("/dev/ttyUSB0", "test");
reader.on(Reader.Event.Connected,function(){
	logger.info("-- success start reader");		  			
}).on(Reader.Event.Error,function(){
	logger.info("-- error to connect "+port);
	//self.changeStatus("reader", false);
}).on(Reader.Event.Data, function(result){
	logger.debug("-- received card "+result.tag)
	logger.verb(sys.inspect(result));
	//exec("xset dpms force on");
	//if(self._state == 10){
	//	self.stamp(result.tag);
	//}else{
	//	logger.debug("-- lock stamp");
	//}				
});

$(document).ready(function(){	
	//displayModal("ระบบกำลังทำงาน กรุณารอสักครู่","#f73d40");
	//localStorage.setItem("config.api", "Smith");
	$("#login").hide();
	$("#login").fadeIn();
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

	$("#menu-search").click(function(e){
		e.preventDefault();
		$(".navbar-nav li").removeClass("active");
		$(this).addClass("active");
		var html=ejs.render(fs.readFileSync(process.cwd()+"/views/search.ejs", 'utf8'));
		$("#page-content").html(html);
	});
});