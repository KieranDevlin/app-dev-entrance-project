// const quizOne = document.querySelector('.quiz-one');
// const quizTwo = document.querySelector('.quiz-two');

// quizOne.addEventListener(
//   'click',
//   (quizOneInitiate = e => {
//     e.preventDefault();
//     console.log('quiz one start');
//   })
// );

// quizTwo.addEventListener(
//   'click',
//   (quizTwoInitiate = e => {
//     e.preventDefault();
//     console.log('quiz two start');
//   })
// );

fetch('./src/quiz.json')
  .then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    console.log(data);
  });
