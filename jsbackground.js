/*

0 - Hole in the floor
1 - Ball obstacle
2 - Invincibility

*/
const gameAreaHeight = 600;
const gameAreaWidth = 1500;
const groundHeight = 150;
const gameArea = document.getElementById("gameArea")
const ctx = gameArea.getContext('2d')
const frameRate = 20;
const player = new genPlayer(60,300,"greenyellow",60,60)
var frameNumber = 0
var gravity = 0.5
var obstacleSpeed = -5
const obstacleObj = []
var score = 1
var highScore = localStorage.getItem("highScore")
frameIntreval = setInterval(Update  , frameRate)
//roof
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, gameAreaWidth, groundHeight);
//floor
ctx.fillStyle = 'black';
ctx.fillRect(0, gameAreaHeight - groundHeight, gameAreaWidth, groundHeight);
var obsFrame = 150
const maxScore = 1
const scoreText = document.querySelector("#scoreText")
const gameOverDiv = document.querySelector("#gameOver")

const powerUps = []

const invincibilityTime = 10000
var isInvincible = false

function stopGame()
{
    clearInterval(frameIntreval) // Clearing the intreval
    setTimeout(endGame, 300) //A small time gap to show the screen when the player dies
}
function endGame()
{
    //checking and updating highscore
    if(highScore == null)
    {    
        localStorage.setItem("highScore",score);
        highScore = score;
    }
    else
        if(score>highScore)
        {
            localStorage.setItem("highScore",score);
            highScore = score;
        }
    //Drawing the game over screen
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);
    ctx.fillStyle = 'darkorchid'
    ctx.font = '40px Arial'
    ctx.textAlign = "center";
    ctx.fillText("You lost!", gameArea.width/2, gameArea.height/2);
    ctx.fillText("Score : "+score, gameArea.width/2, (gameArea.height/2)+50)
    ctx.fillText("High Score : "+highScore, gameArea.width/2, (gameArea.height/2)+100)
    gameOverDiv.innerHTML = "<input id = 'restart' type = 'button' onclick = 'location.reload()' value = 'Restart'>"
}
//player
function genPlayer(x, y, color, width, height)
{
    this.x = x;
    this.y = y;
    this.color = color
    this.width = width;
    this.height = height;
    this.xVel = 0;
    this.yVel = 0;
    this.orientation = gravity;
    //Drawing the triangle
    ctx.beginPath()
    ctx.moveTo(this.x , this.y + this.height)
    ctx.lineTo(this.x + this.width, this.y + this.height)
    ctx.lineTo(this.x + this.width/2, this.y)
    ctx.closePath()
    //Filling the color
    ctx.fillStyle = color
    ctx.fill()
    this.update = function() 
    {
        this.orientation = gravity
        if(this.orientation == 0.5){
            //Drawing the triangle
            ctx.beginPath()
            ctx.moveTo(this.x , this.y + this.height)
            ctx.lineTo(this.x + this.width, this.y + this.height)
            ctx.lineTo(this.x + this.width/2, this.y)
            ctx.closePath()
            //Filling the color
            ctx.fillStyle = color
            ctx.fill()
        }
        else{
            //Drawing the triangle
            ctx.beginPath()
            ctx.moveTo(this.x , this.y)
            ctx.lineTo(this.x + this.width, this.y)
            ctx.lineTo(this.x + this.width/2, this.y  + this.height)
            ctx.closePath()
            //Filling the color
            ctx.fillStyle = color
            ctx.fill()
        }
    }
    //finding the new position
    this.newPos = function() 
    {
        this.x += this.xVel;
        this.y += this.yVel;
    }
    this.collision = function(collider, obsType)
    {
        if(obsType == 0)
        {
            if(this.isGrounded())
            {
                if(gravity > 0)
                    if(this.x + this.width > collider.x && this.x < collider.x + collider.width && this.y > collider.y - 100 && collider.y > 300)
                        stopGame()
                if(gravity < 0)
                    if(this.x + this.width > collider.x && this.x < collider.x + collider.width && this.y < collider.y + 300 && collider.y < 300)
                        stopGame()

            }
            else
                return false
        }
        if(obsType == 1){
            if(Math.sqrt(Math.pow((this.x + this.width/2 - collider.x),2)+Math.pow((this.y + this.height/2 - collider.y),2)) < (collider.radius + Math.sqrt(Math.pow(this.height/2, 2) + Math.pow(this.width/2, 2))))
                stopGame()
        }
        if(obsType == 2){
            if(Math.sqrt(Math.pow((this.x + this.width/2 - collider.x),2)+Math.pow((this.y + this.height/2 - collider.y),2)) < (collider.radius + Math.sqrt(Math.pow(this.height/2, 2) + Math.pow(this.width/2, 2))) && !collider.isPickedUp)
            {    
                isInvincible = true
                collider.isPickedUp = true
                document.body.style.backgroundColor = "cyan"
                setTimeout(endInvincibility, invincibilityTime)
            }
        }
    }
    this.isGrounded = function()
    {
        if((this.y < gameAreaHeight - groundHeight - this.width && gravity > 0) || (this.y > groundHeight  && gravity < 0))
            return false
        return true
    }
}

