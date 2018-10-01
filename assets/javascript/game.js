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

//Local storage info - storing player name and if player 1 or 2
localStorage.clear();
var userInfo = {
    name: "Guest",
    player: "none"
};
localStorage.setItem('name', userInfo.name);

var uploadPlayer;

var RPSLS = [{
    Rock: 1
}, {
    Spock: 2
}, {
    Paper: 3
}, {
    Lizard: 4
}, {
    Scissors: 5
}];
var player1Choice;
var player2Choice;
var choice;
var whoAmI;

function game() {
    $('#pic').rotate({
        count: 4,
        duration: 0.6,
        easing: 'ease-out'
    });
    
    console.log(whoAmI);

    database.ref(`/${whoAmI}`).child('zchoice').update(choice);

    var answer = ((player1Choice - player2Choice) + 5) % 5;

    if (answer === 0) {
        // The game is a tie!
    } else if (answer === 1 || answer === 2) {
        //Player 1 wins!
    } else {
        //Player 2 wins!
    }
}
playerRef1.once("child_added", function (childSnapshot) {
    database.ref().once('value')
        .then(function (dataSnapshot) {
            var p1 = dataSnapshot.child("Player1").exists();
            var p2 = dataSnapshot.child("Player2").exists();
            if ((localStorage.getItem('player') === "Player1") && p2) {
                createButtons();
                var updateName = dataSnapshot.child("Player2").child("aname").val();
                $('#name2').text(updateName);
                console.log("1");
            } else if (localStorage.getItem('player') === "Player1") {
                console.log("2");
                return;
            } else if (!localStorage.getItem('player')) {
                var updateName = dataSnapshot.child("Player1").child("aname").val();
                $('#name1').text(updateName);
                console.log("3");
            } else {
                createButtons();
                var updateName = dataSnapshot.child("Player1").child("aname").val();
                $('#name1').text(updateName);
                console.log("4");
            }
        });

});
playerRef2.once("child_added", function (childSnapshot1) {
    database.ref().once('value')
        .then(function (dataSnapshot) {
            var p1 = dataSnapshot.child("Player1").exists();
            var p2 = dataSnapshot.child("Player2").exists();
            if ((localStorage.getItem('player') === "Player2") && p1) {
                createButtons();
                var updateName = dataSnapshot.child("Player1").child("aname").val();
                $('#name1').text(updateName);
                console.log("5");

            } else if (localStorage.getItem('player') === "Player2") {
                console.log("6");
                return;
            } else if (!localStorage.getItem('player')) {
                var updateName1 = dataSnapshot.child("Player2").child("aname").val();
                $('#name2').text(updateName1);
                console.log("7");
            } else {
                createButtons();
                var updateName1 = dataSnapshot.child("Player2").child("aname").val();
                $('#name2').text(updateName1);
                console.log("8");
            }
        });
});

//Make buttons for players to click to choose answers
function createButtons() {
    if ((localStorage.getItem('player') === "Player1") || (localStorage.getItem('player') === "Player2")) {
        RPSLS.forEach(function (choice) {
            var choices = Object.keys(choice);
            choices.forEach(function (key) {
                var p = $('<p>');
                var button = $('<button>');
                button.addClass('btn btn-dark');
                button.attr('data-name', key);
                button.attr('data-value', choice[key]);
                button.attr('data-player', localStorage.getItem('player'));
                button.text(key);
                p.append(button);
                if (localStorage.getItem('player') === "Player1") {
                    $('#player1Game').append(p);
                } else {
                    $('#player2Game').append(p);
                }
            })

        })
    }
}
//Player adds themselves to game
$(document).on('click', '#save-name', function () {
    event.preventDefault();
    var newName = $('#player-name').val().trim();
    var oldName = localStorage.getItem('name');
    userInfo.name = newName;
    chatRef.push(`${oldName} changed name to ${userInfo.name}`);
    localStorage.setItem('name', userInfo.name);
    $('#player-name').val('');

    //Now to look at the info in the database and determine which player 
    // the user will become
    database.ref().once('value')
        .then(function (dataSnapshot) {
            var p1 = dataSnapshot.child("Player1").exists();
            var p2 = dataSnapshot.child("Player2").exists();
            //Becomes player 1
            if (!p1 && !p2) {
                userInfo.player = "Player1";
                localStorage.setItem('player', userInfo.player);
                chatRef.set(`${localStorage.getItem('name')} is now ${localStorage.getItem('player')}`);
                var record = {
                    aname: `${localStorage.getItem('name')}`,
                    wins: 0,
                    losses: 0,
                    zchoice: ''
                };
                uploadPlayer = playerRef1.update(record);
                playerRef1.onDisconnect().remove();
                $('#name1').text(localStorage.getItem('name'));

            }
            //Becomes player 2
            else if (!p2) {
                userInfo.player = "Player2";
                localStorage.setItem('player', userInfo.player);
                chatRef.set(`${localStorage.getItem('name')} is now ${localStorage.getItem('player')}`);
                var record = {
                    aname: `${localStorage.getItem('name')}`,
                    wins: 0,
                    losses: 0,
                    zchoice: ''
                };
                uploadPlayer = playerRef2.update(record);
                playerRef2.onDisconnect().remove();
                $('#name2').text(localStorage.getItem('name'));

            }
            //Becomes player 1
            else if (!p1) {
                userInfo.player = "Player1";
                localStorage.setItem('player', userInfo.player);
                chatRef.push(`${localStorage.getItem('name')} is now ${localStorage.getItem('player')}`);
                var record = {
                    aname: `${localStorage.getItem('name')}`,
                    wins: 0,
                    losses: 0,
                    zchoice: ''
                };
                uploadPlayer = playerRef1.update(record);
                playerRef1.onDisconnect().remove();
                $('#name1').text(localStorage.getItem('name'));

            }
        });

})

// This is all chat info.  Creating chat, adding to chat, etc.
$(document).on('click', '#chat-submit', function () {
    event.preventDefault();
    var text = $('#chat-text').val().trim();
    chatRef.set(`${localStorage.getItem('name')}: ${text}`);
    $('#chat-text').val('');
})
//This populates the chat box at page open and at each chat addition
chatRef.on("value", function (snapshot) {
    var p = $('<p>');
    p.append(snapshot.val());
    $('#chat').append(p);
    $('#chat').stop().animate({
        scrollTop: $("#chat")[0].scrollHeight
    }, 800);
});

//The following is game stuff and this stuff is pretty easy.... gotta get
// the rest first

$(document).on('click', '.btn', function() {
    choice = $(this).attr('data-name');
    whoAmI = $(this).attr('data-player');
    game();
})