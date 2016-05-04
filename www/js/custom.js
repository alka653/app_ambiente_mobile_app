url_serve = "http://192.168.43.169:8000/api/serve";
function u_serve(){
	return url_serve;
}
function load_page(href){
	$('#content-dynamic').load(href);
}
function clear_data(){
	localStorage.clear();
}
function get_data_local(){
	data = {};
	data['key_user'] = localStorage.getItem("key_user");
	data['username'] = localStorage.getItem("username");
	data['full_name'] = localStorage.getItem("full_name");
	return data;
}
function check(){
	if(localStorage.getItem("username") === null){
		href = 'login.html';
	}else{
		href = 'inicio.html';
	}
	load_page(href);
}
function send_login(username, password, method){
	var encodedString = btoa(username + ":" + password)
	$.ajax({
		type: 'GET',
		data: {},
		url: url_serve+method+'/?format=json',
		contentType: 'application/json',
		dataType: 'json',
		success: function(response){
			localStorage.setItem("key_user", response.objects[0].api_key);
			localStorage.setItem("username", response.objects[0].username);
			localStorage.setItem("full_name", response.objects[0].first_name+" "+response.objects[0].last_name);
			load_page("inicio.html");
		},
		beforeSend: function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + encodedString)
		},
		error: function(response){
			if(response.status == '401'){
				alert('Usuario y/o contraseña incorrecta');
			}else{
				alert('Ha ocurrido un error');
			}
		},
	});
}
function validate_form(){
	var username = $('#username').val();
	var password = $('#password').val();
	if(!username || !password){
		return false;
	}
}
function load_material(){
	data = get_data_local();
	var newApiString = data['username']+":"+data['key_user'];
	var endPoint = url_serve+"/tipo_material/";
	var data = JSON.stringify({});
	$.ajax({
		type: "GET",
		url: endPoint,
		data: data,
		contentType: "application/json",
		success: function(response){
			console.log(response.objects);
			$.each(response.objects, function(key, value){
				$('#material').append($("<option></option>").attr("value", value.id).text(value.nombre));
			});
		},
		error: function(data){
			alert("Ha ocurrido un error");
			console.log(data);
		},
		beforeSend: function(xhr){
			xhr.setRequestHeader("Authorization", "ApiKey "+newApiString)
		},
	});
}
$(document).on("click", '#load', function(event){
	load_page($(this).attr('href'));
	return false;
});
$(document).on("click", '#logout', function(event){
	clear_data();
	location.reload();
	return false;
});
$(document).on("click", '#login', function(event) {
	validate = validate_form();
	var username = $('#username').val();
	var password = $('#password').val();
	if(validate == false){
		alert('Por favor ingresa todos los datos');
	}else{
		send_login(username, password, '/login');
	}
	event.preventDefault();
});