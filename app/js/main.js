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
var token = "";

$(document).ready(function(){	
	//displayModal("ระบบกำลังทำงาน กรุณารอสักครู่","#f73d40");
	$("#login").hide();
	$("#login").fadeIn();

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