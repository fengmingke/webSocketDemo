//
var userName, socket, tbxUsername, tbxMsg, divChat, divRight;

function window_onload(){
    divChat = document.getElementById('divchat');
    tbxUsername = document.getElementById('tbxUsername');
    tbxMsg = document.getElementById('tbxMsg');
    divRight = document.getElementById('divRight');
    tbxUsername.focus();
    tbxUsername.select();
}

function AddMsg(msg){
    divChat.innerHTML += msg + '<br/>';
    if(divChat.scrollHeight > divChat.clientHeight){
        divChat.scrollTop = divChat.scrollHeight - divChat.clientHeight;
    }
}

function btnLogin_onclick(){
    if(tbxUsername.value.trim() == ''){
        AddMsg('请输入用户名！');
        return;
    }
    userName = tbxUsername.value.trim();
    // socket = io.connect();
    // socket = io('http://websocket.coolnodejs.com/');
    socket = io('http://localhost:8361');
    socket.on('opend', function(data) {
        console.log('opend:', data);
    });
    socket.on('joined', function(data) {
        console.log('joined:', data);
    });
    socket.on('connect', function(){
        AddMsg("与聊天服务器的连接已建立...");
        socket.emit('login', userName);
        socket.on('login', function(name){
            AddMsg('欢迎用户：' + name + '　进入聊天室');
        });
        socket.on('sendClients', function(names){
            var str = "";
            names.forEach(function(name){
                str += name + "<br/>";
            });
            divRight.innerHTML = " 用户列表<br/>";
            divRight.innerHTML += str;
        });
        socket.on('chat', function(data){
            AddMsg(data.user + ' 说：' + data.msg);
        });
        socket.on('disconnect', function(){
            AddMsg(' 与聊天室服务器的连接已断开...');
            try{
                socket.disconnect();
                socket.removeAllListeners('disconnect');
            }catch(err){}
            try{
                socket.removeAllListeners('connect');
                io.sockets = {};
            }catch(err){}
            init();
            divRight.innerHTML = " 用户列表 ";
        });
        socket.on('logout', function(name){
            AddMsg(' 用户 ' + name + ' 已退出聊天室。');
        });
        socket.on('duplicate', function(){
            AddMsg(' 该用户名已被使用!');
            destroy();
            init();
        });
        socket.on('message', function (msg) {
            console.log(msg);
        });
    });
    socket.on('error', function(err){
        AddMsg(" 与聊天服务器之间的连接发送错误。");
        destroy();
    });
    // socket.emit('login', userName);
    document.getElementById("btnSend").disabled = "";
    document.getElementById("btnLogout").disabled = "";
    document.getElementById("btnLogin").disabled = true;
}

function btnSend_onclick(){
    var msg = tbxMsg.value;
    if(msg.length > 0){
        socket.emit('chat', {user: userName, msg: msg});
        tbxMsg.value = "";
    }
}

function btnLogout_onclick(){
    socket.emit('logout', userName);
    destroy();
    AddMsg(" 用户 " + userName + " 退出聊天室: ");
    divRight.innerHTML = " 用户列表 ";
    init();
}

function window_onunload(){
    socket.emit('logout', userName);
    socket.disconnect();
}

function init(){
    document.getElementById('btnSend').disabled = true;
    document.getElementById('btnLogout').disabled = true;
    document.getElementById('btnLogin').disabled = "";
}

function destroy(){
    try{
        socket.disconnect();
        socket.removeAllListeners('connect');
        io.sockets = {};
    }catch(err){}
}
