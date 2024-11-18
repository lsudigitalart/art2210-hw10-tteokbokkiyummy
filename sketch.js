let particles = [];
let redDot;

function preload() {
  backgroundImg = loadImage('background.png');
  smileImg = loadImage('smile.png');
  dotImg = loadImage('blank.png');

}

function setup() {
  createCanvas(600, 600);
  redDot = new RedDot();
}

function draw() {
  background(backgroundImg);
  
  // particle leaves
  particles = particles.filter(particle => particle.opacity > 0);
  
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
  
  redDot.avoidParticles(particles);
  redDot.update();
  redDot.display();
}

function mousePressed() {
  //10 particles
  for (let i = 0; i < 10; i++) { 
    particles.push(new Particle(mouseX, mouseY));
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.opacity = 255; // Initialize opacity
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    let bounced = false;

    // Bounce off edges and reduce opacity
    if (this.x < 0 || this.x > width) {
      this.vx *= -1;
      bounced = true;
    }
    if (this.y < 0 || this.y > height) {
      this.vy *= -1;
      bounced = true;
    }

    if (bounced) {
      this.opacity -= 100; // Decrease opacity on bounce
      this.opacity = max(this.opacity, 0);
    }
  }

  display() {
    fill(0, this.opacity);
    //smile particles
    let imageScaleFactor = 2; //scale image
    let scaledWidth = 25 * imageScaleFactor; 
    let scaledHeight = 25 * imageScaleFactor;
    //ellipse(this.x, this.y, 25,25);
    image(smileImg, this.x - scaledWidth / 2, this.y - scaledHeight / 2, scaledWidth, scaledHeight);

  }
}

// Red dot class that avoids particles
class RedDot {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 2;
    this.smile = false;
  }

  // Move away from nearby particles
  avoidParticles(particles) {
    let avoidanceForce = createVector(0, 0);
    let avoidanceThreshold = 50; 

    for (let particle of particles) {
      let distance = dist(this.x, this.y, particle.x, particle.y);

      if (distance < avoidanceThreshold) {
        // avoid
        let move = createVector(this.x - particle.x, this.y - particle.y);
        move.normalize();
        move.mult((avoidanceThreshold - distance) / avoidanceThreshold); // Increase repulsion force based on proximity
        avoidanceForce.add(move);
      }
      if (distance < 15){
        this.smile = true;
      }
    }

    // force of avoidance 
    this.x += avoidanceForce.x * 2; 
    this.y += avoidanceForce.y * 2;

    // canvas constrain 
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  update() {
    // tremble
    this.x += random(-0.5, 0.5);
    this.y += random(-0.5, 0.5);
  }

  display() {
    let imageScaleFactor = 2; // Scale tremble
    let scaledWidth = 20 * imageScaleFactor; 
    let scaledHeight = 20 * imageScaleFactor;
    
    if (this.smile == true){
     image(smileImg, this.x - scaledWidth / 2, this.y - scaledHeight / 2, scaledWidth, scaledHeight);

    }
    else {
      image(dotImg, this.x - scaledWidth / 2, this.y - scaledHeight / 2, scaledWidth, scaledHeight);
    }

  }
}
