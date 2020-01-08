const quizOne = document.querySelector('.quiz-one');
const quizTwo = document.querySelector('.quiz-two');
const title = document.querySelector('.quiz-title');
const quizQuestions = document.querySelector('.quiz-questions');
const scoreContainer = document.querySelector('.score');
let scoreCounter = document.querySelector('.user-score');
let quiz = 0;
let score = 0;

const json = quiz =>
  fetch('./src/quiz.json')
    .then(function(resp) {
      //returns json response
      return resp.json();
    })
    .then(function(data) {
      //can now access json file locally
      let currentQuizData = data.quizzes[quiz];
      appendQuestions(currentQuizData, quiz);
    });

const appendQuestions = (q, quiz, iterator = 0) => {
  //removes quiz selector
  quizQuestions.innerHTML = '';
  let ar = q.questions;
  let answers = ar[quiz].answers;

  if (iterator < ar.length) {
    // appends question in json file
    title.innerHTML = ar[iterator].question;

    // appends possible answers to current question in json file
    for (let i = 0; i < answers.length; i++) {
      const b = document.createElement('button');
      const a = document.createElement('h3');
      quizQuestions.appendChild(b);
      b.appendChild(a);
      a.innerHTML = answers[i].content;
      console.log(answers[i].content);
      b.classList.add('number:' + i);
    }

    //selects all the buttons and adds event listener to all
    document.querySelectorAll('button').forEach(el => {
      el.addEventListener('click', () => {
        let submitAnswer = el.classList.value.slice(
          el.classList.value.length - 1,
          el.classList.value.length
        );

        // checks if current answer is the correct answer
        if (answers[submitAnswer].value === true) {
          score++;
          iterator++;
          scoreCounter.innerHTML = score;
          appendQuestions(q, quiz, iterator);
        } else {
          iterator++;
          scoreCounter.innerHTML = score;
          appendQuestions(q, quiz, iterator);
        }
      });
    });
  } else {
    scoreContainer.classList.remove('active');
    title.innerHTML =
      'Your Score: ' +
      score +
      ' &frasl; ' +
      ar.length +
      '<br>' +
      ((score / ar.length) * 100).toFixed(1) +
      '%';
    console.log('broken');
  }
};

// grabs only quiz 1 of JSON file
const quizOneInitiate = quiz => {
  quiz = 0;
  scoreContainer.classList.add('active');
  scoreCounter.innerHTML = score;
  json(quiz);
};

// grabs only quiz 2 of JSON file
const quizTwoInitiate = quiz => {
  quiz = 1;
  scoreContainer.classList.toggle('active');
  scoreCounter.innerHTML = score;
  json(quiz);
};

quizOne.addEventListener('click', e => {
  e.preventDefault();
  quizOneInitiate();
});

quizTwo.addEventListener('click', e => {
  e.preventDefault();
  quizTwoInitiate();
});

////////////////////////////////////////////////////////////////////
// THIS LOOP IS INFINITE DONT USE
////////////////////////////////////////////////////////////////////

//loops through questions and answers and appends to DOM
// for (let i = 0; i < currentQuiz.questions.length; i++) {
//   title.innerHTML = currentQuiz.questions[i].question;
//   currentQuiz.questions[quiz].answers.forEach(e => {
//     const b = document.createElement('button');
//     const a = document.createElement('h3');
//     quizQuestions.appendChild(b);
//     b.appendChild(a);
//     a.innerHTML = e.content;
//   });
// }
