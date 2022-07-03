const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const scoreSpan = document.querySelector(".score");
const container = document.querySelector(".container");
const container2 = document.querySelector(".container2");
const again = document.querySelector(".again");
const container2Score = document.querySelector(".container2-score");



let score = 0;
let pipes = [];
let particles = [];
let hue = 0;

if(screen.availWidth > 800){
    canvas.width = 375;
    canvas.height = 567;
}else{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const canvasRect = canvas.getBoundingClientRect();

//Images
let birdImage = new Image();
birdImage.src = "./Images/bluebird-upflap.png";

const pipeImage = new Image();
pipeImage.src = "./Images/pipe-green2.png";


let pipeImage2 = new Image();
pipeImage2.src = "./Images/pipe-green.png";

const backgroundImage = new Image();
backgroundImage.src = "./Images/background-night.png";

const floorImage = new Image();
floorImage.src = "./Images/base.png";

//Sounds
const lose = new Audio();
lose.src = "./Sounds/hit.mp3";

const wing = new Audio();
wing.src = "./Sounds/wing.mp3";

const die = new Audio();
die.src = "./Sounds/die.mp3";

const point = new Audio();
point.src = "./Sounds/point.mp3";

const swoosh = new Audio();
swoosh.src = "./Sounds/swoosh.mp3";


container.addEventListener("click",() => {
    container.style.display = "none";
    swoosh.play();

let gravityY = 0.5;
let gravityX = 0.09;
let requestID;

let birdChange = 1;



setInterval(() => {
    point.play();
    score++;
},5000);

class Bird{
    constructor(x,y,width,height,velocityY,color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityY = velocityY;
        this.color = color;
        this.velocityX = 0.3;
        this.gravity = 1;
        this.friction = 6;
    }

    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.x,this.y,this.width,this.height);
        c.fill();



                birdChange > 3 ? birdChange = 1 : birdChange;

                if(birdChange === 1){
                    birdImage.src = "./Images/bluebird-midflap.png";
    
                c.drawImage(birdImage,this.x,this.y,this.width,this.height);
    
                }
                
                if(birdChange === 2){
                    birdImage.src = "./Images/bluebird-upflap.png";
                    c.drawImage(birdImage,this.x,this.y,this.width,this.height);
    
                }
                
                if(birdChange === 3){
                    birdImage.src = "./Images/bluebird-downflap.png";
                    c.drawImage(birdImage,this.x,this.y,this.width,this.height);
                }
        
            
    }

    update(){
        this.draw();


        this.y += this.velocityY;

        if(bird.velocityX === 6){
            this.x -= this.velocityX + 3;
            this.y += this.velocityY + 2;
        }else{
            this.x += this.velocityX;
        }

        if(this.y + this.height + this.velocityY < floor.y - floor.height){
                this.velocityY += gravityY;
        }else{
            this.velocityY = 0;
        }

        if(this.x + this.width < canvas.width / 2 - 10){
            this.velocityX += gravityX;
            gravityY = 0;
            this.velocityY = 0;
        }else {
            gravityX = 0;
            this.velocityX = 0;
            gravityY = 0.5;
        }

        if(this.y <= 0){
            this.y = 20;
        }
    }
}

class Pipe{
    constructor(x,y,width,height,velocityX,color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = velocityX;
        this.color = color;
    }

    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.x,this.y,this.width,this.height);
        c.fill();

        c.drawImage(pipeImage,this.x,this.y,this.width,this.height);

    }

    update(){
        this.draw();
        this.x -= this.velocityX;
    }
}

class Pipe2{
    constructor(x,y,width,height,velocityX,color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = velocityX;
        this.color = color;
    }

    draw(){
        c.save();
        c.fillStyle = this.color;
        c.beginPath();
        c.fillRect(this.x,this.y,this.width,this.height);
        c.fill();
        c.closePath();
        c.restore(); 

        c.drawImage(pipeImage2,this.x,this.y,this.width,this.height);

    }

    update(){
        this.draw();
        this.x -= this.velocityX;
    }
}


