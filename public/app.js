var config = {
                // firebase config!!!
              };
              firebase.initializeApp(config);
            
            
//var console = document.getElementById('console');
var database = firebase.database();
var storage = firebase.storage();
var MessageRef = database.ref('message');
var key = MessageRef.push().key;
//var update = {};
//update[key] = {
//    userName: 'yongijn',
//    message: 'Helloworld!!'
//}
     
var list = document.getElementById("msg-list")
var sendButton = document.getElementById('send');
var textInput = document.getElementById('message');
var userNickname = "익명";
var fileButton = document.getElementById("file-upload");
var coinNum = 0;

var availableTags = [
        { label: "/사진 url", value: "/사진 " },
        { label: "/파일", value: "/파일" },
        { label: "/shrug", value: "/shrug" },
        { label: "/비트코인 + 비트 | 남은 코인 수 : " + coinNum, value: "/비트코인 " },
    ];

$("#file-upload").hide();

fileButton.addEventListener('change', function(e) {
    var file = e.target.files[0];
    
    var storageRef = storage.ref("/files/"+ file.name + makeid());
    
    var updateTask = storageRef.put(file);
    
    updateTask.on('state_changed', function (snapshot) {
        
    }, function(err) {
        
    }, function() {
        var downloadUrl = updateTask.snapshot.downloadURL;
        //console.log(downloadUrl);
        
        MessageRef.push({
        userName: userNickname,
        message: "/사진 " + downloadUrl
    });
        
    })
})


//MessageRef.once('value', snap => { 
//    console.log('key: ' + JSON.stringify(snap.key))
//    console.log('val: '+ JSON.stringify(snap.val(), undefined, 2))
//    console.log('numChiled: ' + JSON.stringify(snap.numChildren()));
//    snap.forEach(function(item) {
//        console.log(item.val().message);
//        addMessage(item.val().userName, item.val().message)
//    })
//    });

//메세지 리스너
MessageRef.on('child_added', snap => {
    //console.log('child_added: ' + JSON.stringify(snap.val()));
    if (snap.val().userName == "--sys-trigger-adding-bit")
        {
            console.log('coin added!' + coinNum);
            updateCoin(Number(snap.val().message));
            snap.ref.remove();
            return;
        }
    
    if (snap.key.includes('666666')) {
        list.innerHTML = '';
        addMessage(snap.val().userName, snap.val().message);
        snap.ref.remove();
        return;
        
    }
    addMessage(snap.val().userName, snap.val().message);
});
            

                

function sendText () {
    
    if (textInput.value == '' ) {
        return;
    }
    
        
    if(textInput.value.includes('/파일')) {
        $('#file-upload').trigger('click');
        $('#message').val('');
        
        return;
    }
    
    if(textInput.value.includes('--addCoins')) {
        var num = textInput.value.replace('--addCoins ', "");
        if (isnum(num)) {
            mineCoin(num);   
        }
        $('#message').val('');
        return;
    }
    
     if(textInput.value.includes("/비트코인 ")) {
         var bitNum = textInput.value.replace("/비트코인 ", "");
         if (!isnum(bitNum)) {
             alert('숫자를 입력해주세요');
             $('#message').val('/비트코인 ');
             return;
         }
         
         if(hasCoin(Number(bitNum))) {
             updateCoin(-(bitNum));
         } else {
             alert('코인이 부족해요');
             textInput.value = "/비트코인 "
             return;
         }
         
     }
    
    if(textInput.value.includes("/rainbow ")) {
        if(hasCoin(100)) {
            updateCoin(-100);
        } else {
            alert('코인이 부족해요');
            return;
            
        }
    }
    
    if (textInput.value == '---deleteAll') {
        var tempId = '666666' + makeid();
        MessageRef.set({[tempId] :{
            userName: '¯\\_(ツ)_/¯',
            message: '/사진 http://blogimgs.naver.net/sticker/xhdpi/brown_special/original/16.png'
        }});
        $('#message').val('');
        
        return;
    }
    
    
    MessageRef.push({
        userName: userNickname,
        message: textInput.value
    })
        
    $('#message').val('');
              
}

function addMessage(user,text) {
        
    if (user.includes('--sys-msg')) {
        alertNicknameModification(text);
        return;
    }
    
    if(text.includes('--sys-msg')) {
        return;
    }
    
    if(text.includes('/비트코인 ')) {
        var punsunNum = text.replace("/비트코인 ", "");
        addPungsun(user, punsunNum);    
        return;
    }
    
    
    if(text.includes('/사진 ')) {
        addImage(user, text);
        return;
    }

    
    if(text.includes('/rainbow ')) {
        rainbowText(user, text.replace("/rainbow ", ""))
        return;
    }
    
    if(text.includes('/shrug')) {
        text = text.replace("/shrug", "¯\\_(ツ)_/¯");   
    }
    
    if(user.includes('--sys-bit-mining')) {
        alertCoinMined(text);
        return;
    }
    
    addPlainText(user, text);
    
}

function addPlainText(user, text) {
    var msgElement = document.createElement("div");
    var name = document.createElement('h4');
    name.textContent = user;
    var msg = document.createElement("h3");
    msg.textContent = text
    msgElement.appendChild(name);
    msgElement.appendChild(msg);
    list.appendChild(msgElement);
//    msgElement.scrollIntoView(false);
//    sendButton.scrollIntoView(false);
    list.scrollTop = list.scrollHeight;   
}


function rainbowText(user, text) {
    var msgElement = document.createElement("div");
    var name = document.createElement('h4');
    name.textContent = user;
    var msg = document.createElement("h3");
    msg.textContent = text
    msgElement.appendChild(name);
    msgElement.appendChild(msg);
    msgElement.classList.add('rainbow');
    list.appendChild(msgElement);

    list.scrollTop = list.scrollHeight;   
}
   
