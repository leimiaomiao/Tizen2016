var phone;
var pswd;

window.onload = function() {
	$("#phoneNumber").val(localStorage.getItem("phoneNumber"));
	$("#password").val(localStorage.getItem("password"));
};

function onLogin() {
	phone = $("#phoneNumber").val();
	pswd = $("#password").val();
	if (checkMobile(phone) == 1) {
		alert("手机号码格式错误，请重试");
		return;
	}
	$.ajax({
		// 提交数据的类型 POST GET
		type : "POST",
		// 提交的网址
		url : "http://120.27.112.9:8080/tongbao/user/login",
		// 提交的数据

		datatype : "text",
		data : {
			phoneNumber : phone,
			password : pswd,
			type : "0"
		},
		success : function(data) {
			if (data.result == "0") {
				alert("登陆失败，用户名或密码错误");
			} else {
				alert("登陆成功")
				localStorage.setItem("phoneNumber", phone);
				localStorage.setItem("password", pswd);
				localStorage.setItem("nickName", data.data.nickName);
				localStorage.setItem("iconUrl", data.data.iconUrl);
				localStorage.setItem("point", data.data.point);
				localStorage.setItem("money", data.data.money);
				localStorage.setItem("token", data.data.token);
				window.location.href = "index.html";

			}

		},
		error : function() {
			alert("false");
		}

	});

}

function checkMobile(str) {
	var re = /^1\d{10}$/
	if (re.test(str)) {
		return 0;
	} else {
		return 1;
	}
}