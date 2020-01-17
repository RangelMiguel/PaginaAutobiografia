function disableScroll() { 
            // Get the current page scroll position 
            scrollTop =  
              window.pageYOffset || document.documentElement.scrollTop; 
            scrollLeft =  
              window.pageXOffset || document.documentElement.scrollLeft, 
  
                // if any scroll is attempted, 
                // set this to the previous value 
                window.onscroll = function() { 
                    window.scrollTo(scrollLeft, scrollTop); 
                }; 
                event.stopPropagation();
        } 
  
        function enableScroll() { 
            window.onscroll = function() {}; 
        } 

var spaceShip;
var meteors;
function setup() {
  var canvas = createCanvas(800, 500);
  canvas.parent("juego");
  textSize(12);
  $(".p5Canvas").on("click", disableScroll);
  $("body").on("click", enableScroll);
  spaceShip = new Spaceship();
  meteors = new Array();
  meteorsToPush = new Array();
  for(var i = 0; i < 50; i++) {
    generarMeteoro();
  }
}

function draw() {
  background(0);
  spaceShip.update();
  spaceShip.move();
  spaceShip.display();
  var meteorsEliminar = new Array();
  for(var i = 0; i < meteors.length; i++) {
    meteors[i].update();
    meteors[i].move();
    if(meteors[i].eliminar) {
      meteorsEliminar.push(i);
    }
    meteors[i].display();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    spaceShip.isLeftKeyPressed = true;
  } else if (keyCode === RIGHT_ARROW) {
    spaceShip.isRightKeyPressed = true;
  } else if (keyCode === UP_ARROW) {
    spaceShip.isUpKeyPressed = true;
  } else if (key == ' ') {
    spaceShip.isSpaceKeyPressed = true; 
  } 
  return false;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    spaceShip.isLeftKeyPressed = false;
  } else if (keyCode === RIGHT_ARROW) {
    spaceShip.isRightKeyPressed = false;
  } else if (keyCode === UP_ARROW) {
    spaceShip.isUpKeyPressed = false;
  } else if (key == ' ') {
    spaceShip.isSpaceKeyPressed = false; 
  } 
  return false;   
}

// Bullets
class Bullet {
   constructor(x, y, angle) {
     this.x = x;
     this.y = y;
     this.angle = angle;
   }
  
  update() {
    var dx = cos(this.angle) * 10;
    var dy = tan(this.angle) * dx;
    this.x += dx;
    this.y += dy;
    for(var i = 0; i < meteors.length; i++) {
      var dx = this.x - meteors[i].x;
      if(dx < 0)
        dx *= -1;
      var dy = this.y - meteors[i].y;
      if(dy < 0)
        dy *= -1;
      if(dx < meteors[i].size && dy < meteors[i].size) {
        meteors[i].x = -30;
        meteors[i].angle = random(0, 360);
        spaceShip.score++;
      }
    }
  }
  
  display() {
    stroke(255);
    fill(0,0,255);
    ellipse(this.x, this.y, 3, 3);
  }
}

function generarMeteoro() {
  var meteor = new Meteor();
  meteors.push(meteor);
}

class Meteor {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = random(10,30);
    this.speed = random(1, 5) * ((spaceShip.score > 100 ? spaceShip.score : 100) / 100);
    this.angle = random(135, 225);
    this.img = loadImage("assets/meteor.png");
  }

  update(){

  }

  move() {
    var dx = cos(this.angle) * this.speed;
    var dy = tan(this.angle) * dx;
    this.x += dx;
    if(this.x > width + 100){
      this.x = -30;
      this.angle = random(0, 360);
    }
    if(this.x < -100){
      this.x = width + 30;
      this.angle = random(0, 360);
    }
    this.y += dy;
    if(this.y > height + 100){
      this.y = -30;
      this.angle = random(0, 360);
    }
    if(this.y < -100) {
      this.y = height + 30;
      this.angle = random(0, 360);
    }
  }

  display() {
    stroke(255,0,0);
    fill(255,0,0);
    push();
    translate(this.x, this.y);
    scale(this.size/160);
    image(this.img, -99.5, -102.5);
    pop();
  }

}

