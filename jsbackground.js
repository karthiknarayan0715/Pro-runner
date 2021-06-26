st gameArea = document.getElementById("gameArea")
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
ctx.fillRect(0, 0, 1500, 100);
//floor
ctx.fillStyle = 'black';
ctx.fillRect(0, 500, 1500, 100);
var obsFrame = 150
const maxScore = 1
const scoreText = document.querySelector("#scoreText")
const gameOverDiv = document.querySelector("#gameOver")
function stopGame()
{
    clearInterval(frameIntreval)
    setTimeout(endGame, 300)
}
function endGame()
{
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
    this.color = color;
    this.width = width;
    this.height = height;
    this.xVel = 0;
    this.yVel = 0;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);    
    this.update = function() 
    {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //finding the new position
    this.newPos = function() 
    {
        this.x += this.xVel;
        this.y += this.yVel;
    }
    this.collision = function(collider)
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
    this.isGrounded = function()
    {
        if((this.y < 500 - this.width && gravity > 0) || (this.y > 100  && gravity < 0))
            return false
        return true
    }
}

function obstacle(x, y, width, height)
{
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
}

function addObstacle(pos)
{
    var tempObs
    if(pos == 0)
        tempObs= new obstacle(1500,500,200,100)
    else
        tempObs= new obstacle(1500,0,200,100)
    obstacleObj.push(tempObs)
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
    ctx.fillRect(0, 0, 1500, 100);
    //floor
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 500, 1500, 100);
    player.newPos()
    player.update()
    for(let i = 0; i < obstacleObj.length; i++)
    {
        obstacleObj[i].newPos()
        obstacleObj[i].update()
        player.collision(obstacleObj[i])
    }
    gengravity()
    if(frameNumber%obsFrame == 0)
    {
        pos = Math.floor(Math.random()*2)
        addObstacle(pos)
    }
    if(score<100)
        obsFrame = 150
    else if(score < 200 && score > 100)
        obsFrame = 125
    else if(score < 400 && score > 200)
        obsFrame = 100
    else if(score < 1000 && score > 400)
        obsFrame = 75
    else
        obsFrame = 50
    if(frameNumber%10 == 0)
        score++;
    scoreText.innerHTML = "Score: "+ score 
}
