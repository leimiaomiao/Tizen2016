var phone;
var pswd;
var pswd1;

function onRegist() {
	phone = $("#phoneNumber").val();
	pswd = $("#password").val();
	pswd1 = $("#password1").val();
	if (checkMobile(phone) == 1) {
		alert("手机号码格式错误，请重试");
		return;
	}
	if(pswd != pswd1){
		alert("两次密码不一致，请重新输入");
		return
	}
	if(checkPassword(pswd) == 1){
		alert("密码格式错误，请重试");
		return;
	}	
	$.ajax({
		// 提交数据的类型 POST GET
		type : "POST",
		// 提交的网址
		url : "http://120.27.112.9:8080/tongbao/user/register",
		// 提交的数据
		datatype : "text",
		data : {
			phoneNumber : phone,
			password : pswd,
			type : "0"
		},
		success : function(data) {
			if (data.result == "0") {
				alert(data.errorMsg);
			} else {
				alert("注册成功");
				localStorage.setItem("phoneNumber", phone);
				localStorage.setItem("password", pswd);
				window.location.href = "login.html";

			}

		},
		error : function() {
			alert("false");
		}

	});

}
function checkPassword(str){
	var re = /^[\u4e00-\u9fa5A-Za-z0-9-_]{8,16}$/
		if (re.test(str)) {
			return 0;
		} else {
			return 1;
		}
}


function checkMobile(str) {
	var re = /^1\d{10}$/
	if (re.test(str)) {
		return 0;
	} else {
		return 1;
	}
}