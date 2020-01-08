// wait for the DOM to populate
document.addEventListener('DOMContentLoaded', function() {
  //////////////////////////////////////////////////////
  //////////////////  VARIABLES ////////////////////////
  //////////////////////////////////////////////////////

  const gif = document.querySelector('.loading-gif');
  const gifContainer = document.querySelector('.loading-gif-container');
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
        el.addEventListener(
          'click',
          () => {
            let submitAnswer = el.classList.value.slice(
              el.classList.value.length - 1,
              el.classList.value.length
            );

            // checks if current answer is the correct answer
            if (answers[submitAnswer].value === true) {
              el.style.backgroundColor = 'green';
              score++;
              let newIterator = iterator + 1;
              scoreCounter.innerHTML = score;
              setTimeout(() => {
                gif.classList.remove('active');
                gifContainer.classList.remove('active');
                appendQuestions(q, quiz, newIterator);
              }, 2000);
              gif.classList.add('active');
              gifContainer.classList.add('active');
              // document.querySelectorAll('button').forEach(el => {
              //   window.stopPropagation();
              // });
            } else {
              el.style.backgroundColor = 'red';
              let newIterator = iterator + 1;
              scoreCounter.innerHTML = score;
              setTimeout(() => {
                gifContainer.classList.remove('loading');
                appendQuestions(q, quiz, newIterator);
              }, 2000);
              gifContainer.classList.add('loading');
            }
          },
          { once: true }
        );
      });
    } else {
      scoreContainer.classList.remove('active');
      let scorePercent = ((score / ar.length) * 100).toFixed(1);
      if (scorePercent > 50) {
        title.innerHTML =
          'Your Score: ' +
          scorePercent +
          '%' +
          '<br><span style="color:green">PASS</span><br>Do you want to play again?';
      } else {
        title.innerHTML =
          'Your Score: ' +
          scorePercent +
          '%' +
          '<br><span style="color:red">FAIL</span><br>Do you want to play again?';
      }
      newButton('YES', 'play-again');
      newButton('NO', 'no-more');
      newGameInitiate();
    }
  };

  startQuiz();
});