function addImage(user, url) {
    var imgDiv = document.createElement('div');
    var name = document.createElement('h4');
    name.textContent = user;
    var imgUrl = document.createElement('IMG');
    imgUrl.src = url.replace('/사진 ', '');
    imgUrl.classList.add('url-img');
    imgDiv.appendChild(name);
    imgDiv.appendChild(imgUrl);

    list.appendChild(imgDiv);
    var extraDiv = document.createElement('h8');
    list.appendChild(extraDiv);
    list.scrollTop = list.scrollHeight;   
}

function addFile(user) {
    $('input[type=file]').trigger('click');
}

function addPungsun(user, text) {
    var coinCount = Number(text);
    var imgDiv = document.createElement('div');
    var ballon = document.createElement('IMG');
    var msg = document.createElement('h3');
    msg.innerHTML = "<b>"+ user+ "</b>" + '님이  <b>' + text + '</b> BTC를 보냈습니다!';

    msg.classList.add('ballon-msg');
    ballon.src = 'http://image.zdnet.co.kr/2013/11/04/czaD8pqbEJkRjYit7IUE.jpg';
    
    if (coinCount >= 300) {
        ballon.src = 'http://media.breitbart.com/media/2017/03/PepeCurrency.png';
    } else if (coinCount == 100) {
        ballon.src = 'https://bitcoinworldwide-sck3mmmykcclwuk6.netdna-ssl.com/wp-content/themes/kepler/img/home/profit.png'
    } else if (coinCount == 10) {
       ballon.src = "https://bitcoinworldwide-sck3mmmykcclwuk6.netdna-ssl.com/wp-content/uploads/2017/03/coins2.png"   
    } else if (coinCount > 0 && coinCount < 10) {
        ballon.src = 'https://www.weusecoins.com/images/bitcoinicons/coins.png'
    } else if (coinCount == 0) {
        msg.innerHTML = "<b>"+ user+ "</b>" + '님이  <b>' + '마음만 보냈습니다!';
        ballon.src = 'https://thetab.com/blogs.dir/35/files/2017/05/pepedankmeems420blazeitohbabyatripledankaestheticafkeepit100.jpg'
    }
    
    ballon.classList.add('ballon-img');
    imgDiv.appendChild(ballon);
    imgDiv.appendChild(msg);
    list.appendChild(imgDiv);

    list.scrollTop = list.scrollHeight;
}

$("#message").keypress(function(event){
    if (event.which == 13 || event.which == 10)
        {
            event.preventDefault();
            $("#send").click();
        }
    })

$(".toggle-icon").click(function () {
    if($("#msg-list").hasClass('message-list')){
        $("#header").hide();
        $("#header").removeClass('animated fadeInDown');
        $("#msg-list").removeClass('message-list');
        $("#msg-list").addClass("message-list-full");
    }
    else {
        $("#header").show();
        $("#header").addClass('animated fadeInDown');
        $("#msg-list").addClass('message-list');
        $("#msg-list").removeClass("message-list-full");
        list.scrollTop = list.scrollHeight;
    }

});

$(".name-modify").click(function() {
    var changedName = prompt("닉네임 변경", userNickname);
    if (userNickname == changedName || changedName == null || changedName == "") {
        return;
    }
    
    MessageRef.push({
        userName: '--sys-msg',
        message: "\"" + userNickname +"\"" +'님이 ' + "\"" + changedName +"\""+ '님으로 변경되었습니다.'
    });
    
    userNickname = changedName;
});

$(".logo-img").click(function() {
    $('#file-upload').trigger('click');
    
})

function alertNicknameModification(text) {
     if(text.includes('--sys-msg')) {
        return;
    }
    var sysMsgElement = document.createElement("div");
    var msg = document.createElement('h5');
    msg.textContent = text
    msg.classList.add("sys-msg");
    sysMsgElement.appendChild(msg);
    list.appendChild(sysMsgElement);
    list.scrollTop = list.scrollHeight;   
};

function mineCoin(text) {
    MessageRef.push({
        userName: '--sys-trigger-adding-bit',
        message: text
    });
    
    MessageRef.push({
        userName: '--sys-bit-mining',
        message: text + ' BTC가 채굴되었습니다.'
    });
};

function alertCoinMined (text) {
  var imgDiv = document.createElement('div');
    var ballon = document.createElement('IMG');
    var msg = document.createElement('h3');
    msg.innerHTML = text;
    msg.classList.add('sys-msg');
    var rand = Math.floor((Math.random()*10));
    if (rand < 8) {
        ballon.src = 'https://fs.bitcoinmagazine.com/img/images/algorithmic-improvements-give-bitcoin-mining-a.width-800.jpg'
    } else {
        ballon.src = 'https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAc_AAAAJDU3MmJjMmNhLTQyZmItNGFjMi1hMTc2LTQ1M2RiYmE2ZDNhZg.png'
    }
    ballon.classList.add('ballon-img');
    imgDiv.appendChild(ballon);
    imgDiv.appendChild(msg);
    list.appendChild(imgDiv);

    list.scrollTop = list.scrollHeight;  
}

function updateCoin(num) {
    coinNum += num;
    availableTags[3].label = "/비트코인 + 비트 | 남은 코인 수 : " + coinNum;
}

function hasCoin(num) {
    if ( 0 <= num && num <= coinNum ) {
        return true;
    } else {
        return false;
    }
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

function clearChat() {
     list.innerHTML = '';
}



function isnum (num) { return /^\d+$/.test(num); };

$( function() {
    
    $( "#message" ).autocomplete({
      source: availableTags,
    position: { my : "right bottom", at: "right top" }
    });
  } );