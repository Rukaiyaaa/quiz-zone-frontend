const loadcategory = () => {
    fetch("https://quiz-liard-theta.vercel.app/category/")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          const parent = document.getElementById("drop-deg");
          const li = document.createElement("li");
          li.classList.add("dropdown-item");
            li.innerHTML =`
                <li onclick="loadQuizView('${item?.category}')">${item?.category}</li>
            `;
          parent.appendChild(li);
        });
      });
  };


const loadQuizView = (search) =>{
    document.getElementById("all-quiz").innerHTML = "";
    console.log(search)

    fetch(`https://quiz-liard-theta.vercel.app/quizzes/?search=${search ? search : ""}`)
        .then(res => res.json())
        .then((data) => displayQuiz(data));
};


const displayQuiz = (quizes) => {
    quizes.forEach((quiz) => {
        console.log(quiz)
        const parent = document.getElementById("all-quiz");
        const div = document.createElement("div");
        div.classList.add("quiz-card");
        div.innerHTML = `
            <h3>${quiz.name}</h3>
            <p>${quiz.description}</p>
            <h4>No. of question: ${quiz.num_of_questions}</h4>
            <h5>${quiz.topic.category}</h5>
            <button onclick="startQuiz(${quiz.id})" class="btn btn-danger">Start Quiz</button>
        `;

        parent.appendChild(div)

    })
}

function startQuiz(quizId) {
    window.location.href = `quiz_details.html?quizId=${quizId}`;
}

document.addEventListener("DOMContentLoaded", function () {
    const quizId = new URLSearchParams(window.location.search).get('quizId');

 
    fetch('https://quiz-liard-theta.vercel.app/quizzes/')
        .then(response => response.json())
        .then(data => {
            const quiz = data.find(q => q.id === parseInt(quizId));
            if (quiz) {
                displayQuizQuestions(quiz);
            }
        })
        .catch(error => {
            console.error('Error fetching quizzes:', error);
        });
});


const displayQuizQuestions = (quiz) => {
    document.getElementById("quiz-name").textContent = quiz.name;
    const questionsContainer = document.getElementById("questions-container");

    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        let answersHtml = '';
        question.answers.forEach(answer => {
            answersHtml += `
                <div>
                    <input type="radio" name="question${question.id}" value="${answer.id}">
                    <label>${answer.text}</label>
                </div>
            `;
        });

        questionDiv.innerHTML = `
            <h4 class="mb-3 mt-2">${index + 1}. ${question.text}</h4>
            ${answersHtml}
        `;
        questionsContainer.appendChild(questionDiv);
    });
}




const submitQuiz = () => {
    const quizId = new URLSearchParams(window.location.search).get('quizId');

    fetch('https://quiz-liard-theta.vercel.app/quizzes/')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const quiz = data.find(q => q.id === parseInt(quizId));
            if (quiz) {
                let score = 0;

                quiz.questions.forEach((question) => {
                    const selectedAnswer = document.querySelector(`input[name="question${question.id}"]:checked`);
                    if (selectedAnswer) {
                        const answerId = parseInt(selectedAnswer.value);

                        const answer = question.answers.find(a => a.id === answerId);
                        if (answer && answer.correct) {
                            score += 1;
                        }
                    }
                });

                document.getElementById("score").textContent = `Your Score: ${score}/${quiz.questions.length}`;
            } else {
                document.getElementById("score").textContent = 'Quiz not found.';
            }
        })
        .catch(error => {
            console.error('Error fetching quizzes:', error);
            document.getElementById("score").textContent = 'Error fetching quiz data.';
        });
};




loadcategory()
loadQuizView()