function endInvincibility(){
    isInvincible = false
    document.body.style.backgroundColor = "gold"
}

function hole(x, y, width, height)
{
    this.obsType = 0
    this.x = x
    this.y = y
    this.color = "goldenrod"
    this.width = width
    this.height = height
    this.xVel = obstacleSpeed;
    this.yVel = 0;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, width, height);   
    this.update = function() 
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //finding the new position
    this.newPos = function() 
    {
        this.x += this.xVel;
        this.y += this.yVel;
    } 
    this.updateSpeed = function(speedReductionFactor)
    {
        this.xVel = this.xVel / speedReductionFactor
        this.yVel = this.yVel / speedReductionFactor
    }
}

function ball(x, y, radius)
{
    this.obsType = 1
    this.x = x
    this.y = y
    this.color = "red"
    this.radius = radius
    this.xVel = obstacleSpeed;
    this.yVel = 5;
    this.direction = 1;
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.closePath()

    ctx.fillStyle = this.color
    ctx.fill()

    this.update = function() 
    {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.closePath()

        ctx.fillStyle = this.color
        ctx.fill()
    }
    this.updateSpeed = function(speedReductionFactor)
    {
        this.xVel = this.xVel / speedReductionFactor
        this.yVel = this.yVel / speedReductionFactor
    }
    this.newPos = function() 
    {
        if(this.direction == 1){
            this.x += this.xVel;
            this.y -= this.yVel;
            if(this.y < groundHeight)
                this.direction = -1
        }
        else{
            this.x += this.xVel;
            this.y += this.yVel;
            if(this.y > gameAreaHeight - groundHeight)
                this.direction = 1
        }
    } 
}
function powerUp(x, y, radius, color, type)
{
    this.isPickedUp = false
    this.type = type;
    this.x = x
    this.y = y
    this.color = color
    this.radius = radius
    this.xVel = obstacleSpeed;
    this.yVel = 0;
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.closePath()

    ctx.fillStyle = this.color
    ctx.fill()

    this.update = function() 
    {
        if(!this.isPickedUp)
        {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
            ctx.closePath()

            ctx.fillStyle = this.color
            ctx.fill()
        }
    }
    this.updateSpeed = function(speedReductionFactor)
    {
        this.xVel = this.xVel / speedReductionFactor
        this.yVel = this.yVel / speedReductionFactor
    }
    this.newPos = function() 
    {
        this.x += this.xVel;
    } 
}
function addObstacle(pos, obsType)
{
    var tempObs
    if(obsType == 0){
        if(pos == 0)
            tempObs= new hole(gameAreaWidth,gameAreaHeight - groundHeight ,200, groundHeight)
        else
            tempObs= new hole(gameAreaWidth,0,200,groundHeight)
    }
    else if(obsType == 1){
        if(pos == 0)
            tempObs= new ball(gameAreaWidth, gameAreaHeight/2, 30)
        else
            tempObs= new ball(gameAreaWidth, gameAreaHeight/2, 30)
    }
    obstacleObj.push(tempObs)
}
function addPowerUp()
{
    var tempPower
    tempPower = new powerUp(gameAreaWidth, gameAreaHeight/2, 10, "red", 2 * Math.PI)
    powerUps.push(tempPower)
}
function gengravity()
{
    if(!player.isGrounded())
    {
        player.yVel += gravity
    }
    else
        player.yVel = 0
}

function onClick()
{
    if(player.isGrounded())
    {   
        gravity = -gravity
        player.yVel = 0
    }
}

//UPDATE
function Update()
{
    frameNumber += 1;
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);
    //roof
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameAreaWidth, groundHeight);
    //floor
    ctx.fillStyle = 'black';
    ctx.fillRect(0, gameAreaHeight - groundHeight, gameAreaWidth, groundHeight);
    player.newPos()
    player.update()
    for(let i = 0; i < obstacleObj.length; i++)
    {
        obstacleObj[i].newPos()
        obstacleObj[i].update()
        if(!isInvincible)
            player.collision(obstacleObj[i], obstacleObj[i].obsType)
    }
    for(let i = 0; i < powerUps.length; i++)
    {
        powerUps[i].newPos()
        powerUps[i].update()
        player.collision(powerUps[i], 2)
    }
    gengravity()
    if(frameNumber%obsFrame == 0)
    {
        pos = Math.floor(Math.random()*2)
        obsType = Math.floor(Math.random()*2)
        addObstacle(pos, obsType)
    }
    if(frameNumber%(3/2*obsFrame) == 0)
    {
        addPowerUp()
    }
    if(score<100)
        obstacleSpeed = -5
    else if(score < 200 && score > 100)
        obstacleSpeed = -5.5
    else if(score < 400 && score > 200)
        obstacleSpeed = -6
    else if(score < 1000 && score > 400)
        obstacleSpeed = -7
    else
        obstacleSpeed = -8
    if(frameNumber%10 == 0)
        score++;
    scoreText.innerHTML = "Score: "+ score 
}
