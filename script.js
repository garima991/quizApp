const progressBar = document.querySelector("#progress-bar");
const timerValue = document.querySelector("#timer");
const options = document.querySelector(".quiz-options");
const totalQues = document.querySelector("#total-no");
const startBtn = document.querySelector("#play");
const startForm = document.getElementById("start-section");
const quizScreen = document.querySelector(".quiz-screen");
const nextBtn = document.querySelector("#next-btn");

let questionText = document.querySelector(".ques");
let Questions = [];
let currTime;
let currQues = 1;
let difficulty = null;
let perQuesTime;
let score = 0;
let showAnswer = 1000;
let questionInterval;

function setDifficulty(difficulty){
    if(difficulty === "easy"){
        perQuesTime = 31000; // 30sec
        showAnswer = 3000; // 3 sec
    }
    if(difficulty === "medium"){
        perQuesTime = 16000; // 15 sec
        showAnswer = 2000;  // 2 sec
    }
    if(difficulty === "hard"){
        perQuesTime = 11000; // 10 sec
        showAnswer = 1000; // 1
    }
}

function startQuiz(event){
    event.preventDefault();
    difficulty = document.querySelector("#level");
    if (!difficulty.value) {
        alert("Please select a difficulty level.");
        return;
    }
    setDifficulty(difficulty.value);

    startForm.classList.add("hide");
    quizScreen.classList.remove("hide");

    fetchQues();
}

function fetchQues(){
    fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple")
    .then((res) => res.json())
    .then((data) => {
        Questions = data.results;
        loadQues();
    });
}

function loadQues(){
    document.getElementById("curr-no").innerText = currQues;
    clearInterval(questionInterval);
    progressBar.style.width = "100%";
    startTimer();
    
    let newQuestion = Questions[currQues].question;
    questionText.innerText = newQuestion;

    options.innerHTML = "";
    const rightAns = Questions[currQues].correct_answer;
    const wrongAns = Questions[currQues].incorrect_answers;

    const newOptions = [...wrongAns, rightAns];
    newOptions.sort(() => Math.random() * 4);

    newOptions.forEach((option) => {
        const button = document.createElement("button");
        button.classList.add("option");
        const optionContent = document.createElement("div");
        optionContent.innerText = option;
        button.append(optionContent);
        options.appendChild(button);

        button.dataset.isCorrect = (option === rightAns);
        button.addEventListener("click", checkAns);
    });
}

function startTimer() {
    currTime = perQuesTime / 1000;
    let progressWidth = 100/currTime;
    questionInterval = setInterval(() => {
        currTime--;
        progressBar.style.width = `${progressWidth * currTime}%`
        timerValue.querySelector("#time-left").textContent = currTime;

        if (currTime <= 0) {
            clearInterval(questionInterval); // Stop the timer
            showCorrectAnswer();
            setTimeout(loadNextQues, showAnswer);
            // loadNextQues();
        }
    }, 1000);
}

function showCorrectAnswer() {
    options.querySelectorAll('.option').forEach((option) => {
        if (option.dataset.isCorrect === "true") {
            option.classList.add("correct"); 
            const icon = document.createElement('img');
            icon.src = './assets/correct-icon.svg';  
            option.appendChild(icon); 
        }
    });
}

function checkAns(event) {
    document.querySelectorAll(".option").forEach((option) => {
        option.removeEventListener("click",checkAns);
    });
    const clickedBtn = event.currentTarget;

    if (clickedBtn && clickedBtn.dataset.isCorrect === "true") {
        clickedBtn.classList.add("correct");
        const icon = document.createElement('img');
        icon.src = './assets/correct-icon.svg';  
        clickedBtn.appendChild(icon); 
        score++;
        console.log("Correct Answer!");
    } 

    else if (clickedBtn) {
        clickedBtn.classList.add("incorrect");
        const icon = document.createElement('img');
        icon.src = './assets/incorrect-icon.svg'; 
        clickedBtn.appendChild(icon); 
        console.log("Incorrect Answer!");
        showCorrectAnswer();
    }

    clearInterval(questionInterval);
    // Show correct and go to next
    setTimeout(loadNextQues, showAnswer);
}

function loadNextQues(){
    if (currQues < Questions.length - 1) {
        currQues++;
        loadQues();
    }
    else {
        quizScreen.innerHTML = "";
        showScores();
    }
}

function showScores(){
    quizScreen.innerHTML = "";
    const scoreCard = document.createElement("div");
    scoreCard.classList.add("score");
    scoreCard.innerHTML = `<h2>Your total score <br/> ${score}/10 </h2>`;
    quizScreen.appendChild(scoreCard);
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", loadNextQues);