// Spaceship
class Spaceship {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 20;
    this.speed = 0;
    this.friction = 0.1;
    this.angle = 0;
    this.isLeftKeyPressed = false;
    this.isRightKeyPressed = false;
    this.isUpKeyPressed = false;
    this.isSpaceKeyPressed = false;
    this.bullets = Array();
    this.life = 100;
    this.score = 0;
    this.bShoot = true;
    this.img = loadImage('assets/ship.png');
    this.sound = loadSound('assets/laser.ogg');
    this.sound.setVolume(0.1);
  }
  
  shoot() {
    if(this.bShoot) {
      var bullet = new Bullet(this.x, this.y, this.angle);
      this.bullets.push(bullet);
      this.sound.play();
      this.bShoot = false;
      setTimeout(function(){spaceShip.bShoot = true;}, 100);
    }
  }
  
  update() {
    if(this.isLeftKeyPressed) {
      this.angle -= 0.05;
    } else if(this.isRightKeyPressed) {
      this.angle += 0.05;
    }
    if(this.isUpKeyPressed) {
       if(this.speed <= 5) {
         this.speed += 0.1;
       }
    } else {
      if(this.speed > 0) {
        this.speed -= this.friction;
      } else {
        this.speed = 0;
      }
    } 
    if(this.isSpaceKeyPressed) {
       this.shoot(); 
    }
    var arrayBulletsToDelete = Array();
    for(var i = 0; i < this.bullets.length; i++) {
       this.bullets[i].update(); 
       if(this.bullets[i].x > width + 10 || 
          this.bullets[i].x < -10 ||
          this.bullets[i].y > height + 10 ||
          this.bullets[i].y < -10) {
          arrayBulletsToDelete.push(i);
       }
    }
    for(var i = 0; i < arrayBulletsToDelete.length; i++) {
      this.bullets.splice(arrayBulletsToDelete[i],1);
    }

    for(var i = 0; i < meteors.length; i++){
      var dx = this.x - meteors[i].x;
      if(dx < 0)
        dx *= -1;
      var dy = this.y - meteors[i].y;
      if(dy < 0)
        dy *= -1;
      if(dx < meteors[i].size && dy < meteors[i].size) {
        this.life -= 10;
        meteors[i].x = -30;
        meteors[i].angle = random(0, 360);
      }
      if(this.life <= 0){
        this.explode();
      }
    }
  }

  explode() {
    textSize(64);
    fill(255,0,0);
    text("Perdiste", width/2, height/2, 30);
    textSize(12);
  }

  move() {
    var dx = cos(this.angle) * this.speed;
    var dy = tan(this.angle) * dx;
    this.x += dx;
    if(this.x > width + 10)
      this.x = 0;
    if(this.x < -10)
      this.x = width;
    this.y += dy;
    if(this.y > height + 10) 
      this.y = 0;
    if(this.y < -10)
      this.y = height;
    
  }

  display() {
    stroke(0,0,255);
    fill(0,0,255);
    /*
    var dx1 = cos(this.angle + 90) * this.size;
    var dy1 = tan(this.angle + 90) * dx1;
    var dx2 = cos(this.angle - 90) * this.size;
    var dy2 = tan(this.angle - 90) * dx2;
    triangle(this.x + dx1, this.y + dy1, this.x + dx2, this.y + dy2, this.x, this.y);
    */
    push();
    translate(this.x, this.y);
    rotate(this.angle + (PI/2));
    image(this.img, -22.5, -15.5);
    pop();
    for(var i = 0; i < this.bullets.length; i++) {
       this.bullets[i].display(); 
    }
    stroke((100-this.life)*2,255,0);
    fill((100-this.life)*2,255,0);
    rect(10, 10, this.life, 10);
    text(this.life, this.x + 15, this.y + 15);
    text("Score: " + this.score, 10, 35);
  }
}
