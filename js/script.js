// wait for the DOM to populate
document.addEventListener('DOMContentLoaded', function() {
  //DOM variables
  const gifContainer = document.querySelector('.loading-gif-container');
  const title = document.querySelector('.quiz-title');
  const quizQuestions = document.querySelector('.quiz-questions');
  const scoreContainer = document.querySelector('.score');
  let scoreCounter = document.querySelector('.user-score');

  //score count
  let score = 0;

  // STEP 4: access local file to circumvent CORS policy using fetch api
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

  // STEP 7:  initiates a new quiz - END OF GAME LOOP
  const newGame = () => {
    title.innerHTML = 'START';
    quizQuestions.innerHTML = '';
    score = 0;
    newButton('Quiz 1', 'quiz-one');
    newButton('Quiz 2', 'quiz-two');
    startQuiz();
  };

  // STEP 3: initiates a quiz and call JSON data
  const quizInitiate = quiz => {
    scoreContainer.classList.toggle('active');
    scoreCounter.innerHTML = score;
    json(quiz);
  };

  // STEP 2: waits for user to select a quiz and opens the selected quiz
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

  // STEP 6: checks if user wants to play again or not
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

  // STEP 5: appends questions and answers to DOM and keeps track of score
  const appendQuestions = (q, quiz, iterator = 0) => {
    //removes any quiz buttons
    quizQuestions.innerHTML = '';
    let ar = q.questions;

    // checks what question user is on and if there are any more
    if (iterator < ar.length) {
      let answers = ar[iterator].answers;
      // appends current question in json file
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
            // slices last character in class name, a number, to use as an index
            let submitAnswer = el.classList.value.slice(
              el.classList.value.length - 1,
              el.classList.value.length
            );

            // checks if current answer is the correct answer based on JSON value
            if (answers[submitAnswer].value === true) {
              // if answer is correct adds to score
              el.style.backgroundColor = 'green';
              score++;
              let newIterator = iterator + 1;
              scoreCounter.innerHTML = score;

              // waits 2 seconds for new question to append
              setTimeout(() => {
                gifContainer.classList.remove('loading');
                appendQuestions(q, quiz, newIterator);
              }, 2000);
              gifContainer.classList.add('loading');
            } else {
              // if answer is incorrect doesn't add to score and appends new question
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
          // only lets user select an answer once
          { once: true }
        );
      });
    } else {
      // game is over and calculates score
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
      // lets user play again and appends quiz 1 and 2 if YES is selected
      newButton('YES', 'play-again');
      newButton('NO', 'no-more');
      newGameInitiate();
    }
  };

  // STEP 1: waits for users first interaction with quiz selectors
  startQuiz();
});
