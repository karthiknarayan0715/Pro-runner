const gameArea = document.getElementById("gameArea")
const ctx = gameArea.getContext('2d')
const frameRate = 20;
const player = new genPlayer(60,300,"greenyellow",60,60)
var frameNumber = 0
var gravity = 0.1
var obstacleSpeed = -5
const obstacleObj = []
var score = 0
frameIntreval = setInterval(Update  , frameRate)
//roof
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 1500, 100);
//floor
ctx.fillStyle = 'black';
ctx.fillRect(0, 500, 1500, 100);
var obsFrame = 150
const scoreText = document.querySelector("#scoreText")
function stopGame()
{
    clearInterval(frameIntreval)
    setTimeout(endGame, 300)
}
function endGame()
{
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);
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
        if((this.y < 500 - this.width && gravity == 0.1) || (this.y > 100  && gravity == -0.1))
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
    if(frameNumber%10 == 0)
        score++;
    scoreText.innerHTML = "Score: "+ score 
}