const VIEWPORT_WIDTH = 640; //Viewport width
const VIEWPORT_HEIGHT = 480; //Viewport height
const VIEWPORT_COLOR = "#000000";
const FRAMES_PER_MILLISECOND = 10; //How often the render function is called
//Starting values of graphics entities
//Paddle
const PADDLE_WIDTH = 75; //Width of the paddle
const PADDLE_HEIGHT = 5; //The height of the paddle
const PADDLE_START_X = (VIEWPORT_WIDTH/2) - (PADDLE_WIDTH/2);
const PADDLE_START_Y = 450;
const PADDLE_COLOR = "#1ED99B";
//Ball
const BALL_RADIUS = 10; //Radius of the ball
const BALL_START_X = PADDLE_START_X + (PADDLE_WIDTH/2);
const BALL_START_Y = PADDLE_START_Y - BALL_RADIUS;
const BALL_START_VELX = 1;
const BALL_START_VELY = -3;
const BALL_COLOR = "#FF03CD";
const MAX_BALL_SPEED =3;
//Bricks 
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 4;

const BRICK_COLORS = ["#107EDE","#FFFF00","#FF0000"];

//Objects for handling the game
var draw; //Raster object for drawing
var viewPort; //Canvas to draw on
var gameLoopHandle; //Game loop handle
var scoreLabel; //Label for updating the score
var livesLabel; //Label for trackering the remaining lives
var score =0; //The actual score value
var lives = 3; //Number of lives the player has
var level = 1;

//Game entities
var ball; //The ball
var paddle; //The paddle
var brick = []; //An array of the bricks

var gameOver = false;
var gameWon = false;
var running = false;
var CHEAT_ON = false; //Cheats to make things easier


window.addEventListener("load", windowLoaded, false);

function windowLoaded(){ //After the window and elements have been loaded
	newGame(); //Initialize the game
	render();
}

function toggleStartStop(){ //Toggle starting and stopping the game
	if(!running){
		startGame();
	}
	else{
		stopGame();
	}
}
function startGame(){ //Start the game
	if(gameOver){
		if (!gameWon && lives > 0) {
			initObjects();
		}
		else {
			newGame();
		}
	}
	gameLoopHandle = setInterval(gameLoop, FRAMES_PER_MILLISECOND); //Start the rendering loop and get its handle
	running = true;
}
function stopGame(){ //Stop the game
	clearInterval(gameLoopHandle);
	running = false;
}
function gameEnded(){ //End the game due to a condition
	if(gameWon){
		alert("Game Won");
	}
	else if (--lives == 0) {
		alert("Game Over");
	}
	updateLives();
	stopGame();		
}

function newGame() { //Setup a new game
	//Get and set element and other related objects
	viewPort = document.getElementById("canvasMain");
	viewPort.width = VIEWPORT_WIDTH;
	viewPort.height = VIEWPORT_HEIGHT;
	viewPort.style.backgroundColor = VIEWPORT_COLOR;
	
	scoreLabel = document.getElementById("lblScore");
	livesLabel = document.getElementById("lblLives");
	
	draw = viewPort.getContext("2d");
	
	//Init game entities
	ball = new Ball();
	paddle = new Paddle();
	
	brick = [];
	createBricks();
	
	score =0;
	lives =3;
	updateScore();
	updateLives();
	
	initObjects();
	
	document.addEventListener("mousemove", mouseMoveHandler, false);
}

function initObjects(){ //Initialize the objects needed
	ball.x = BALL_START_X;
	ball.y = BALL_START_Y;
	ball.velX = BALL_START_VELX;
	ball.velY = BALL_START_VELY;
	ball.color = BALL_COLOR;
	
	paddle.updateX(PADDLE_START_X);
	paddle.updateY(PADDLE_START_Y);
	paddle.color = PADDLE_COLOR;
	
	gameOver = false;
	gameWon = false;
}

function gameLoop(){ //The game loop
	if(!gameOver){
		updateObjects(); //Update all the objects in the scene
		applyPhysics(); //Apply physics to the objects
		render(); //Draw the everything
	}
	else{
		gameEnded();
	}	
}

function render(){ //The rendering loop
	draw.clearRect(0, 0, viewPort.width, viewPort.height); //Clear the screen
	ball.render();
	paddle.render();
	for(var counter=0; counter < brick.length; counter++){ //Render all the bricks in the brick array
		brick[counter].render();
	}
}

function updateObjects(){ //Update the scene objects
	ball.x += ball.velX;
	ball.y += ball.velY;
}	

function applyPhysics(){ //Apply physics to objects
	applyBoundary();
	applyPaddle();
	applyBrick();	
}

