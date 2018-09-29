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

var userInfo = {name: "Guest",isPlayer1:false,isPlayer2:false}; 


connectedRef.on("value", function(snap) {
    if (snap.val()) {
        var text =`${userInfo.name} connected!`;
        chatRef.push(text);
        console.log(text);
        var user = connectionsRef.push(userInfo);
        user.onDisconnect().remove();
    }
});


$(document).on('click','#save-name',function() {
    event.preventDefault();
    var name = $('#player-name').val().trim();
    console.log(name);
    connectionsRef.set({
        name:name,
        isPlayer1:true,
    })
})

$(document).on('click','#chat-submit',function() {
    event.preventDefault();
    var text = $('#chat-text').val().trim();
    chatRef.push(`${userInfo.name}: ${text}`);
    $('#chat-text').val('');
})
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