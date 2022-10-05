
// section containers
var timerContainer = document.getElementById('scoring__time-container');
var openingContainer = document.getElementById('opening__container');
var questionsContainer = document.getElementById('questions__container');
var conclusionContainer = document.getElementById('conclusion__container');
var highScoresContainer = document.getElementById('high__scores-container');
var resultContainer = document.getElementById('result__container');

// user interaction elements
var highScoresLink = document.querySelector('header p:first-child');
var startButton = document.getElementById('start__btn');
var submitButton = document.getElementById('submit__btn');
var goBackButton = document.getElementById('go__back-btn');
var clearScoresButton = document.getElementById('clear__scores-btn');
var initialsSubmit = document.getElementById('initials__submit-form');

// display elements
var timerText = document.getElementById('timer__txt');
var questionText = document.getElementById('question__txt');
var multipleAnswersList = document.getElementById('multiple__answers-li');
var finalScoreText = document.getElementById('final__score-txt');
var resultText = document.getElementById('result_txt');
var initialsText = document.getElementById('initials__txt');
var highScoresList = document.getElementById('high__scores-li');

// global variables
var timerObj = {};
const START_SECS = 10;
var secsRemaining = START_SECS;
var currentQuestionIdx = -1;
var highScores = [];   // an array of score objects


// hide all children of the <main> tag
function hideAllSections(){
    for (var i = 0; i < document.body.children[0].children.length; i++)
    document.body.children[0].children[i].style.display = 'none';
}

function displaySection(section){
    hideAllSections();

    switch (section){
        case 'opening__container':{
            timerContainer.style.display = 'flex';
            openingContainer.style.display = 'flex';
            timerText.textContent = 0;
            break;
        }
        case 'questions__container':{
            timerContainer.style.display = 'flex';
            questionsContainer.style.display = 'initial';
            break;
        }
        case 'conclusion__container':{
            timerContainer.style.display = 'flex';
            conclusionContainer.style.display = 'initial';
            resultContainer.style.display = 'initial';
            initialsText.value = '';
            finalScoreText.textContent = secsRemaining;
            break;
        }
        case 'high__scores-container':{
            highScoresContainer.style.display = 'initial';
            highScoresList.innerHTML = '';
            break;
        }
    }
}

function loadNextQuestion(){
    currentQuestionIdx++;
    // reached the end of questions
    if (currentQuestionIdx >= quiz.length){
        clearInterval(timerObj);
        hideAllSections();
        displaySection('conclusion__container');
        return;
    }

    questionText.textContent = quiz[currentQuestionIdx].question;
    multipleAnswersList.innerHTML = '';
    // generate <li> tags for every answer choice in the quiz object array
    for (var i = 0; i < quiz[currentQuestionIdx].choices.length; i++){
        var el = document.createElement('li');
        el.id = 'l' + i;
        el.textContent = quiz[currentQuestionIdx].choices[i];
        el.addEventListener('mouseup', questionChoiceMouseUp);  // add click callback
        el.addEventListener('mousedown', questionChoiceMouseDown);  // add click callback
        multipleAnswersList.appendChild(el);
    }
}


var startButtonClick = function (event){
    event.stopPropagation();
    displaySection('questions__container');
    loadNextQuestion();

    //  display on page and decrement seconds remaining
    // launch timer and display on page
    timerText.textContent = secsRemaining;
    timerObj = setInterval(() => {
        secsRemaining--;
        if (secsRemaining <= 0) {
            secsRemaining = 0;
            clearInterval(timerObj);
            displaySection('conclusion__container');
        }
        timerText.textContent = secsRemaining;
    },1000);
};



var questionChoiceMouseUp = function (event){
    event.stopPropagation();
    var el = event.target;
    var elIdx = (el.id[el.id.length-1]);

    if (quiz[currentQuestionIdx].answer !== Number(elIdx)){
        resultContainer.style.display = 'initial';
        resultText.textContent = 'Wrong!';
        if (secsRemaining - 10 <= 0){
            secsRemaining = 0;
        } else {
            secsRemaining -= 10;
        }
    } else {
        resultContainer.style.display = 'initial';
        resultText.textContent = 'Correct!';
        loadNextQuestion();
    }
};


var questionChoiceMouseDown = function (event){
    event.stopPropagation();
    var el = event.target;
    resultContainer.style.visibility = 'hidden';
}

var initialsSubmitSubmit = function (event){
    event.preventDefault();
    highScores.push({
        initials: initialsText.value.toUpperCase(),
        score: secsRemaining
    });

    localStorage.setItem('highScores', JSON.stringify(highScores));

    // sort in descending order. highest scores show up first
    highScores.sort((a, b)=>{
        if (a.score > b.score){
            return -1;
        }
        if (a.score < b.score){
            return 1;
        }
        return 0; // a must equal to b
    })

    displaySection('high__scores-container');

    for (var i = 0; i < highScores.length; i++){
        var el = document.createElement('li');
        el.textContent = highScores[i].initials + ' - ' + highScores[i].score;
        highScoresList.appendChild(el);
    }
}


var goBackButtonClick = function (event){
    event.stopPropagation();
    displaySection('opening__container');
    currentQuestionIdx = -1;
    secsRemaining = START_SECS;
};

var clearScoresButtonClick = function (event){
    event.stopPropagation();
    highScores = [];
    highScoresList.innerHTML = '';
    localStorage.removeItem('highScores');
};

var highScoresLinkCallback = function (event){
    event.stopPropagation();
    displaySection('high__scores-container');

    for (var i = 0; i < highScores.length; i++){
        var el = document.createElement('li');
        el.textContent = highScores[i].initials + ' - ' + highScores[i].score;
        highScoresList.appendChild(el);
    }
};

// set initial display state
displaySection('opening__container');

var localStorageItem = JSON.parse(localStorage.getItem('highScores'));
if (localStorageItem !== null) highScores = localStorageItem;

startButton.addEventListener('click',startButtonClick);
initialsSubmit.addEventListener('submit',initialsSubmitSubmit);
goBackButton.addEventListener('click', goBackButtonClick);
clearScoresButton.addEventListener('click',clearScoresButtonClick);
highScoresLink.addEventListener('click', highScoresLinkCallback);
