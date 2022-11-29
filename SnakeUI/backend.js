﻿// UI Components
let grid = document.querySelector(".grid");
let popup = document.querySelector(".popup");
let playAgain = document.querySelector(".playAgain");
let scoreDisplay = document.querySelector(".scoreDisplay");
let left = document.querySelector(".left");
let down = document.querySelector(".down");
let right = document.querySelector(".right");
let up = document.querySelector(".up");

// width of the grid
let width = 50;

// snake game features

let currentIndex = 0;
let appleIndex = 0;
let currentSnake = [2, 1, 0];
let direction = 1;
let score = 0;
let speed = 0.9;
let intervalTime = 0;
let interval = 0;
let randomPoison = 5;


// game initiliazation
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keyup", control);
    createBoard();
    startGame();
    playAgain.addEventListener("click", replay);
});


// create board by appending width*width divs to the grid
function createBoard() {
    popup.style.display = "none";
    for (let i = 0; i < width*width; i++) {
        let div = document.createElement("div");
        grid.appendChild(div);
    }
}

// initiliaze game features for new game 
function startGame() {
    let squares = document.querySelectorAll(".grid div");
    randomApple(squares);
    direction = 1;
    scoreDisplay.innerHTML = score;
    intervalTime = 80;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach((index) => squares[index].classList.add("snake"));
    interval = setInterval(moveOutcome, intervalTime);
}


// at each displacement of snake, check if game over
function moveOutcome() {
    let squares = document.querySelectorAll(".grid div");
    moveSnake(squares);
}


// move the snake by removing last element in currentsnake
// and adding new element to beginning depending on direction 
function moveSnake(squares) {
    let tail = currentSnake.pop();
    console.log(tail);
    squares[tail].classList.remove("snake");
    currentSnake.unshift(calculateShift(squares));
    eatPoison(squares, tail);
    eatApple(squares, tail);
    squares[currentSnake[0]].classList.add("snake");
}

function calculateShift(squares) {
    let shift = currentSnake[0] + direction;
    // snake is going down and reaches bottom
    if (currentSnake[0] + width >= width * width && direction === width) {
        shift = shift % (width * width);
    }
    // snake is going right and reaches right side
    else if (currentSnake[0] % width === width - 1 && direction === 1) {
        shift = shift - width;
    }
    // snake is going left and reaches left side
    else if (currentSnake[0] % width === 0 && direction === -1) {
        shift = shift + width;
    }
    // snake is going up and reaches top
    else if (currentSnake[0] - width < 0 && direction === -width) {
        shift = shift + width * width;
    }
    // snake hits itself
    if (squares[shift].classList.contains("snake")) {
        return loss();
    }
    return shift;
}

// displays popup and resets games features to prepare for new game
function loss() {
    alert("you hit something");
    popup.style.display = "flex";
    score = 0;
    return clearInterval(interval);
}

// checks if snake hits a border
function checkForHits(squares) {
    if (
        //(currentSnake[0] + width >= width * width && direction === width) ||
        //(currentSnake[0] % width === width - 1 && direction === 1) ||
        //(currentSnake[0] % width === 0 && direction === -1) ||
        //(currentSnake[0] - width <= 0 && direction === -width) ||
        squares[currentSnake[0] + direction].classList.contains("snake")
    ) {
        return true;
    } else {
        return false;
    }
}

// when head of snake is on an apple set a new random apple
// and increment length of snake

function eatApple(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple");
        squares[tail].classList.add("snake");
        currentSnake.push(tail);
        randomApple(squares);
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        interval = setInterval(moveOutcome, intervalTime);
    }
}

function eatPoison(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("poison")) {
        return loss();
    }
}

// picks a spot for new apple that is not occupied by the snake
function randomApple(squares) {
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains("snake") ||
        squares[appleIndex].classList.contains("poison"));
    squares[appleIndex].classList.add("apple");

    let poisonOdds = Math.floor(Math.random() * randomPoison) + 1;

    if (poisonOdds === randomPoison) {
        do {
            poisonIndex = Math.floor(Math.random() * squares.length);
        } while (squares[poisonIndex].classList.contains("snake") ||
            squares[poisonIndex].classList.contains("apple"));
        squares[poisonIndex].classList.add("poison");
    }

}

// set the direction of the snake upon user key click
function control(e) {
    if (e.keyCode === 39) {
        direction = 1;
    } else if (e.keyCode === 38) {
        direction = -width;
    } else if (e.keyCode === 37) {
        direction = -1;
    } else if (e.keyCode === 40) {
        direction = +width;
    }
}

// controls for mobile users
up.addEventListener("click", () => (direction = -width));
down.addEventListener("click", () => (direction = +width));
left.addEventListener("click", () => (direction = -1));
right.addEventListener("click", () => (direction = 1));

// when snake hits a wall, have replay option pop up
function replay() {
    grid.innerHTML = "";
    createBoard();
    startGame();
    popup.style.display = "none";
}