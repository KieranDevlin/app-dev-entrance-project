const quizOne = document.querySelector('.quiz-one');
const quizTwo = document.querySelector('.quiz-two');

const json = quiz =>
  fetch('./src/quiz.json')
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      console.log(data.quizzes[quiz]);
    });

const quizOneInitiate = () => {
  console.log('quiz one start');
  json(0);
};

const quizTwoInitiate = () => {
  console.log('quiz two start');
  json(1);
};

quizOne.addEventListener('click', e => {
  e.preventDefault();
  quizOneInitiate();
});

quizTwo.addEventListener('click', e => {
  e.preventDefault();
  quizTwoInitiate();
});
