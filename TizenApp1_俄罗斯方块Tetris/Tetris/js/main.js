//定义基础变量
var w,h,map=[],next_map=[],pos=pos_pre={x:0,y:0,s_style:0,rotate:0},
	next={s_style:0,rotate:0},score;
//维护图形数据(8种图形，每种图形包含旋转图形)
var data = [
			[ [[1,2],[3,4]] ],
			[ [[1],[2]] , [[1,2]] ],
			[ [[1,2,0],[0,3,4]] , [[0,1],[2,3],[4,0]] ],
			[ [[0,1,2],[3,4,0]] , [[1,0],[2,3],[0,4]] ],
			[ [[0,1,0],[2,3,4]] , [[0,1],[2,3],[0,4]] , [[1,2,3],[0,4,0]] , [[1,0],[2,3],[4,0]] ],
			[ [[1,2],[3,0],[4,0]] , [[1,0,0],[2,3,4]] , [[0,1],[0,2],[3,4]] , [[1,2,3],[0,0,4]] ],
			[ [[1,2],[0,3],[0,4]] , [[1,2,3],[4,0,0]] , [[1,0],[2,0],[3,4]] , [[0,0,1],[2,3,4]] ],
			[ [[1,2,3,4]] , [[1],[2],[3],[4]] ]	
			];
//8种图形
var s_size = 8;
var run;

function showEnd(status){
	if(status == 1){
		$('.alert').show();
	}
	else{
		$('.alert').hide();
	}
}

function start(){
	//隐藏提示界面
	showEnd(0);
	//初始变量数据
	score = 0;
	w = 10;
	h = 17;
	//清除图形
	clear_map_data();
	clear_next_map_data();
	clear_allmap();
	//设置初始图形
	new_pos();
	new_next();
	//绘制图形
	update_map();
	update_next_map();
}

function end(){
	clearInterval(run);
	showEnd(1);
}

function new_pos(){
	pos=pos_pre={x:3,y:0,s_style:~~(Math.random()*s_size),rotate:0};
}

function new_next(){
	next={s_style:~~(Math.random()*s_size),rotate:0};	
}

function clear_map_data(){
	for(var i=0;i<h;i++){
		map[i] = [];
		for(var j=0;j<w;j++){
			map[i][j] = 0;
		}
	}
}

function clear_next_map_data(){
	for(i=0;i<4;i++){
		next_map[i] = [];
		for(j=0;j<4;j++){
			next_map[i][j] = 0;
		}
	}
}

function clear_allmap(){
	$('.max_table td.active').removeClass();
	$('.min_table td.active').removeClass();
}

function map_add(model){
	var x = model.x;
	var y = model.y;
	var shape = data[model.s_style][model.rotate];
	var row = shape.length;
	var col = shape[0].length;
	var temp = 0;
	for(i=0;i<row;i++){
		for(j=0;j<col;j++){
			if(shape[i][j] != 0){
				temp = y-row+1+i;
				if(temp >=0){
					map[temp][x+j] = shape[i][j];
				}
			}
		}
	}
}

function map_remove(model){
	var x = model.x;
	var y = model.y;
	var shape = data[model.s_style][model.rotate];
	var row = shape.length;
	var col = shape[0].length;
	var temp = 0;
	for(var i=0;i<row;i++){
		for(var j=0;j<col;j++){
			if(shape[i][j] != 0){
				temp = y-row+1+i;
				if(temp >=0){
					map[temp][x+j] = 0;
				}
			}
		}
	}
}

function map_paint(){
	var td = 0;
	for(var i=0;i<h;i++){
		for(var j=0;j<w;j++){
			td = $('.max_table tr:eq('+i+') td:eq('+j+')');
			td.removeClass();
			if(map[i][j] != 0){
				td.addClass('active color-'+map[i][j]);	
			}
		}
	}
}

function update_map(){
	//清除之前位置的图形存储的数据
	map_remove(pos_pre);
	//添加当前图形需要存储的数据
	map_add(pos);
	//重新绘制
	map_paint();
}

function update_next_map(){
	var shape = data[next.s_style][next.rotate];
	var row = shape.length;
	var col = shape[0].length;
	//更新next_map数据
	clear_next_map_data();
	var x=0,y=0,td=0;
	if(col < 3){
		x = 1;
	}
	if(row < 3){
		y = 1;
	}
	for(i=0;i<row;i++){
		for(j=0;j<col;j++){
			if(shape[i][j] != 0){
				next_map[y+i][x+j] = shape[i][j];
			}
		}
	}
	//重新绘制
	for(i=0;i<4;i++){
		for(j=0;j<4;j++){
			td = $('.min_table tr:eq('+i+') td:eq('+j+')');
			td.removeClass();
			if(next_map[i][j] != 0){
				td.addClass('active color-'+next_map[i][j]);	
			}
		}
	}
}

function rotate(){
	//有可旋转的图形
	var rotate_size = data[pos.s_style].length;
	if(rotate_size > 1){
		if(rotateCheck()){
			pos_pre = {x:pos.x,y:pos.y,s_style:pos.s_style,rotate:pos.rotate};
			pos.rotate = (pos.rotate+1)%rotate_size;
			//判断是否超出右边 需要调整x
			var shape = data[pos.s_style][pos.rotate];
			var x = pos.x,y=pos.y;
			var col = shape[0].length;
			var max = getMaxX(x,y,pos_pre);
			if(x+col-1 > max){
				pos.x = max-col+1;
			}
			update_map();
		}
	}
}

