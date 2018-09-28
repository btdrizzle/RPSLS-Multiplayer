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

connectedRef.on("value", function(snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

var RPSLS = {Rock : 1, Spock : 2, Paper : 3, Lizard : 4, Scissors : 5};
var player1Choice;
var player2Choice;

$(document).on('click','.button',function() {

})

function RPSLS() {
    function calculation() {
        var answer = ((player1Choice - player2Choice) + 5) % 5;
        return answer;
    }




      
}