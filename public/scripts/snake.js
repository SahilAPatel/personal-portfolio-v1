// Reference canvas to setup context varible
var c = document.getElementById("snake-game");
var ctx = c.getContext("2d");

// Snake game class
// Used class so that paramteres such as score, snake and apple can be unviersal to functions
class snakeGame {
    constructor(){
        // Counter for frame timer division
        this.timeCounter = 0;

        // Score and best score counter
        this.score = 0;
        this.bestScore = 0;

        // Snake Object, contains x,y cords, x,y velcoity and array for body cords 
        this.snake = {
            x: 210,
            y: 300,
        
            xvelocity: 15,
            yvelocity: 0,
            
            body: [],
        };
        
        // Apple Object, contains x,y cords
        this.apple = {
            x: 420,
            y: 300
        };

        // Starts first frame when calling class
        requestAnimationFrame(()=>this.gameLoop());
    }

    // Identicle to constructor except the bestscore does not reset
    resetGame(){
        this.score = 0;
        this.timeCounter = 0;

        this.snake = {
            x: 210,
            y: 300,
        
            xvelocity: 15,
            yvelocity: 0,
            
            body: [],
        };
        
        this.apple = {
            x: 420,
            y: 300
        };
    }

    // Uses Math.Random to calcualte random location for apple
    newApple(){
        // randomize from 0-40 because I want to multiply with 15 so the apple is on the grid
        // x
        var randomNum = Math.floor(Math.random() * 40);
        this.apple.x = randomNum*15;
        // y
        randomNum = Math.floor(Math.random() * 40);
        this.apple.y = randomNum*15;
    }

    // Main game loop
    gameLoop() {
        //keeps calling for frame
        requestAnimationFrame(()=>this.gameLoop());
        
        //only allows the frame to go through if counter reaches 8
        this.timeCounter += 1;
        if(this.timeCounter < 8) {
            return;
        }

        //once counter gets to 8, resets the timer and clears the canvas for drawing
        this.timeCounter = 0;
        ctx.clearRect(0, 0, c.width, c.height);

        //draw apple in red
        ctx.fillStyle = "red";
        ctx.fillRect(this.apple.x, this.apple.y, 14, 14);

        //draw snake head
        ctx.fillStyle = "green";
        ctx.fillRect(this.snake.x, this.snake.y, 14, 14);

        //draw body and check collision in the same for loop
        //if collision occurs with body, calls gameover function
        for(var i=0; i<this.snake.body.length; i++){
            if(this.snake.x == this.snake.body[i][0] && this.snake.y == this.snake.body[i][1]){
                this.gameOver();
            }
            ctx.fillRect(this.snake.body[i][0], this.snake.body[i][1], 14, 14);
        }

        //Check collision of head with apple
        //if apple ate, increments score and gets new apple cordinates
        //updates p to show new score
        if(this.snake.x == this.apple.x && this.snake.y == this.apple.y){
            this.score += 1;
            this.newApple();
            document.getElementById("score").innerHTML = "Score: " + this.score;
        }
    
        //Adds the coordiantes of the head to the body array
        //dosent pop the tail if the score is higher than the snakes body length
        this.snake.body.push([this.snake.x, this.snake.y]);
        if(this.snake.body.length > this.score){
            this.snake.body.shift();
        }

        //add the velocity to the coordinates of the snake
        this.snake.x += this.snake.xvelocity;
        this.snake.y += this.snake.yvelocity;

        //check if snake hit the border
        if(this.snake.x > 599 || this.snake.x < 0 || this.snake.y > 599 || this.snake.y < 0){
            this.gameOver();
        }
    }

    //Game over function
    //Function only called after snake and apple have been drawn, so no visual bug happens
    gameOver() {
        //update score to 0
        document.getElementById("score").innerHTML = "Score: 0";

        //Check for new best score
        //Update the best score and send new status message based on result
        if(this.score == this.bestScore){
            document.getElementById("status").innerHTML = "You tied your best score!";
        } else if(this.score > this.bestScore){
            this.bestScore = this.score;
            document.getElementById("status").innerHTML = "NEW BEST SCORE!";
            document.getElementById("bestScore").innerHTML = "Best Score: " + this.score;
        } else {
            document.getElementById("status").innerHTML = "Nice try! Your last score was: " + this.score;
        }

        //reset game parameters
        this.resetGame()
    }
}

//make new game object to launch game
game = new snakeGame();

//Event listener for key press calls changeDirection function
document.addEventListener('keydown', changeDirection);
//Make sure either hjkl has been pressed and only change direction if it is viable
function changeDirection(event) {
    console.log(event);
    if (event.key == 'h' && game.snake.xvelocity == 0) {
        game.snake.xvelocity = -15;
        game.snake.yvelocity = 0;
    }
    else if(event.key == 'j' && game.snake.yvelocity == 0) {
        game.snake.xvelocity = 0;
        game.snake.yvelocity = 15;
    }
    else if(event.key == 'k' && game.snake.yvelocity == 0) {
        game.snake.xvelocity = 0;
        game.snake.yvelocity = -15;
    }
    else if(event.key == 'l' && game.snake.xvelocity == 0) {
        game.snake.xvelocity = 15;
        game.snake.yvelocity = 0;
    }
}