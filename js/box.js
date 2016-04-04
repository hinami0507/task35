function rnd(n, m) {
    return parseInt(Math.random() * (m - n) + n);
}
// window.onload = function() {
var oBox = document.getElementById('box');//获取棋盘
var oUl = oBox.children[1];
var txt = document.getElementById('txt');
var oBtn = document.getElementById('btn');
var c = 10;
var r = 10;

//画矩阵
for (var i = 0; i < c * r; i++) {
    var oLi = document.createElement('li');
    oUl.appendChild(oLi);
}
// 画小方块
function createbox() {
    this.cunit = 50; //横坐标单位
    this.vunit = 50; //纵坐标单位
    this.x = rnd(0, c - 1);
    this.y = rnd(0, r - 1);
    this.rotate = 0;
    this.xDir = 0;
    this.yDir = 0;
    var oBlock = document.createElement('span');
    oBox.appendChild(oBlock);
    oBlock.className = 'block';
    oBlock.id = "car";
    this.bound = function() { //边界设定
        if (this.y <= 0) this.y = 0;
        if (this.y >= (c - 1)) this.y = c - 1;
        if (this.x <= 0) this.x = 0;
        if (this.x >= (r - 1)) this.x = r - 1;
    }
    this.go = function(x, y) { //运行
        if (x) this.x += x;
        if (y) this.y += y;
        this.bound();
        oBlock.style.WebkitTransform = 'rotate(' + this.rotate + 'deg)';
        oBlock.style.left = this.cunit * this.x + 'px';
        oBlock.style.top = this.vunit * this.y + 'px';
    };
    this.keyDrive = function(key) { //按键移动
        switch (key) { //左上右下
            case 37:
                this.rotate = -90;
                this.x -= 1;
                break;
            case 38:
                this.rotate = 0;
                this.y -= 1;
                break;
            case 39:
                this.rotate = 90;
                this.x += 1;
                break;
            case 40:
                this.rotate = 180;
                this.y += 1;
                break;
        }
        this.go();
    };
    this.nowDir = function() { //判断当前方向
        var dir = Math.abs((this.rotate / 90) % 4);
        var flag = ((this.rotate / 90) % 4) / dir; //判断左右，-1为左，1为右
        switch (dir) {
            case 1: //左flag=-1和右flag=1
                this.xDir = flag;
                this.yDir = 0;
                break;
            case 2: //下
                this.yDir = 1;
                this.xDir = 0;
                break;
            case 0: //上
                this.yDir = -1;
                this.xDir = 0;
                break;
        }
    }
    this.terminal = function(sValue) { //输入框输入移动
        this.nowDir(); //确定当前方向
        switch (sValue) {
            case 'GO':
                this.go(this.xDir, this.yDir);
                break;
            case 'TRA LEF':
                this.go(-1, 0);
                break;
            case 'TRA TOP':
                this.go(0, -1);
                break;
            case 'TRA RIG':
                this.go(1, 0);
                break;
            case 'TRA BOT':
                this.go(0, 1);
                break;
            case 'MOV LEF':
                this.rotate = -90;
                this.x -= 1;
                break;
            case 'MOV TOP':
                this.rotate = 0;
                this.y -= 1;
                break;
            case 'MOV RIG':
                this.rotate = 90;
                this.x += 1;
                break;
            case 'MOV BOT':
                this.rotate = 180;
                this.y += 1;
                break;

        }
        this.go();
    }
}


var box1 = new createbox();
box1.go();

oBtn.addEventListener("click", function() {
        box1.terminal();
    })
    //通过按键来控制小方块
    /*window.addEventListener("keydown", function(event) {
        box1.keyDrive(event.keyCode);
    })
    */



var consoler_error_handler;
var consoler = document.querySelector("#consoler");
var LineNum = document.querySelector("#LineNum"); //行号
//var txt = document.querySelector("#txt"); //输入框 前边已经定义好了
var iNode = document.createElement('li'); //
var row = 1;


txt.addEventListener('input', function() {
        var arr = txt.value.split(/\n/); //当前行数
        var len = arr.length;
        console.log("当前有行：" + len);
        while (len > row) {
            row++;
            LineNum.appendChild(iNode.cloneNode(false));
        }
        while (len < row) {
            row--;
            LineNum.removeChild(LineNum.lastChild);
        }
        //延迟1秒对输入进行校验
        clearTimeout(consoler_error_handler);
        consoler_error_handler = setTimeout(function() {
            check_consoler_errors(arr);
        }, 1000);
        //保存指令
        consoler.dataset.cmd = JSON.stringify(arr);
    })
    //通过滚动调整行号
LineNum.appendChild(iNode.cloneNode(false))
txt.addEventListener('scroll', function() {
    LineNum.style.top = -txt.scrollTop + 'px';
});
//焦点移出时校验
LineNum.addEventListener('blur', function() {
    clearTimeout(consoler_error_handler);
    check_consoler_errors(JSON.parse(consoler.dataset.cmd || '[]'));
});

var reg = /^go \d{1,2}|mov (rig|top|lef|bot) \d{1,2}|tra (rig|top|lef|bot) \d{1,2}$/i;

//正则表达式校验函数
function check_consoler_errors(arr) {
    var errors = [];
    arr.forEach(function(e, index) {
        console.info(e);
        console.info(reg.test(e));
        if (!reg.test(e)) {
            errors.push(index);
            LineNum.children[index].classList.add('error');
        } else {
            LineNum.children[index].classList.remove('error');
        }
    });
    consoler.dataset.errors = JSON.stringify(errors);
}
//点击验证
var timet;
oBtn.addEventListener("click", function() {
    if (!(JSON.parse(consoler.dataset.errors || '[]').length > 0)) {
        var cmdArr = JSON.parse(consoler.dataset.cmd)
        cmdArr.forEach(function(item,index,array){
            var action = item.split(/ \d/)[0];//取得指令方法
            action = action.toUpperCase();  //全部转化为大写
            var fre = item.replace(/[^0-9]+/g, '');  //取得指令的次数
            while(fre--)
            {
                box1.terminal(action);
            }
        })
        return;
    } else {
        alert('指令格式错误，不要输入一些奇奇怪怪的东西凸(艹皿艹 )');
    }
})



