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
            correctAnswer: 2, // Index of the correct answer
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
            image: "data/error.png",
            options: [
                "LiDAR scanners",
                "Embedded cameras",
                "Parking Sensors",
                "None of the above"
            ],
            correctAnswer: 0,
            explanation: "Audi was the first car manufacturer to include a LiDAR system for it's Traffic Jam Pilot.",
            videoExplanation: "data/heavyRainConditions.mp4"
        }
    ];

    // DOM elements
    const questionNumber = document.getElementById('question-number');
    const totalQuestions = document.getElementById('total-questions');
    const questionImg = document.getElementById('question-img');
    const questionText = document.getElementById('question-text');
    const questionDescription = document.getElementById('question-description');
    const answersList = document.getElementById('answers-list');
    const submitButton = document.getElementById('submit-btn');
    const nextButton = document.getElementById('next-btn');
    const restartButton = document.getElementById('restart-btn');
    const feedbackSection = document.getElementById('answer-feedback');
    const explanationText = document.getElementById('answer-explanation');
    const videoSection = document.getElementById('video-explanation');
    const videoFrame = document.getElementById('explanation-video');
    const quizResults = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score');
    const maxScoreDisplay = document.getElementById('max-score');

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    // Initialize quiz
    function initQuiz() {
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        answered = false;

        // Update total questions display
        totalQuestions.textContent = quizData.length;
        maxScoreDisplay.textContent = quizData.length;

        // Hide results and show first question
        quizResults.classList.add('hidden');
        loadQuestion();
    }

    // Load current question
    function loadQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];

        // Reset state for new question
        answered = false;
        feedbackSection.classList.add('hidden');
        videoSection.classList.add('hidden');
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
        submitButton.disabled = true;

        // Stop any playing videos
        videoFrame.src = '';

        // Update question number
        questionNumber.textContent = currentQuestionIndex + 1;

        // Update question content
        questionImg.src = currentQuestion.image;
        questionText.textContent = currentQuestion.question;
        questionDescription.textContent = currentQuestion.description;

        // Clear previous answer options
        answersList.innerHTML = '';

        // Create new answer options
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

        // Enable submit button when an answer is selected
        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.addEventListener('change', function() {
                submitButton.disabled = false;
            });
        });
    }

    // Handle submit button click
    submitButton.addEventListener('click', function() {
        if (answered) return;

        // Get selected answer
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');

        if (!selectedAnswer) return;

        const selectedValue = parseInt(selectedAnswer.value);
        const currentQuestion = quizData[currentQuestionIndex];

        // Mark as answered
        answered = true;

        // Check if answer is correct
        if (selectedValue === currentQuestion.correctAnswer) {
            score++;
        }

        // Show all answer options with appropriate styling
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach((option, index) => {
            if (index === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            } else if (index === selectedValue && selectedValue !== currentQuestion.correctAnswer) {
                option.classList.add('incorrect');
            }
        });

        // Show explanation
        explanationText.textContent = currentQuestion.explanation;
        feedbackSection.classList.remove('hidden');

        // Show video explanation if available
        if (currentQuestion.videoExplanation) {
            videoFrame.src = currentQuestion.videoExplanation;
            videoSection.classList.remove('hidden');
        } else {
            videoSection.classList.add('hidden');
        }

        // Disable radio buttons after submission
        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.disabled = true;
        });

        // Hide submit button and show next button
        submitButton.classList.add('hidden');

        // Show next button if there are more questions, otherwise show results
        if (currentQuestionIndex < quizData.length - 1) {
            nextButton.classList.remove('hidden');
        } else {
            // Update score display
            scoreDisplay.textContent = score;

            // Show quiz results after a short delay
            setTimeout(() => {
                feedbackSection.classList.add('hidden');
                quizResults.classList.remove('hidden');
            }, 20000);
        }
    });

    // Handle next button click
    nextButton.addEventListener('click', function() {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        }
    });

    // Handle restart button click
    restartButton.addEventListener('click', function() {
        initQuiz();
    });

    // Initialize the quiz
    initQuiz();
});