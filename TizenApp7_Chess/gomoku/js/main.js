window.addEventListener('tizenhwkey', function(e) {
	if(e.keyName == "back") {
		try {
			tizen.application.getCurrentApplication().exit();
		} catch (error) {
			console.error("getCurrentApplication(): " + error.message);
		}
	}
},false);