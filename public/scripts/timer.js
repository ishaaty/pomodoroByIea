let startStopBtn = document.querySelector("#startStop");
let resetBtn = document.querySelector("#reset");
let upArrowBtn = document.querySelector(".upArrow");
let downArrowBtn = document.querySelector(".downArrow");
let minutesDisplay = document.querySelector("#minutes");

let timerOn = false;
let counter = 0;
let currentMins = 25;
let currentSecs = 0;
let v;

// function for when timer starts/stops
startStopBtn.addEventListener("click", function(){
    if (!timerOn){
        timerOn = true;
        v = setInterval(timerFunction, 1000);
    } else {
        timerOn = false;
        clearInterval(v);
    }
});

function timerFunction(){
    if (currentMins == 0 && currentSecs == 0){
        timerOn = false;
        clearInterval(v);
    } else if (currentSecs == 0){
        currentSecs = 59;
        currentMins--;
    } else {
        currentSecs--;
    }

    if (currentSecs < 10){
        minutesDisplay.textContent = String(currentMins) + ":0" + String(currentSecs);
    } else {
        minutesDisplay.textContent = String(currentMins) + ":" + String(currentSecs);
    }
}

// function for resetting timer WHEN NOT IN USE
resetBtn.addEventListener("click", function(){
    if (!timerOn){
        currentMins = 25;
        currentSecs = 0;
        minutesDisplay.textContent = String(currentMins) + ":0" + String(currentSecs);
    }

});

// function for adding 5 min to timer WHEN NOT IN USE
upArrowBtn.addEventListener("click", function(){
    if (!timerOn){
        currentMins += 5
        if (currentMins < 10){
            minutesDisplay.textContent = "0" 
        } 

        if (currentSecs < 10){
            minutesDisplay.textContent = String(currentMins) + ":0" + String(currentSecs);
        } else {
            minutesDisplay.textContent = String(currentMins) + ":" + String(currentSecs);   
        }
    }
});

// function for subtracting 5 min to timer WHEN NOT IN USE
downArrowBtn.addEventListener("click", function(){
    if (!timerOn && currentMins > 0){
        currentMins -= 5

        if (currentSecs < 10){
            minutesDisplay.textContent = String(currentMins) + ":0" + String(currentSecs);
        } else {
            minutesDisplay.textContent = String(currentMins) + ":" + String(currentSecs);   
        }
    }
});
