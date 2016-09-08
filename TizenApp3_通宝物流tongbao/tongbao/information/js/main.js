var nickName;
var money;
var token;
var iconUrl;

window.onload = function() {
//	$("#name").text("昵称:" + localStorage.getItem("nickName"));
//	$("#balance").text("余额：" + localStorage.getItem("money") + "元");
	token = localStorage.getItem("token");
//	$("#icon").attr("src", localStorage.getItem("iconUrl"));

};

function chargeMoney() {
	var money = $("money").val();
	alert("充值成功！");
	return;
//	$.ajax({
//		// 提交数据的类型 POST GET
//		type : "POST",
//		// 提交的网址
//		url : "http://120.27.112.9:8080/tongbao/auth/recharge",
//		// 提交的数据
//		datatype : "text",
//		data : {
//			token : token,
//			money : money,
//		},
//		success : function(data) {
//			if (data.result == "0") {
//				alert(data.errorMsg);
//			} else {
//				alert("充值成功");
//				localStorage.setItem("account", money);
//				window.location.href = "information.html";
//
//			}
//		},
//		error : function() {
//			alert("false");
//		}
//
//	});

}
function modifyIconUrl() {
	iconUrl = $("#iconUrl").val();
	alert("修改成功！");
//	return;
//	$.ajax({
//		// 提交数据的类型 POST GET
//		type : "POST",
//		// 提交的网址
//		url : "http://120.27.112.9:8080/tongbao/uploadPicture",
//		// 提交的数据
//		datatype : "file",
//		data : {
//			file : iconUrl,
//		},
//		success : function(data) {
//			if (data.result == "0") {
//				alert(data.errorMsg);
//			} else {
//				alert("修改成功");
//				iconUrl = data.data;
//				localStorage.setItem("iconUrl", iconUrl);
//
//			}
//
//		},
//		error : function() {
//			alert("false");
//		}
//
//	});
}

function modifyNickName() {
	nickName = $("#nickName").val();
	alert("修改成功！");
//	return;
//	$.ajax({
//		// 提交数据的类型 POST GET
//		type : "POST",
//		// 提交的网址
//		url : "http://120.27.112.9:8080/tongbao/auth/modifyNickName",
//		// 提交的数据
//		datatype : "text",
//		data : {
//			token : token,
//			nickName : nickName,
//		},
//		success : function(data) {
//			if (data.result == "0") {
//				alert(data.errorMsg);
//			} else {
//				alert("修改成功");
//				localStorage.setItem("nickName", nickName);
//
//			}
//
//		},
//		error : function() {
//			alert("false");
//		}
//
//	});

}


function modifyPassword() {
//	var password = $("#password").val();
//	var password1 = $("#password1").val();
//	if(checkPassword(password1) == 1){
//		alert("密码格式错误，请重试");
//		return;
//	}	
	alert("修改成功！");
//	return;
//	$.ajax({
//		// 提交数据的类型 POST GET
//		type : "POST",
//		// 提交的网址
//		url : "http://120.27.112.9:8080/tongbao/auth/modifyPassword",
//		// 提交的数据
//		datatype : "text",
//		data : {
//			token : token,
//			oldPassword : password,
//			newPassword : password1,
//		},
//		success : function(data) {
//			if (data.result == "0") {
//				alert(data.errorMsg);
//			} else {
//				alert("修改成功");
//				localStorage.setItem("password", password1);
//
//			}
//
//		},
//		error : function() {
//			alert("false");
//		}
//
//	});
	

}

function checkPassword(str){
	var re = /^[\u4e00-\u9fa5A-Za-z0-9-_]{8,16}$/
		if (re.test(str)) {
			return 0;
		} else {
			return 1;
		}
}
