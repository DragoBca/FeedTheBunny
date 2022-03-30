const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var btn1;
var air_btn;
var mute_btn;
var cut_btn2;
var cut_btn3;

var ground;
var rope, rope2, rope3;
var fruit;
var link1, link2, link3;
var blink;
var eat;
var sad;
var canH;
var canW;

var background_img;
var rabbit, rabbit_img;
var melon_img;

var air_sound;
var eating_sound;
var rope_cut_sound;
var sad_sound;
var sound1;
var isCrying = false;

function preload() {
  rabbit_img = loadImage("images/Rabbit-01.png");
  background_img = loadImage("images/background.png");
  melon_img = loadImage("images/melon.png");
  blink = loadAnimation("images/blink_1.png", "images/blink_2.png", "images/blink_3.png");
  eat = loadAnimation("images/eat_0.png", "images/eat_1.png", "images/eat_2.png", "images/eat_3.png", "images/eat_4.png");
  sad = loadAnimation("images/sad_1.png", "images/sad_2.png", "images/sad_3.png");

  blink.playing = true;
  eat.playing = true;
  eat.looping = false;
  sad.playing = true;
  sad.looping = false;

  air_sound = loadSound("sounds/air.wav");
  eating_sound = loadSound("sounds/eating_sound.mp3");
  rope_cut_sound = loadSound("sounds/rope_cut.mp3");
  sad_sound = loadSound("sounds/sad.wav");
  sound1 = loadSound("sounds/sound1.mp3");
}


function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canH = displayHeight;
    canW = displayWidth;
    createCanvas(canW + 80, canH);
  }
  else{
    canH = windowHeight;
    canW = windowWidth;
    createCanvas(canW, canH);
  }

  engine = Engine.create();
  world = engine.world;

  sound1.play();
  sound1.setVolume(0.1);

  var groundOptions = {
    isStatic: true
  }
  //criando o solo
  ground = Bodies.rectangle(200, canH - 10, 600, 20, groundOptions)
  World.add(world,ground)

  btn1 = createImg("images/cut_btn.png");
  btn1.size(50, 50);
  btn1.position(20, 30);
  btn1.mouseClicked(drop);

  cut_btn2 = createImg("images/cut_btn.png");
  cut_btn2.size(50, 50);
  cut_btn2.position(330, 35);
  cut_btn2.mouseClicked(drop2);

  cut_btn3 = createImg("images/cut_btn.png");
  cut_btn3.size(50, 50);
  cut_btn3.position(360, 200);
  cut_btn3.mouseClicked(drop3);

  air_btn = createImg("images/balloon.png");
  air_btn.size(150, 100);
  air_btn.position(10, 250);
  air_btn.mouseClicked(airBlow);

  mute_btn = createImg("images/mute.png");
  mute_btn.size(50, 50);
  mute_btn.position(450, 20);
  mute_btn.mouseClicked(mute);

  rope = new Rope(9, {x: 40, y: 30});
  rope2 = new Rope(6, {x: 370, y: 40});
  rope3 = new Rope(4, {x: 400, y: 225});

  fruit = Bodies.circle(300, 300, 15);
  Matter.Composite.add(rope.body, fruit);

  link1 = new Link(rope, fruit);
  link2 = new Link(rope2, fruit);
  link3 = new Link(rope3, fruit);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  rabbit = createSprite(250, canH - 80);
  rabbit.addAnimation("blinking", blink);
  rabbit.addAnimation("eating", eat);
  rabbit.addAnimation("crying", sad);
  rabbit.changeAnimation("blinking");

  rabbit.scale = 0.2;

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() 
{
  background(51);
  imageMode(CENTER);
  image(background_img, width/2, height/2, width, height);
  Engine.update(engine);

  rect(ground.position.x, ground.position.y,600,20);

  if (fruit != null){
    image(melon_img, fruit.position.x, fruit.position.y, 60, 60);
  }
  
  rope.show();
  rope2.show();
  rope3.show();

  if (collide(fruit, rabbit)) {
    rabbit.changeAnimation("eating");
    fruit = null;
    eating_sound.play();
  }

  if (fruit != null && fruit.position.y > 600) {
    rabbit.changeAnimation("crying");
    sound1.stop();
    if (!sad_sound.isPlaying() && !isCrying) {
      sad_sound.play();
      isCrying = true;
    }
  }

  drawSprites();
}

function drop() {
  rope.break();
  link1.detach();
  link1 = null;  

  rope_cut_sound.play();
}

function drop2(){
  rope2.break();
  link2.detach();
  link2 = null;

  rope_cut_sound.play();
}

function drop3(){
  rope3.break();
  link3.detach();
  link3 = null;

  rope_cut_sound.play();
}

function collide(body, sprite){
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(world, body);
      return true;
    }
    else{
      return false;
    }
  }
}

function airBlow() {
  Matter.Body.applyForce(fruit, {x: 0, y: 0}, {x: 0.01, y: 0});
  air_sound.play();
}

function mute() {
  if (sound1.isPlaying()) {
    sound1.stop();
  }
  else {
    sound1.play();
  }
}
