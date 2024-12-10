//Author: Michael Thomas, code borrowed from Jeremy
//THIS IS THE JAVASCRIPT USED BY FAKE 3D


// let bgMusic = document.getElementById("background-audio");
// bgMusic.play();

//using Tracery Repository to MadLibs phrases
function makePhrase(){
  let phrases = {
    "origin": ["#phrase#"], //lets it get a random phrase
    "phrase":[
      "#open#, #action# #elaborate#.", 
      "#open#, #advice#. #optimism#!", 
      "#open#, #advice# #elaborate#.", 
      "#compare#, #advice#.", 
      "#compare#, #action#!", 
      "#action#, #optimism#! #open#. "
    ], 

    //all snippets should be in lowercase. That gets adjusted later
    //structure
    "open": [
      "everything happens for a reason",
      "the universe has a plan for you",
      "you're exactly where you're supposed to be",
      "this is all part of your journey", 
      "your fate was sealed upon creation", 
    ], 
    "elaborate": [//adds onto preceding statement
      "because success is just around the corner", 
      "and you will find amazing things", 
    ], 

    //flavor
    "action": [
      "embrace the struggle", 
      "don't stop moving", 
      "smile through the pain", 
      "keep your head held high", 
    ], 
    "advice": [
      "ignore those who differ from you", 
      "believe harder", 
      "rise to the occasion", 
    ], 
    "optimism": [
      "never give up", 
      "hope will come your way", 
      "your future self will thank you", 
      ", and that's more than enough", 
    ], 
    "compare": [
      "life is like #object#", 
      "sometimes you feel like #object#", 
    ], 
    "object": [ //include nescessary articles
      "a box of chocolates", 
      "a rose", 
      "an oppossum", 
      "a candle", 
      "a boomerang", 
    ]
  };

  //sets up the grammar structure
  const traceryGrammar = tracery.createGrammar(phrases);

  //gets a complete sentence, then fixes capitalization
  let sentence = traceryGrammar.flatten("#origin#").split("");
  // console.log(sentence)

  //capitalizes first letter
  sentence[0] = sentence[0].toUpperCase();
  //runs through each character
  for(let i=0; i<sentence.length; i++){
      // console.log(i + ": " + sentence[i])
      // console.log(sentence.length)

      //capitalizes the first letter after a period
      if ((sentence[i] == "." || sentence[i] == "!" || sentence[i] == "?") && i+2 < sentence.length){ 
          sentence[i+2] = sentence[i+2].toUpperCase();
      }
  }

  //turns the sentence back into a string and outputs it
  console.log(sentence.join(""));
  return sentence.join("");
}
  
  /*// Predefined phrases. Whoever made these, Michael borrowed snippets from them. 
  //Be sure to give yourself credit
  const phrases = [
    "You're doing your best, and that's more than enough",
    "Click me again!",
    "You light up every room",
    "Peace is your natural state",
    "You don't need anything, you are everything",
    "Surrender to the infinte moment",
    "What a click!",
    "Haoppiness is your greatest strength",
    "Shit happens, it's ok!",
    "Everyone starts with baby steps",
    ":)",
    "<3",
    "You don't have to be great to start, but you have to start to be great!",
    "You are capable of more than you know",
    "Look how far you've come!",
    "Your mind is your only limit",
    "You matter",
    "I'm proud of you!",
    "Keep going! Don't stop!"
  ];*/


$("#sphereClick").click(function(){
  // Code base borrowed from Jeremy, altered by Michael
  // Display a random phrase with motion and fade-out effect

  // Create a DOM element for the phrase
  $("#container").append("<div class='message'>" + makePhrase());
  const phraseElement = $(".message:last-child");
  console.log(phraseElement)

  phraseElement.css("left", `${50}vw`);
  phraseElement.css("top", `${50}vh`);
  phraseElement.css("transform", "translate(-50%, -50%)")

  // Random angle for movement
  const angle = Math.random() * 2 * Math.PI;
  const moveX = Math.cos(angle) * 150; // Move 50px in random direction
  const moveY = Math.sin(angle) * 150;

  // Animate phrase
  setTimeout(() => {
    phraseElement.css("transform", `translate(${moveX}px, ${moveY}px) scale(1.5)`);
    phraseElement.css("opacity", "0")
  }, 0);

  // Remove the phrase after 1 second
  setTimeout(() => {
    phraseElement.remove();
  }, 1000);

});