function applyBoundary(){ //Apply the boundaries to the ball
	if(ball.x + ball.radius > VIEWPORT_WIDTH){
		ball.x = VIEWPORT_WIDTH - ball.radius;
		ball.velX = -ball.velX;
	} 
	else if(ball.x - ball.radius < 0){	
		ball.x = ball.radius;
		ball.velX = -ball.velX;
	}
	else if(ball.y - ball.radius < 0){
		ball.y = ball.radius;
		ball.velY = -ball.velY;
	}
	else if(ball.y + ball.radius > VIEWPORT_HEIGHT ){
		if(!CHEAT_ON){
			gameOver = true;
		}
		else{
			ball.y = VIEWPORT_HEIGHT - ball.radius;
			ball.velY = -ball.velY;
		}
	}
}

function applyPaddle(){ //Apply the paddle physics to the ball
	var distTop = calcDistance(ball.x, ball.x, ball.y, paddle.top) - ball.radius;
	var distLeft = calcDistance(ball.x, paddle.left, ball.y, ball.y) - ball.radius;
	var distRight = calcDistance(ball.x, paddle.right, ball.y, ball.y) - ball.radius;
	
	if(distLeft <= paddle.width && distRight <= paddle.width){ //if ball is above paddle
		if(distTop <=0){ //and ball hit paddle
			ball.y = paddle.top - ball.radius;
			ball.velY = -ball.velY;
			
			var distCenterX = calcDistance(ball.x, paddle.centerX, ball.y, ball.y) *2;
			var xScale = (distCenterX / paddle.width) * MAX_BALL_SPEED;
						
			if(ball.x > paddle.centerX){
				ball.velX += xScale;
			}
			else{
				ball.velX -= xScale;
			}			
			
			if(Math.abs(ball.velX) > MAX_BALL_SPEED){
				if(ball.velX >0){
					ball.velX = MAX_BALL_SPEED;
				}
				else{
					ball.velX = -MAX_BALL_SPEED;
				}
			}
		}
	}
}

function applyBrick(){ //Apply the brick physics
	var nearBrickIndex; //The closest brick to the ball
	var currentDistance = VIEWPORT_WIDTH *2;
		
	for(var counter =0; counter < brick.length; counter++){ //Loop over all the bricks and find the nearest brick
		 var currentBrick = brick[counter];
		 var distance = calcDistance(currentBrick.centerX, ball.x, currentBrick.centerY, ball.y);
		 
		 if(distance < currentDistance){
		 	currentDistance = distance;
		 	nearBrickIndex = counter;
		 }
	}
	
	collideBrick(nearBrickIndex);
}

function collideBrick(nearBrickIndex){ //Check for a collision with the nearest brick	
	
	var nearBrick = brick[nearBrickIndex];
	
	var distTop = calcDistance(ball.x, ball.x, ball.y, nearBrick.top);
	var distBottom = calcDistance(ball.x, ball.x, ball.y, nearBrick.bottom); 
	var distLeft = calcDistance(ball.x, nearBrick.left, ball.y, ball.y);
	var distRight = calcDistance(ball.x, nearBrick.right, ball.y, ball.y);
	
	if(distLeft <= nearBrick.width && distRight <= nearBrick.width){ //Check for top and bottom collision
		if(distBottom - ball.radius <= 0 || distTop - ball.radius <=0){
			if(!CHEAT_ON){
				ball.velY = -ball.velY;	
			}
			destroyBrick(nearBrickIndex);
		}
	}
	else if(distTop <= nearBrick.height && distBottom <= nearBrick.height){ //Check for left or right collision
		if(distLeft - ball.radius <=0 || distRight - ball.radius <=0){
			if(!CHEAT_ON){
				ball.velX = -ball.velX;
			}
			destroyBrick(nearBrickIndex);
		}
	}	
}

function destroyBrick(targetBrickIndex){ //Destroy a targeted brick

	var targetBrick = brick[targetBrickIndex];
	
	if (!CHEAT_ON && targetBrick.hp>0) {
		targetBrick.color=BRICK_COLORS[--targetBrick.hp];
	}
	else {
		brick.splice(targetBrickIndex, 1);
		
		if(brick.length == 0){
			gameWon = true;
			gameOver = true;
		}
	}
	
	if (CHEAT_ON) {
		score+=targetBrick.hp+1;
	}
	else {
		score++;
	}
	
	updateScore();
}

function mouseMoveHandler(event){ //Handle the mouse moving
	var relX = event.clientX - viewPort.offsetLeft;
	if(relX > 0 && relX < VIEWPORT_WIDTH){
		paddle.updateX(relX - paddle.width/2);
	}
}