function left(){
	if(leftCheck()){
		pos_pre = {x:pos.x,y:pos.y,s_style:pos.s_style,rotate:pos.rotate};
		pos.x--;
		update_map();
	}
}

function right(){
	if(rightCheck()){
		pos_pre = {x:pos.x,y:pos.y,s_style:pos.s_style,rotate:pos.rotate};
		pos.x++;
		update_map();
	}
}

function down(){
	if(downCheck()){
		pos_pre = {x:pos.x,y:pos.y,s_style:pos.s_style,rotate:pos.rotate};
		pos.y++;
		update_map();
	}else{
		//到头 检测是否可以消除行
		merge();
		next_turn();
	}
}

function rotateCheck(){
	var rotate_size = data[pos.s_style].length;
	var shape = data[pos.s_style][(pos.rotate+1)%rotate_size];
	var x = pos.x,y=pos.y;
	var col = shape[0].length;
	var max = getMaxX(x,y,pos);
	if(x+col-1 > max){
		x = max-col+1;
	}
	if(x < 0){
		return false;
	}
	return check(x,y,shape);
}

//获取以当前图形坐标 x,y点为基础，其最右边的空格点的x坐标，若无空格点即为x 
function getMaxX(x,y,shape){
	var max = x;
	map_remove(shape);
	for(var i=x+1;i<map[y].length;i++){
		if(map[y][i] != 0){
			max = i-1;
			break;
		}
		if(i == map[y].length-1){
			max = i;
		}
	}
	map_add(shape);
	return max;
}

function leftCheck(){
	var shape = data[pos.s_style][pos.rotate];
	var x = pos.x-1,y=pos.y;
	if(x < 0){
		return false;
	}
	return check(x,y,shape);
}

function rightCheck(){
	var shape = data[pos.s_style][pos.rotate];
	var x = pos.x+1,y=pos.y;
	if(x > w-1){
		return false;
	}
	return check(x,y,shape);
}

function downCheck(){
	var shape = data[pos.s_style][pos.rotate];
	var x = pos.x,y=pos.y+1;
	if(y >= h){
		return false;
	}
	return check(x,y,shape);
}

//检验x，y处是否可以放置图形
function check(x,y,shape){
	var row = shape.length;
	var col = shape[0].length;
	//清楚当前位置
	map_remove(pos);
	//模拟往下检验
	for(i=0;i<row;i++){
		for(j=0;j<col;j++){
			if(shape[i][j] != 0){
				temp = y-row+1+i;
				if(temp >= 0 && map[temp][x+j] != 0){
					//添加当前位置
					map_add(pos);
					return false;
				}
			}
		}
	}
	//添加当前位置
	map_add(pos);
	return true;
}

//消除行
function merge(){
	var r_merge = [];
	var check = true;
	var tr = "";
	for(var i=0;i<h;i++){
		check = true;
		for(var j=0;j<w;j++){
			if(map[i][j] == 0){
				check = false;
				break;
			}
		}
		if(check){
			r_merge[r_merge.length] = i;
			var temp = [];
			//构造空行
			tr += "<tr>";
			for(var k=0;k<w;k++){
				tr += "<td></td>";
				temp[temp.length] = 0;
			}
			tr += "</tr>";
			//修改map数据
			map.splice(i,1);
			map.unshift(temp);
			//标记删除行
			$('.max_table tr:eq('+i+')').addClass('delete');
		}
	}
	//消除
	var r_size = r_merge.length;
	score += r_size*(100+20*r_size);	
	$('.max_table .delete').remove();
	$('.max_table tbody').prepend(tr);
	$('.score').html(score);
}

//下一个图形准备
function next_turn(){
	pos_pre = {x:3,y:0,s_style:next.s_style,rotate:next.rotate};
	pos = {x:3,y:-1,s_style:next.s_style,rotate:next.rotate};
	if(downCheck()){
		pos.y++;
		new_next();
		update_map();
		update_next_map();
	}
	else{
		end();
	}
}

function go(){
	start();
	run = setInterval(down,400);
}

var t,l,r,d;
function speed(event){
	if(event.data == 't'){
		t = setInterval(rotate,100);
	}
	if(event.data == 'l'){
		l = setInterval(left,100);
	}
	if(event.data == 'r'){
		r = setInterval(right,100);
	}
	if(event.data == 'd'){
		d = setInterval(down,100);
	}
}
function unspeed(event){
	if(event.data == 't'){
		clearInterval(t);
	}
	if(event.data == 'l'){
		clearInterval(l);
	}
	if(event.data == 'r'){
		clearInterval(r);
	}
	if(event.data == 'd'){
		clearInterval(d);
	}
	if(event.data == 'all'){
		clearInterval(t);
		clearInterval(l);
		clearInterval(r);
		clearInterval(d);
	}
}

$(document).on('mousedown','.key_down','d',speed);
$(document).on('mouseup','.key_down','d',unspeed);
$(document).on('mousedown','.key_top','t',speed);
$(document).on('mouseup','.key_top','t',unspeed);
$(document).on('mousedown','.key_left','l',speed);
$(document).on('mouseup','.key_left','l',unspeed);
$(document).on('mousedown','.key_right','r',speed);
$(document).on('mouseup','.key_right','r',unspeed);
$(document).on('mouseup','body','all',unspeed);

$(document).on('click','.key_top',rotate);
$(document).on('click','.key_left',left);
$(document).on('click','.key_right',right);
$(document).on('click','.key_down',down);
$(document).on('click','.restart',go);

window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    
    go();
};
