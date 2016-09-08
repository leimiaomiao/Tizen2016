var token;
var id;
function regretOrder(){
	alert("申请已提交，请耐心等待");
}

function endOrder(){
	
	alert("完成订单！等待账目扣款");
}
function deleteOrder() {
	alert("删除成功");
//	token = localStorage.getItem("token");
//	$.ajax({
//		// 提交数据的类型 POST GET
//		type : "POST",
//		// 提交的网址
//		url : "http://120.27.112.9:8080/tongbao/auth/deleteOrder:",
//		// 提交的数据
//		datatype : "text",
//		data : {
//			token : token,
//			id : id,
//		},
//		success : function(data) {
//			if (data.result == "0") {
//				alert(data.errorMsg);
//			} else {
//				alert("删除成功");
//				location.reload();
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


function checkMobile(str) {
	var re = /^1\d{10}$/
	if (re.test(str)) {
		return 0;
	} else {
		return 1;
	}
}