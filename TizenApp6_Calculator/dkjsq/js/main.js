var backEventListener = null;
var yhke; //月还款额
var bxhj; //本息合计
var dkys; //贷款月数
var yhkbj; //月还款本金
var sydkze;//商业贷款总额
var gjjdkze;//公积金贷款总额
var syll;//商业利率
var gjjll;//公积金利率
var dkze;//
var hkze;//
var zflxs;//
var sqfk;//
var yjhk;//
var unregister = function() {
    if ( backEventListener !== null ) {
        document.removeEventListener( 'tizenhwkey', backEventListener );
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }
    
    // TODO:: Do your initialization job
    console.log("init() called");
    
    var backEvent = function(e) {
        if ( e.keyName == "back" ) {
            try {
                if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch( ex ) {
                unregister();
            }
        }
    }
    
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener( 'tizenhwkey', backEvent );
    backEventListener = backEvent;
 
    
    var debj =function(e){
    	 $.mobile.changePage('#page2');
    	// document.getElementById("divcontrol1").innerHTML=document.getElementById("textinput1").value;
    	 cal(1);
    }
    var debx =function(e){
   	 $.mobile.changePage('#page2');
   	// document.getElementById("divcontrol1").innerHTML=document.getElementById("textinput1").value;
   	 cal(0);

   }
    
    var back =function(e){
      	 $.mobile.changePage('#page1');
      	// document.getElementById("divcontrol1").innerHTML=document.getElementById("textinput1").value;
      	
      }
    
    $("#button_debj").bind("click",debj);
    
    $("#button_debx").bind("click", debx);
    
    $("#button_back").bind("click", back);
    
    
};

//本金还款的月还款额(参数: 年利率 / 贷款总额 / 贷款总月份 / 贷款当前月0～length-1)
function getMonthMoney2(lilv, total, month, cur_month){
	var lilv_month = lilv / 12;//月利率
	//return total * lilv_month * Math.pow(1 + lilv_month, month) / ( Math.pow(1 + lilv_month, month) -1 );
	var benjin_money = total / month;
	return (total - benjin_money * cur_month) * lilv_month + benjin_money;
}

//本息还款的月还款额(参数: 年利率/贷款总额/贷款总月份)
function getMonthMoney1(lilv, total, month){
	if(total==0){
		return 0;
	}
	var lilv_month = lilv / 12;//月利率
	return total * lilv_month * Math.pow(1 + lilv_month, month) / ( Math.pow(1 + lilv_month, month) -1 );
}

function format(money){
	return Math.round(money * 100) / 100 ;
}

//验证是否为数字
function reg_Num(str){
	if (str.length == 0){return true;}
	var Letters = "1234567890.";

	for(i = 0; i < str.length; i++){
		var CheckChar = str.charAt(i);
		if (Letters.indexOf(CheckChar) == -1){return false;}
	}
	return true;
}


function cal(flag){

	var years = document.getElementById("jsq_ns").value;
	var month =document.getElementById("jsq_ns").value * 12;

	sydkze=document.getElementById("jsq_sy").value;
	gjjdkze=document.getElementById("jsq_gjj").value;
	syll=document.getElementById("jsq_syll").value;
	gjjll=document.getElementById("jsq_gjjll").value;
	dkze=document.getElementById("jsq_dkze");
	hkze=document.getElementById("jsq_hkze");
	zflxs=document.getElementById("jsq_zflxs");
	sqfk=document.getElementById("jsq_sqfk");
	yjhk=document.getElementById("jsq_yjhk");
	dkys=document.getElementById("jsq_dkys");

		//--  组合型贷款(组合型贷款的计算，只和商业贷款额、和公积金贷款额有关，和按贷款总额计算无关)
		if(!reg_Num(sydkze)){alert("商贷不能为非数字");return false;}else{sydkze*=10000;}
		if(!reg_Num(gjjdkze)){alert("公积金不能为非数字");return false;}else{gjjdkze*=10000;}
		if(!reg_Num(years)||years.length==0){alert("贷款年数不能为空和非数字！");return false;}
		
		
//
//
		var total_sy;
		var total_gjj;
		if(sydkze.length==0){
			total_sy=0;
			syll=0;
		}else{	
			total_sy = parseInt(sydkze);
		}
			
		if(gjjdkze.length==0){
			total_gjj=0;
			gjjll=0;
		}else{
			
			total_gjj = parseInt(gjjdkze);
		}
		
		if(total_sy!=0&&(!reg_Num(syll)||syll.length==0)){
			alert("商业贷款利率不能为空和非数字！");
			return false;
		}
		
		if(total_gjj!=0&&(!reg_Num(gjjll)||gjjll.length==0)){
			alert("公积金贷款利率不能为空和非数字！");
			return false;
		}
		
	//贷款总额		
		var daikuan_total = total_sy + total_gjj;
		dkze.innerHTML = daikuan_total+ "(元)";

		//月还款
		var lilv_sd = syll / 100;//得到商贷利率
		var lilv_gjj = gjjll / 100;//得到公积金利率

		//1.本金还款
			//月还款
		if(flag==1){
			var all_total2 = 0;
			var month_money2 = "";
			var huankuan;
			var shengyu=daikuan_total;
			for(j = 0; j < month; j++){
				//调用函数计算: 本金月还款额
				huankuan_sy=getMonthMoney2(lilv_sd, total_sy, month, j);
				huankuan_gjj=getMonthMoney2(lilv_gjj, total_gjj, month, j);
				huankuan = huankuan_sy +huankuan_gjj;
				all_total2 += huankuan;
				huankuan_sy=Math.round(huankuan_sy*100)/100;
				huankuan_gjj=Math.round(huankuan_gjj*100)/100;
				huankuan = Math.round(huankuan * 100) / 100;
				//fmobj.month_money2.options[j] = new Option( (j + 1) +"月," + huankuan + "(元)", huankuan);
				shengyu-=total_sy/month+total_gjj/month;
				shengyu_1=Math.round(shengyu * 100) / 100;
				month_money2 += "<option>"+(j + 1) + "月,还" + huankuan + "元"+"(商"+huankuan_sy+",公"+huankuan_gjj+") 剩"+shengyu_1+"元</option>";
			}
			yjhk.innerHTML = "<select>"+month_money2+"</select>";
			//还款总额
			hkze.innerHTML = Math.round(all_total2 * 100) / 100+ "(元)";
			//支付利息款
			zflxs.innerHTML = Math.round((all_total2 - daikuan_total) * 100) / 100+ "(元)";
			sqfk.innerHTML=Math.round((getMonthMoney2(lilv_sd, total_sy, month, 1) + getMonthMoney2(lilv_gjj, total_gjj, month, 1)) * 100) / 100+ "(元)";
		}else{
		//2.本息还款
			//月均还款
			var huankuan_sy=getMonthMoney1(lilv_sd, total_sy, month);
			var huankuan_gjj=getMonthMoney1(lilv_gjj, total_gjj, month);
			var huankuan = huankuan_sy +huankuan_gjj ;
			var shengyu_sy=total_sy;
			var shengyu_gjj=total_gjj;
			var eachmonth;
			for(i=0;i<month;i++){
				sy_lx=shengyu_sy*lilv_sd/12;
				gjj_lx=shengyu_gjj*lilv_gjj/12;
				sy_bj=huankuan_sy-sy_lx;
				gjj_bj=huankuan_gjj-gjj_lx;
				shengyu_sy-=sy_bj;
				shengyu_gjj-=gjj_bj;
				shengyu_total=format(shengyu_sy+shengyu_gjj);
				eachmonth += "<option>"+(i + 1) + "月,还" + format(huankuan) + "元"+"(商"+format(huankuan_sy)+",公"+format(huankuan_gjj)+") 剩"+shengyu_total+"元</option>";

			}
			yjhk.innerHTML = "<select>"+eachmonth+"</select>";;
			
			var month_money1=getMonthMoney1(lilv_sd, total_sy, month)+getMonthMoney1(lilv_gjj, total_gjj, month);
			//还款总额
			var all_total1 = month_money1 * month;
			hkze.innerHTML = Math.round(all_total1 * 100) / 100+ "(元)";
			//支付利息款
			zflxs.innerHTML = Math.round((all_total1 - daikuan_total) * 100) / 100+ "(元)";
			sqfk.innerHTML= Math.round(month_money1 * 100) / 100+ "(元)";
		}
		
		dkys.innerHTML=month+ "(月)";
		//document.getElementById("jsq_yjhk").innerHTML="hello world!";
}


$(document).bind( 'pageinit', init );
$(document).unload( unregister );
