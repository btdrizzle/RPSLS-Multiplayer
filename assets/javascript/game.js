var config = {
    apiKey: "AIzaSyCxaYWa6n_TP1_JZV5XGcJBZeDrwwdLSx8",
    authDomain: "rpsls-2d398.firebaseapp.com",
    databaseURL: "https://rpsls-2d398.firebaseio.com",
    projectId: "rpsls-2d398",
    storageBucket: "rpsls-2d398.appspot.com",
    messagingSenderId: "445764066556"
  };
  firebase.initializeApp(config);
var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var chatRef = database.ref("/chat");
var playerRef1 = database.ref("/Player1");
var playerRef2 = database.ref("/Player2");

localStorage.clear();
var userInfo = {name: "Guest",player:"none"}; 
localStorage.setItem('name',userInfo.name);

//connectedRef.on("value", function(snap) {
  //  if (snap.val()) {
    //    var text =`${localStorage.getItem('name')} connected!`;
      //  chatRef.push(text);
     //   console.log(text);
       // var con = connectionsRef.push(true);
       // con.onDisconnect().remove();
    //}
//});
var uploadPlayer;

$(document).on('click','#save-name',function() {
    event.preventDefault();
    var newName = $('#player-name').val().trim();
    var oldName = localStorage.getItem('name');
    userInfo.name = newName;
    console.log(userInfo.name);
    chatRef.push(`${oldName} changed name to ${userInfo.name}`);
    localStorage.setItem('name',userInfo.name);
    $('#player-name').val('');
    
    //Now to look at the info in the database
    database.ref().once('value')
        .then(function(dataSnapshot) {
            var p1 = dataSnapshot.child("Player1").exists();
            var p2 = dataSnapshot.child("Player2").exists()
            if(!p1 && !p2) {
                userInfo.player = "Player 1";
                localStorage.setItem('player',userInfo.player);
                chatRef.push(`${localStorage.getItem('name')} is now ${localStorage.getItem('player')}`);
                var record = {wins:0,losses:0};
                uploadPlayer = playerRef1.update(record);
                playerRef1.onDisconnect().remove(); 
                
            }
  });

})
// This is all chat info.  Creating chat, adding to chat, etc.
$(document).on('click','#chat-submit',function() {
    event.preventDefault();
    var text = $('#chat-text').val().trim();
    chatRef.push(`${localStorage.getItem('name')}: ${text}`);
    $('#chat-text').val('');
})
//This populates the chat box at page open and at each chat addition
chatRef.on("child_added", function(childSnapshot) {
    var p = $('<p>');
    p.append(childSnapshot.val());
    $('#chat').append(p);
    $('#chat').stop().animate({
        scrollTop: $("#chat")[0].scrollHeight
      }, 800);
});

var RPSLS = [{Rock : 1}, {Spock : 2}, {Paper : 3}, {Lizard : 4}, {Scissors : 5}];
var player1Choice;
var player2Choice;

//If there is a player 1 and a player 2:

function createButtons() {
    //If I am player 1 or player 2
    RPSLS.forEach(function(choice) {
        var choices = Object.keys(choice);
        choices.forEach(function(key) {
            var button = $('<button>');
            button.addClass('btn btn-dark');
            button.attr('data-name',key);
            button.attr('data-value',choice[key]);
            //button attr for player 1 or player 2


        })
    })
}

$(document).on('click','.button',function() {

})

function RPSLS() {
   var answer = ((player1Choice - player2Choice) + 5) % 5;
    
   if(answer === 0) {
       // The game is a tie!
   }
   else if(answer === 1 || answer === 2) {
       //Player 1 wins!
   }
   else {
       //Player 2 wins!
   }

    

}