function calcDistance(x1, x2, y1, y2){ //Calculate the distance of two objects
	var x2x1 = Math.pow(x2-x1,2);
	var y2y1 = Math.pow(y2-y1,2);
	
	return Math.sqrt(x2x1 + y2y1);
}

function createBricks(){ //Create the brick objects
	var yPos = 46;
	var hp=0;
	
	for(var rowCounter=0; rowCounter < 6; rowCounter++){
		
		var xPos = 66;
		hp=(rowCounter+2)%3;
		
		for(var colCounter=0; colCounter < 8; colCounter++){
			brick.push(new Brick(xPos, yPos, hp));
			xPos += BRICK_PADDING + BRICK_WIDTH;
		}
		
		yPos += BRICK_PADDING + BRICK_HEIGHT;
	}	
}

function drawText(x, y, string, color){
	draw.fillStyle = color;
	draw.font = "20px _sans";
	draw.baseline = "top";
	draw.fillText(string, x, y);
}

function drawRect(x, y, width, height, color){ //Draw a rectangle
	draw.beginPath();
	draw.rect(x, y, width, height);
	draw.fillStyle = color;
	draw.fill();
	draw.closePath();
}

function drawCircle(x, y, radius, color){ //Draw a circle
	draw.beginPath();
	draw.arc(x, y, radius, 0, Math.PI*2, false);
	draw.fillStyle = color;
	draw.fill();
	draw.closePath();
}

function updateScore(){ //Update the score
	scoreLabel.innerHTML = "Score: " + score.toString();
}

function updateLives(){ //Update the lives
	livesLabel.innerHTML = "Lives: " + lives.toString();
}

function toggleCheat(){ //Toggle the cheats on and off
	
	var button = document.getElementById("btnCheat");
		
	if(CHEAT_ON){ //If cheats are enabled
		button.value = "Enable Cheats";
		CHEAT_ON = false;
	}
	else{
		button.value = "Disable Cheats";
		CHEAT_ON = true;
	}	
}

//==============================================================[Abstract Objects]===========================================================================
var Entity = function(){ //A game entity
	this.x =0;
	this.y =0;
	this.color = "#AAAAAA";
};
Entity.prototype.drawEntity = function(){}; //The inherited draw function
Entity.prototype.render = function(){ //The render function
	this.drawEntity();
};

var Paddle = function(){ //The Paddle	
	this.width = PADDLE_WIDTH;
	this.height = PADDLE_HEIGHT;
	//Center
	this.centerX =0;
	this.centerY =0;
	this.colorCenter = "#FF0000";
	//Boundaries of the paddle
	this.left =0;
	this.right =0;
	this.top =0;
	this.bottom =0;
};
Paddle.prototype = new Entity();
Paddle.prototype.drawEntity = function(){
	drawRect(this.x, this.y, this.width, this.height, this.color);
	drawRect(this.centerX - 2, this.y, 4, this.height, this.colorCenter);
};
Paddle.prototype.updateX = function(x){
	this.x = x;
	this.centerX = this.x + this.width/2;
	this.left = x;
	this.right = x + this.width;
};
Paddle.prototype.updateY = function(y){
	this.y = y;
	this.centerY = this.y + this.width/2;
	this.top = y;
	this.bottom = this.height;
};

var Ball = function(){ //The ball object
	//Velocity of the ball;
	this.velX = BALL_START_VELX;
	this.velY = BALL_START_VELY;
	//Properties of the ball
	this.radius = BALL_RADIUS;
};
Ball.prototype = new Entity();
Ball.prototype.drawEntity = function(){
	drawCircle(this.x, this.y, this.radius, this.color);
};

var Brick = function(x, y, hp){ //Brick object
	this.width = BRICK_WIDTH;
	this.height = BRICK_HEIGHT;
	
	this.x = x;
	this.y = y;
	//Set the center
	this.centerX = (this.width /2) + this.x;
	this.centerY = (this.height /2) + this.y;
	//Set the edges
	this.left = this.x;
	this.right = this.x + this.width;
	this.top = this.y;
	this.bottom = this.y + this.height;
	
	this.hp=hp;
	this.color=BRICK_COLORS[hp];
};
Brick.prototype = new Entity();
Brick.prototype.drawEntity = function(){
	drawRect(this.x, this.y, this.width, this.height, this.color);
};
Brick.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;
	//Set the center
	this.centerX = (this.width /2) + this.x;
	this.centerY = (this.height /2) + this.y;
	//Set the edges
	this.left = this.x;
	this.right = this.x + this.width;
	this.top = this.y;
	this.bottom = this.y + this.height;
};
