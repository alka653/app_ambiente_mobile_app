$('#load-page').click(function(){
	load_page($(this).attr('href'));
	return false;
});
function load_page(href){
	$('#content-dynamic').load(href);
}
$(document).on("click", '#login', function(event) {
	validate = validate_form();
	var username = $('#username').val();
	var password = $('#password').val();
	if(validate == false){
		alert('Por favor ingresa todos los datos');
	}else{
		send_data({'username': username, 'password': password}, 'rest-auth/login');
	}
	event.preventDefault();
});
function send_data(data, method){
	$.ajax({
		url: 'http://127.0.0.1:8000/'+method+'/',
		type: 'POST',
		dataType: "json",
		data: data,
		success: function (soapResponse){
			if(soapResponse.error){
				alert(soapResponse.error);
			}else{
				localStorage.setItem("key_user", soapResponse.key_user);
			}
		},
		error: function (SOAPResponse){
			console.log(SOAPResponse.status, SOAPResponse.responseText);
			alert('Ha ocurrido un error');
		}
	});
}
function validate_form(){
	var username = $('#username').val();
	var password = $('#password').val();
	if(!username || !password){
		return false;
	}
}