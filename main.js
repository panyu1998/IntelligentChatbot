
function robotSendMsg(msg) {
    var li = document.createElement('li');
    li.className = 'message-list__item message-list__item-robot'
    var childNode = document.createElement('div')
    childNode.innerText = msg
    li.appendChild(childNode)
  
    var msgList = document.getElementsByClassName('message-list')[0];
    msgList.appendChild(li);
  }
  
  function selfSendMsg(msg) {
    var li = document.createElement('li');
    li.className = 'message-list__item message-list__item-user'
    // 如果用户输入了/表情，发一张图
    if (msg === '/表情') {
      var childNode = document.createElement('img')
      childNode.src = 'http://image.dbbqb.com/GGWMG'
      li.appendChild(childNode)
    } else {
      var childNode = document.createElement('div')
      childNode.innerText = msg
      li.appendChild(childNode)
    }
  
  
    var msgList = document.getElementsByClassName('message-list')[0];
    msgList.appendChild(li);
  }
  
  function ajax(method, url, data, cb) {
  
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onreadystatechange = function() {
      // readyState 为 4 时表示已经全部接收到响应数据
      if (xhr.readyState === 4) {
        // Http 状态码大于等于 200 小于 300，或者等于 304，表示请求成功
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          cb && cb(xhr.responseText);
        } else {
          cb && cb(new Error(xhr.status));
        }
      }
    };
  
    xhr.send(data);
  }
  
  function main() {
    var sendMsgButton = document.getElementsByTagName('button')[0]
    var inputArea = document.getElementsByTagName('textarea')[0]
    var msgList = document.getElementsByClassName('message-list')[0];
  
    function sendMsg() {
      // 得到用户输入
      var userMsg = inputArea.value;
      // 将用户输入信息添加到对话列表中
      selfSendMsg(userMsg)
      // 清空用户输入信息
      inputArea.value = ''
  
      // 对话列表自动滚动到最底部
      var msgs = msgList.getElementsByTagName('li')
      msgs[msgs.length - 1].scrollIntoView()
      // 发送 Ajax 请求
      ajax(
        'GET',
        // 拼接 url
        "http://wang.norma.shop:8080/api.php?key=free&appid=0&msg=" + userMsg,
        null,
        // 数据返回的回调函数
        function (res) {
          // 错误处理
          if (res instanceof Error) {
            alert('请求失败')
          } else {
            // 获取实际对话内容，替代菲菲为小二黑
            var robotMsg = JSON.parse(res).content.replace('菲菲', '小二黑');
            // 将返回信息添加到对话列表
            robotSendMsg(robotMsg)
            // 对话列表自动滚动到最底部
            var msgs = msgList.getElementsByTagName('li')
            msgs[msgs.length - 1].scrollIntoView()
          }
        }
      )
    }
  
    sendMsgButton.addEventListener('click', sendMsg)
  
    // 输入框监听键盘事件
    inputArea.onkeydown = function(e) {
      var key = e.key
      var ctrlKey = e.ctrlKey
      var metaKey = e.metaKey
  
      // 判断是否是回车键
      if (key === 'Enter') {
  
        // 如果此时还按下了 ctrl 或者 meta 按键，触发换行逻辑
        if (ctrlKey || metaKey) {
          this.value = this.value + '\n'
          return
        }
  
        sendMsg()
      }
    }
  
  }
  main()
