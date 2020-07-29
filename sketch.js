var flock = [];

var alignSlider, cohesionSlider, seperationSlider;

function setup() {
  createCanvas(640, 360);
  noStroke();
  alignSlider = createSlider(0, 5, 1, 0.1);
  alignSlider.position(10, 30);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider.position(10, 90);
  seperationSlider = createSlider(0, 5, 1, 0.1);
  seperationSlider.position(10, 150);
  for (var i = 0; i < 100; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  background(51);
  push();
  noStroke();
  textSize(15);
  fill(250, 250, 250);
  text("Alignment", 10, 20);
  text("Cohesion", 10, 80);
  text("Seperation", 10, 140);

  pop();

  for (let boid of flock) {
    boid.flock(flock);
    boid.show();
    boid.update();
    boid.edges();
  }
}

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(1.5, 2.0));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    var perceptionRadius = 50;
    var average = createVector();
    var total = 0;
    for (let other of boids) {
      var d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        average.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      average.div(total);
      average.setMag(this.maxSpeed);
      average.sub(this.velocity);
      average.limit(this.maxForce);
    }
    return average;
  }

  seperation(boids) {
    var perceptionRadius = 100;
    var average = createVector();
    var total = 0;
    for (let other of boids) {
      var d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        var difference = p5.Vector.sub(this.position, other.position);
        difference.div(d);
        average.add(difference);
        total++;
      }
    }
    if (total > 0) {
      average.div(total);
      average.setMag(this.maxSpeed);
      average.sub(this.velocity);
      average.limit(this.maxForce);
    }
    return average;
  }

  cohesion(boids) {
    var perceptionRadius = 100;
    var average = createVector();
    var total = 0;
    for (let other of boids) {
      var d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        average.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      average.div(total);
      average.sub(this.position);
      average.setMag(this.maxSpeed);
      average.sub(this.velocity);
      average.limit(this.maxForce);
    }
    return average;
  }

  flock(boids) {
    var align = this.align(boids);
    var cohesion = this.cohesion(boids);
    var seperation = this.seperation(boids);

    align.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    seperation.mult(seperationSlider.value());

    this.acceleration.add(seperation);
    this.acceleration.add(align);
    this.acceleration.add(cohesion);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
