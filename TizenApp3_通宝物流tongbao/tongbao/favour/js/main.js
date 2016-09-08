var id;
var nickName;
var phone;
var location;

function searchPeople() {
	phone = $("#id").val();
	$.ajax({
		// 提交数据的类型 POST GET
		type : "POST",
		// 提交的网址
		url : "http://120.27.112.9:8080/tongbao/auth/searchDriver:",
		// 提交的数据
		datatype : "text",
		data : {
			phoneNum : phone
		},
		success : function(data) {
			if (data.result == "0") {
				alert("无司机信息");
				return 0;
			} else {
				id = data.data.id;
				nickName = data.data.nickName;
				phone = data.data.phoneNum;
				return 1;
			}

		},
		error : function() {
			alert("出错！");
		}

	});

}


function addDriver(){
	alert("添加成功！");
}
function addLocal(){
	alert("添加成功！");
}