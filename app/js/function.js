function displayModal(message, color){
	$("#base-modal").find(".modal-body p").text(message);	
	if(color){
		$("#base-modal").find(".modal-content").css({backgroundColor: color});
	}
	$("#base-modal").modal('show');
}

function closeModal(){
	$("#base-modal").modal('hide');
	//$("#base-modal").find(".modal-body p").text("-");
	$("#base-modal").find(".modal-content").css({backgroundColor: '#E74C3C'});
}

$(document).ready(function() {
	$('#main').hide();
	$('.navbar-nav [data-toggle="tooltip"]').tooltip();
	$('.navbar-twitch-toggle').on('click', function(event) {
		event.preventDefault();
		$('.navbar-twitch').toggleClass('open');
	});

	$('.nav-style-toggle').on('click', function(event) {
		event.preventDefault();
		var $current = $('.nav-style-toggle.disabled');
		$(this).addClass('disabled');
		$current.removeClass('disabled');
		$('.navbar-twitch').removeClass('navbar-'+$current.data('type'));
		$('.navbar-twitch').addClass('navbar-'+$(this).data('type'));
	});
});