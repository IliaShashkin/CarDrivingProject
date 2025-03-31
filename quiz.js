document.addEventListener('DOMContentLoaded', function() {
    // Quiz data
    const quizData = [
        {
            question: "What is the primary function of Adaptive Cruise Control (ACC)?",
            description: "Adaptive Cruise Control (ACC) is an advanced driver-assistance system that enhances traditional cruise control by...",
            image: "https://a.d-cd.net/H7rnWGzY3CC86eyYu7oNQV2W8SY-960.jpg",
            options: [
                "maintaining a constant speed regardless of traffic",
                "alerting the driver when the fuel level is low",
                "automatically adjusting the vehicle's speed based on traffic conditions",
                "enabling hands-free steering on all roads"
            ],
            correctAnswer: 2,
            explanation: "Unlike standard cruise control, which maintains a fixed speed, ACC monitors the traffic ahead using radar and cameras. It slows down or speeds up the vehicle to maintain a safe following distance.",
            videoExplanation: "data/acc.mp4"
        },
        {
            question: "Which components are essential for ACC to function properly?",
            description: "",
            image: "https://a.d-cd.net/fn_mbyF45cjjEniSECsoMBY2RCY-1920.jpg",
            options: [
                "Airbags and traction control",
                "Radar sensors, cameras, and onboard computers",
                "GPS and satellite communication",
                "Manual braking system"
            ],
            correctAnswer: 1,
            explanation: "A breakdown of how radar and cameras work together in ACC.",
            videoExplanation: ""
        },
        {
            question: "What happens when the vehicle ahead of a car using ACC suddenly stops?",
            description: "ACC is designed to handle traffic changes, but how does it react in emergency situations?",
            image: "https://i-a.d-cd.net/RJl4GOjT5MjnZ2swlzw4_eyUCiw-1920.jpg",
            options: [
                "ACC automatically applies emergency braking if necessary",
                "ACC disables itself and requires manual braking",
                "The vehicle accelerates to maintain its preset speed",
                "ACC alerts the driver but does not intervene"
            ],
            correctAnswer: 0,
            explanation: "Most modern ACC systems have automatic emergency braking (AEB), which applies the brakes if a collision is imminent. However, drivers should remain attentive.",
            videoExplanation: "data/emergencystop.mp4"
        },
        {
            question: "Which driving condition may cause ACC to malfunction?",
            description: "ACC relies on sensors to function, but external conditions can interfere.",
            image: "data/error.png",
            options: [
                "Dry and clear highways",
                "Heavy rain or snow blocking the sensors",
                "City roads with clear lane markings",
                "Driving during the daytime"
            ],
            correctAnswer: 1,
            explanation: "Radar and cameras may struggle in poor weather, leading to reduced ACC performance or temporary deactivation.",
            videoExplanation: "data/heavyRainConditions.mp4"
        },
        {
            question: "What is the key feature in Audi's Traffic Jam Pilot?",
            description: "",
            image: "data/audi-traffic-jam-pilot.jpg",
            options: [
                "LiDAR scanners",
                "Embedded cameras",
                "Parking Sensors",
                "None of the above"
            ],
            correctAnswer: 0,
            explanation: "Audi was the first car manufacturer to include a LiDAR system for it's Traffic Jam Pilot.",
            videoExplanation: "data/audi-traffic-jam-pilot.jpg"
        },
        {
            question: "What is one major advantage Tesla Autopilot 2.0 has over Level 2 LKA?",
            description: "Tesla Autopilot had some self-learning capabilities. What could that mean?",
            image: "data/maxresdefault (2.jpg",
            options: [
                "It eliminates the need for human drivers",
                "It only works on highways and cannot adapt to city driving",
                "It does not require radar or cameras to function",
                "It has more advanced machine learning and continuous software updates"
            ],
            correctAnswer: 3,
            explanation: "",
            videoExplanation: "data/road.mp4"
        }
    ];

    // Server configuration
    const SERVER_URL = 'https://quiz-game-ilia.marcus7i.net';

    // DOM elements
    const questionNumber = document.getElementById('question-number');
    const totalQuestions = document.getElementById('total-questions');
    const questionImg = document.getElementById('question-img');
    const questionText = document.getElementById('question-text');
    const questionDescription = document.getElementById('question-description');
    const answersList = document.getElementById('answers-list');
    const submitButton = document.getElementById('submit-btn');
    const nextButton = document.getElementById('next-btn');
    const feedbackSection = document.getElementById('answer-feedback');
    const explanationText = document.getElementById('answer-explanation');
    const videoSection = document.getElementById('video-explanation');
    const videoElement = document.getElementById('explanation-video');
    const quizResults = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score');
    const maxScoreDisplay = document.getElementById('max-score');
    const nicknameInput = document.getElementById('nickname');
    const saveScoreButton = document.getElementById('save-score-btn');
    const leaderboard = document.getElementById('leaderboard');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const playAgainButton = document.getElementById('play-again-btn');

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    // Initialize quiz
    function initQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        answered = false;

        totalQuestions.textContent = quizData.length;
        maxScoreDisplay.textContent = quizData.length;

        quizResults.classList.add('hidden');
        leaderboard.classList.add('hidden');
        loadQuestion();
    }

    async function loadLeaderboard() {
        try {
            const response = await fetch(`${SERVER_URL}/leaderboard`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const scores = await response.json();

            leaderboardBody.innerHTML = '';
            scores.sort((a, b) => b.score - a.score).forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.name}</td>
          <td>${entry.score}/${quizData.length}</td>
          <td>${new Date().toLocaleDateString()}</td>
        `;
                leaderboardBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            alert('Failed to load leaderboard. Please try again later.');
        }
    }

    async function saveScore() {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            alert('Please enter a nickname!');
            return;
        }

        const formData = new FormData();
        formData.append('name', nickname);
        formData.append('score', score.toString());

        try {
            const response = await fetch(`${SERVER_URL}/leaderboard`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.status === 'success') {
                await loadLeaderboard();
                quizResults.classList.add('hidden');
                leaderboard.classList.remove('hidden');
            } else {
                alert(result.message || 'Error saving score. Please try again.');
            }
        } catch (error) {
            console.error('Error saving score:', error);
            alert('Failed to save score. Please try again later.');
        }
    }

    function loadQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];

        answered = false;
        feedbackSection.classList.add('hidden');
        videoSection.classList.add('hidden');
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
        submitButton.disabled = true;

        if (videoElement.src) {
            videoElement.pause();
            videoElement.removeAttribute('src');
            videoElement.load();
        }

        questionNumber.textContent = currentQuestionIndex + 1;
        questionImg.src = currentQuestion.image;
        questionText.textContent = currentQuestion.question;
        questionDescription.textContent = currentQuestion.description;

        answersList.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'answer-option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.id = 'answer' + (index + 1);
            input.name = 'answer';
            input.value = index;

            const label = document.createElement('label');
            label.htmlFor = 'answer' + (index + 1);
            label.textContent = option;

            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            answersList.appendChild(optionDiv);
        });

        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.addEventListener('change', function() {
                submitButton.disabled = false;
            });
        });
    }

    submitButton.addEventListener('click', function() {
        if (answered) return;

        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return;

        const selectedValue = parseInt(selectedAnswer.value);
        const currentQuestion = quizData[currentQuestionIndex];

        answered = true;

        if (selectedValue === currentQuestion.correctAnswer) {
            score++;
        }

        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach((option, index) => {
            if (index === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            } else if (index === selectedValue && selectedValue !== currentQuestion.correctAnswer) {
                option.classList.add('incorrect');
            }
        });

        explanationText.textContent = currentQuestion.explanation;
        feedbackSection.classList.remove('hidden');

        if (currentQuestion.videoExplanation) {
            videoElement.src = currentQuestion.videoExplanation;
            videoSection.classList.remove('hidden');
        } else {
            videoSection.classList.add('hidden');
        }

        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.disabled = true;
        });

        submitButton.classList.add('hidden');

        if (currentQuestionIndex < quizData.length - 1) {
            nextButton.classList.remove('hidden');
        } else {
            scoreDisplay.textContent = score;
            setTimeout(() => {
                feedbackSection.classList.add('hidden');
                quizResults.classList.remove('hidden');
                vif
            }, 14000);
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        }
    });

    saveScoreButton.addEventListener('click', saveScore);

    playAgainButton.addEventListener('click', function() {
        initQuiz();
    });

    // Initialize the quiz
    initQuiz();
});