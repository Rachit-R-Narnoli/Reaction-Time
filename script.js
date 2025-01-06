// Game state variables
let waitingForClick = false;
let startTime = 0;
let timeoutId = null;
let bestTime = Infinity;
let totalTime = 0;
let testsCompleted = 0;

// DOM elements
const reactionBox = document.getElementById('reaction-test');
const lastTimeSpan = document.getElementById('last-time');
const bestTimeSpan = document.getElementById('best-time');
const averageTimeSpan = document.getElementById('average-time');
const testsCompletedSpan = document.getElementById('tests-completed');

// Start the reaction test
function startTest() {
    reactionBox.className = 'reaction-box waiting';
    reactionBox.textContent = 'Wait for green...';
    
    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000;
    
    waitingForClick = true;
    
    timeoutId = setTimeout(() => {
        if (waitingForClick) {
            reactionBox.className = 'reaction-box ready';
            reactionBox.textContent = 'Click Now!';
            startTime = Date.now();
        }
    }, delay);
}

// Handle clicks on the reaction box
reactionBox.addEventListener('click', () => {
    if (!waitingForClick) {
        startTest();
        return;
    }
    
    if (startTime === 0) {
        // Clicked too early
        clearTimeout(timeoutId);
        waitingForClick = false;
        reactionBox.className = 'reaction-box clicked';
        reactionBox.textContent = 'Too early! Click to try again.';
        return;
    }
    
    // Calculate reaction time
    const endTime = Date.now();
    const reactionTime = endTime - startTime;
    
    // Update stats
    bestTime = Math.min(bestTime, reactionTime);
    totalTime += reactionTime;
    testsCompleted++;
    
    // Update display
    lastTimeSpan.textContent = `${reactionTime}ms`;
    bestTimeSpan.textContent = bestTime === Infinity ? '-' : `${bestTime}ms`;
    averageTimeSpan.textContent = `${Math.round(totalTime / testsCompleted)}ms`;
    testsCompletedSpan.textContent = testsCompleted;
    
    // Reset for next test
    waitingForClick = false;
    startTime = 0;
    
    // Update UI
    reactionBox.className = 'reaction-box clicked';
    reactionBox.textContent = `${reactionTime}ms - Click to try again!`;
});

// Color Click Challenge
function startColorChallenge() {
    const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];
    const game = document.getElementById('color-challenge');
    let score = 0;
    let timeoutId;

    function showColor() {
        const color = colors[Math.floor(Math.random() * colors.length)];
        game.style.background = color;
        timeoutId = setTimeout(() => {
            game.style.background = '#f1f5f9';
            endGame();
        }, 1000);
    }

    function handleClick() {
        clearTimeout(timeoutId);
        score++;
        game.textContent = `Score: ${score}`;
        game.style.background = '#f1f5f9';
        setTimeout(showColor, 500);
    }

    function endGame() {
        game.textContent = `Game Over! Score: ${score}`;
        game.removeEventListener('click', handleClick);
    }

    game.addEventListener('click', handleClick);
    game.textContent = 'Click the colors!';
    showColor();
}

// Number Flash Game
function startNumberGame() {
    const game = document.getElementById('number-game');
    let sequence = [];
    let playerSequence = [];
    let level = 1;

    function showNumber() {
        const number = Math.floor(Math.random() * 9) + 1;
        sequence.push(number);
        game.textContent = number;
        setTimeout(() => {
            game.textContent = '?';
            game.onclick = handleClick;
        }, 1000);
    }

    function handleClick() {
        const input = prompt('Enter the number you saw:');
        if (input === sequence[playerSequence.length].toString()) {
            playerSequence.push(parseInt(input));
            if (playerSequence.length === sequence.length) {
                level++;
                playerSequence = [];
                game.textContent = `Level ${level}`;
                setTimeout(showNumber, 1000);
            }
        } else {
            game.textContent = `Game Over! Level ${level}`;
            game.onclick = null;
        }
    }

    game.textContent = 'Starting...';
    setTimeout(showNumber, 1000);
}

// Simon Says Game
function startSimonGame() {
    const game = document.getElementById('simon-game');
    const colors = ['red', 'green', 'blue', 'yellow'];
    let sequence = [];
    let playerSequence = [];
    let level = 1;

    // Create game grid
    game.innerHTML = `
        <div class="simon-game-grid">
            ${colors.map(color => `
                <div class="simon-button ${color}" data-color="${color}"></div>
            `).join('')}
        </div>
    `;

    const buttons = game.querySelectorAll('.simon-button');

    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            const button = buttons[sequence[i]];
            button.style.opacity = '1';
            setTimeout(() => button.style.opacity = '0.8', 500);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                enableButtons();
            }
        }, 1000);
    }

    function enableButtons() {
        buttons.forEach((button, index) => {
            button.onclick = () => handleClick(index);
        });
    }

    function disableButtons() {
        buttons.forEach(button => button.onclick = null);
    }

    function handleClick(index) {
        playerSequence.push(index);
        buttons[index].style.opacity = '1';
        setTimeout(() => buttons[index].style.opacity = '0.8', 200);

        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            game.innerHTML = `<div class="math-problem">Game Over! Level ${level}</div>`;
            return;
        }

        if (playerSequence.length === sequence.length) {
            level++;
            playerSequence = [];
            sequence.push(Math.floor(Math.random() * 4));
            disableButtons();
            setTimeout(playSequence, 1000);
        }
    }

    sequence.push(Math.floor(Math.random() * 4));
    setTimeout(playSequence, 1000);
}


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update active link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});
