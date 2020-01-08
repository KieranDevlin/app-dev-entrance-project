// wait for the DOM to populate
document.addEventListener('DOMContentLoaded', function() {
  //////////////////////////////////////////////////////
  //////////////////  VARIABLES ////////////////////////
  //////////////////////////////////////////////////////

  const title = document.querySelector('.quiz-title');
  const quizQuestions = document.querySelector('.quiz-questions');
  const scoreContainer = document.querySelector('.score');
  let scoreCounter = document.querySelector('.user-score');
  let score = 0;

  //////////////////////////////////////////////////////
  //////////////////  FUNCTIONS ////////////////////////
  //////////////////////////////////////////////////////

  // access local file to circumvent CORS policy using fetch api
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

  // initiates a new quiz
  const newGame = () => {
    title.innerHTML = 'START';
    quizQuestions.innerHTML = '';
    score = 0;
    newButton('Quiz 1', 'quiz-one');
    newButton('Quiz 2', 'quiz-two');
    startQuiz();
  };

  // starts a quiz
  const quizInitiate = quiz => {
    scoreContainer.classList.toggle('active');
    scoreCounter.innerHTML = score;
    json(quiz);
  };

  // waits for user to select a quiz

  const startQuiz = () => {
    document.querySelectorAll('button').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        if (el.classList.contains('quiz-one')) {
          quizInitiate(0);
        } else {
          quizInitiate(1);
        }
      });
    });
  };

  // appends a new button with specific text and class name
  const newButton = (text, buttonClass) => {
    const b = document.createElement('button');
    const a = document.createElement('h4');
    quizQuestions.appendChild(b);
    b.appendChild(a);
    a.innerHTML = text;
    b.classList.add(buttonClass);
  };

  // checks if user wants to play again or not
  const newGameInitiate = () => {
    document.querySelectorAll('button').forEach(el => {
      el.addEventListener('click', () => {
        if (el.classList.contains('play-again')) {
          newGame();
        } else {
          title.innerHTML = 'Thanks for playing!';
          quizQuestions.innerHTML = '';
        }
      });
    });
  };

  // appends questions and answers to DOM and keeps track of score
  const appendQuestions = (q, quiz, iterator = 0) => {
    //removes quiz selector
    let ar = q.questions;
    quizQuestions.innerHTML = '';
    if (iterator < ar.length) {
      let answers = ar[iterator].answers;
      // appends question in json file
      title.innerHTML = ar[iterator].question;

      // appends possible answers to current question in json file
      for (let i = 0; i < answers.length; i++) {
        newButton(answers[i].content, 'number:' + i);
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
            el.style.backgroundColor = 'green';
            score++;
            iterator++;
            scoreCounter.innerHTML = score;
            setTimeout(() => {
              appendQuestions(q, quiz, iterator);
            }, 2000);
          } else {
            el.style.backgroundColor = 'red';
            iterator++;
            scoreCounter.innerHTML = score;
            setTimeout(() => {
              appendQuestions(q, quiz, iterator);
            }, 2000);
          }
        });
      });
    } else {
      scoreContainer.classList.remove('active');
      title.innerHTML =
        'Your Score: ' +
        ((score / ar.length) * 100).toFixed(1) +
        '%' +
        '<br>Do you want to play again?';
      newButton('YES', 'play-again');
      newButton('NO', 'no-more');
      newGameInitiate();
    }
  };

  startQuiz();
});