class Floor{
    constructor(x,y,width,height,color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocityX = 2;
    }
    draw(){
        c.drawImage(floorImage,this.x,this.y - this.height,this.width,this.height);

        c.fillStyle = this.color;
        c.fillRect(this.x,this.y - this.height,this.width,this.height);
        c.fill();

    }
    update(){
        this.draw();
        this.x -= this.velocityX;

    }
}

class Particle{
    constructor(x,y,r,velocityX,velocityY,color){
        this.x = x;
        this.y = y;
        this.r = r;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
    }

    draw(){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x,this.y,this.r,0,Math.PI * 2);
        c.fill();
        c.closePath();
    }

    update(){
        this.draw();

        this.x -= this.velocityX;
        this.y -= this.velocityY;

        if(this.r > 0.2){
           this.r--;
        }
    }
}

const floor = new Floor(0,canvas.height,canvas.width,100,"transparent");

let floores = [
    new Floor(0,canvas.height,500,100,"transparent"),
    new Floor(490,canvas.height,500,100,"transparent")
];


const bird = new Bird(-100,canvas.height / 2 - 100,30,30,2,"transparent");

function addFloor(){
    setInterval(() => {
        floores.push(
            new Floor(canvas.width,canvas.height,500,100,"transparent"),
         )

    },3000);
    
}

function addPipe(){

    setInterval(() => {

        let randomHeight2 = Math.floor(Math.random() * canvas.height / 2 + 50);

        if(randomHeight2 > canvas.height / 2) randomHeight2 -= 100;

        pipes.push(
            new Pipe(canvas.width,0,50,canvas.height - randomHeight2 - 250,2,"transparent"),
            new Pipe2(canvas.width,floor.y - floor.height - randomHeight2,50,randomHeight2,2,"transparent")
        );

    }, 3000);
}



function animate(){

    c.fillStyle = "black";
    c.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    bird.update();
        birdChange++;
    floores.forEach((floor,index) => {
       floor.update();
       
    })


    scoreSpan.innerHTML = score;

    particles.forEach((particle,index) => {
        particle.update();

        if(particle.r <= 0.2){
            particles.splice(index,1);
        }
    })

    pipes.forEach((pipe,index) => {
        pipe.update();

        if(pipe.x + pipe.width <= 0){
            setTimeout(() => {
                pipes.shift();
            },0)
        }

        if(pipe.x + pipe.width > bird.x + bird.velocityX &&
           pipe.x < bird.x + bird.width + bird.velocityX &&
           pipe.y + pipe.height > bird.y + bird.velocityY &&
           pipe.y < bird.y + bird.height + bird.velocityY
          ){
            point.src = "";
            lose.play();
            gameOver();
          }

    })

    hue++;

    hue === 360 ? hue = 0 : hue;

    requestID = requestAnimationFrame(animate);
}

function gameOver(){
    bird.velocityX = 6;
    setTimeout(() => {
        die.play();
        container2Score.innerHTML = scoreSpan.innerHTML;
        container2.style.display = "flex";
        cancelAnimationFrame(requestID);
    },500);
}

function reset(){
    container2.style.display = "none";

    pipes = [];
    point.src = "./Sounds/point.mp3";
    bird.x = -100;
    bird.velocityX = 2;
    gravityX = 0.7;
    bird.y = canvas.height / 2 - 100
    score = 0;
    requestID = requestAnimationFrame(animate);
}

again.addEventListener("click",() => {
    reset();
    swoosh.play();
})


canvas.addEventListener("click",() => {
    if(bird.x < canvas.width / 2 -100) return;


   
    for(let i=0; i<15; i++){
        const color = `hsl(${hue},100%,50%)`;
        const randomRadius = Math.floor(Math.random() * 10);
        const randomVelocityX = Math.random() * 2;
        const randomVelocityY = Math.random() * 2;

        particles.push(
            new Particle(bird.x,bird.y,randomRadius,randomVelocityX,randomVelocityY,color)
        );    
    }

    
   wing.currentTime = 0;
   wing.play();
   bird.y -= 70;
   bird.velocityY = 2;
})

window.addEventListener("keydown",(e) => {
    if(bird.x < canvas.width / 2 -100) return;
    if(e.keyCode === 38) {
        wing.currentTime = 0;
        wing.play();
        bird.y -= 50;
        bird.velocityY = 2;
    }
})

addFloor();
animate();
addPipe();
})