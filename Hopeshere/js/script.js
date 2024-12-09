const matrix = document.getElementById('matrix');
const columns = [];
let sourceChars = 'Have Hope'; // Words/phrases as source

// Set up the number of columns and rows
const colCount = Math.floor(window.innerWidth / 20);
const rowCount = Math.floor(window.innerHeight / 20);

// Modify the speed range here
const MIN_SPEED = 1; // Minimum speed of falling characters
const MAX_SPEED = 2; // Maximum speed of falling characters

// Create a "column" for each vertical line
for (let i = 0; i < colCount; i++) {
    columns.push({
        y: Math.random() * rowCount, // Start position of the falling characters
        speed: Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED, // Random speed within the defined range
    });
}

// Function to generate a random character
function randomChar() {
    if (sourceChars.length === 0) return '';
    return sourceChars[Math.floor(Math.random() * sourceChars.length)];
}

// Function to create the matrix effect
function drawMatrix() {
    matrix.innerHTML = ''; // Clear the matrix before re-rendering

    // Loop through each column and generate falling code
    for (let i = 0; i < colCount; i++) {
        const column = columns[i];

        // Create the falling text by appending new characters
        const char = document.createElement('span');
        char.style.position = 'absolute';
        char.style.left = (i * 20) + 'px';
        char.style.top = column.y * 20 + 'px';
        char.style.fontSize = '20px';
        char.style.color = '#00ff00';
        char.textContent = randomChar();

        // Append to the matrix container
        matrix.appendChild(char);

        // Move the character down the screen
        column.y += column.speed;

        // Reset the position once the character reaches the bottom
        if (column.y > rowCount) {
            column.y = 0;
        }
    }

    // Continue the animation by calling the drawMatrix function again
    requestAnimationFrame(drawMatrix);
}

// Start the animation
drawMatrix();
