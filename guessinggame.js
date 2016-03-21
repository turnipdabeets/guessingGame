/* **** MASTER returns 4 public methods: playersGuessSubmission, provideHint, giveUp, playAgain **** */
var MASTER = function(){
  
  var minRange = 1;
  var maxRange = 100;
  var winningNumber = generateWinningNumber(minRange,maxRange);
  var playersGuess = -1;
  var playersGuessArray = [];
  var guessesLeft = 5; //also have to change in index.html
  var duplicate;
  

  // Generate the Winning Number
  function generateWinningNumber(min, max){
     return Math.floor(Math.random()*(max - min+1) + min);
  }

  //Check if playersGuess is 1-100
  function validCheck(guess){
    if(typeof guess !== "number" && isNaN(guess)){
       return false;
    }else if(guess > maxRange || guess < minRange){
       return false;
    }else
       return true;
  }

  //Display invalid number in DOM
  function displayInValid(){
    $("#cluebox").find("h3").html("Please Enter A Number"+"</br>" +minRange+"-"+maxRange);
  }

  // Display Guess in DOM
  function displayGuess(){
    $("#talkbox").find("p").text(playersGuessArray);
    $("#talkbox").find("h1").text(guessesLeft);
  }

  // Notify Duplicate in DOM
  function displayDuplicate(){
    $("#cluebox").find("h3").text("You already guessed " + playersGuess + "!");
  } 

  // Display Loss in DOM
  function displayLose(){
    $("#talkbox").hide();
    $("#winbox").show().find("h1").text("YOU LOSE");
    $("#cluebox").hide();
    //added to encourage playAgain
    $("#detective").hide();
    $("#guessbox").hide();
    $("footer").find("small").addClass("highlight");
    $("#magnifyGlass").css("z-index",-1);

    $("#answerbox").show().find("h1").text(winningNumber);
  }

  // Display Win in DOM
  function displayWin(){
    $("#talkbox").hide();
    $("#cluebox").hide();
    // $("#winbox").show("YOU WIN!");
    $("#magnifyGlass").hide();
    $("#guessbox").hide();
    $("#detective").attr("src","img/solved.png");
    $("footer").find("small").addClass("highlight");
  }

  // Determine if the next guess should be a lower or higher number
  function lowerOrHigher(){
    if(winningNumber > playersGuess){
      return "low";
    }else{
      return "high";
    }
  }

  //return a string that will be used in the DOM message when the checkGuess function is invoked.
  function guessMessage(){
    var lowOrHigh = lowerOrHigher();
    var distance = Math.abs(winningNumber - playersGuess);
    var phrase;

    if(distance > 50)
          phrase = "Nice try Sherlock, but you’re too " + lowOrHigh+ " to crack this code. You’re more than 50 degrees away from solving this!";
    else if(distance > 40)
          phrase = "There is nothing more deceptive than an obvious fact. Your guess is too "  +lowOrHigh+ " and more than 40 degrees away!";
    else if(distance > 30)
          phrase = "You see, but you do not observe. The distinction is clear. Your guess is too "  +lowOrHigh+ " and more than 30 degrees away!";
    else if(distance > 20)
          phrase = "The world is full of obvious things which nobody by any chance ever observes. Your guess is too "  +lowOrHigh+ " and more than 20 degrees away!";
    else if(distance > 10)
          phrase = "You know my methods, Watson, but your guess is too " +lowOrHigh+ " and more than 10 degrees away.";
    else if(distance <=10 && distance > 5)
          phrase = "Nice work! You’re under 10 degrees away but too "+ lowOrHigh+". ";
    else if(distance <= 5)
          phrase = "Can’t check that off, yet! Your guess is too " +lowOrHigh+ ", but within 5 degrees.";

    $("#cluebox").find("p").text(phrase);
  }

  // Check if the Player's Guess is the winning number 
  function checkGuess(){
    if(validCheck(playersGuess)){

        if(winningNumber == playersGuess){
          displayWin();
        }else{
          if(duplicate){
            displayDuplicate();
          }else if (guessesLeft == 1) {
            displayLose();
          }else{
            guessesLeft--;
          }
        }
      guessMessage();
    }else{
        playersGuessArray.pop(); //remove nonValid number
        displayInValid();
    }
  }

  // Fetch the Players Guess on keyboard Enter
  $(document).keypress(function(e) {
      if(e.which == 13) {
          MASTER.playersGuessSubmission();
      }
  });

  //shuffle array so the winning number is not always in the same place
  function shuffle(array) {
    var amount = array.length, temp, index;

    // While there remain elements to shuffle…
    while(amount) {

      // Pick a random index 0 (inclusive) - array.lenght (exclusive)
      index = Math.floor(Math.random() * amount--);

      // And swap the current element.
      temp = array[amount];
      array[amount] = array[index];
      array[index] = temp;
    }

    return array;
  }

  // Create a provide hint button that provides additional clues to the "Player"
  function provideHint(){
    var arr = [], displayAmount, possibleNumber;

  //determine how many possible winning numbers to show based on number of guesses left
    switch(guessesLeft){
      case 3:
        displayAmount = 5;
        break;
      case 2:
        displayAmount = 4;
        break;
      case 1:
        displayAmount = 1;
        break;
      default:
        displayAmount = 7;
        break;
    }
    //create array of possible winning numbers plus the actual winningNumber
    for(var i = displayAmount; i > 0; i--){
        possibleNumber = generateWinningNumber(minRange,maxRange);
        arr.push(possibleNumber);
    }  
        arr.push(winningNumber);

        arr = shuffle(arr);  
    //display possibly answers in DOM    
    $("#cluebox").find("p").html("One of these values is the winning number:"+ "</br>"+  arr +"</br>"+ "Submit a guess!");
  }

  // Fetch the Players Guess
  function playersGuessSubmission(){
    $("#cluebox").find("h3").text("");
    playersGuess = +$('input').val();
    duplicate = (playersGuessArray.indexOf(playersGuess) >= 0)

    //if valid push to array
    playersGuessArray.push(playersGuess);
    $('input').val("");

    console.log("win num is "+ winningNumber);
    //check for win and display guess in DOM
    checkGuess();
    displayGuess();
  }

  // Allow the "Player" to Give Up
  function giveUp(){
    displayLose();
  }

  // Allow the "Player" to Play Again
  function playAgain(){
    location.reload();
  }

  /* **** MASTER's Public methods **** */
  return {     
      playersGuessSubmission: playersGuessSubmission,
      provideHint: provideHint,
      giveUp:giveUp,
      playAgain: playAgain   
  }

}();