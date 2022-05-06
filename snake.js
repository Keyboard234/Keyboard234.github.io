var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");
var data = document.getElementById("Data");
var [up, down, left, right] = [false, false, false, false]
var first = true
let snakecoords = [{x: 0, y: 0}];
let food_x = 0;
let food_y = 0;
let dx = 0;
let dy = 0;
let x = 0;
let y = 0;

function drawLines() {
    for (let i = 20; i <= 800; i += 20) {
        ctx.beginPath();
        ctx.rect(i, 0, 1, canvas.height);
        ctx.fillStyle = "grey";
        ctx.fill();
        ctx.closePath();
    }
    for (let i = 20; i <= 600; i += 20) {
        ctx.beginPath();
        ctx.rect(0, i, canvas.width, 1);
        ctx.fillStyle = "grey";
        ctx.fill();
        ctx.closePath();
    }
}

function move() {  
  const head = {x: snakecoords[0].x + dx, y: snakecoords[0].y + dy};
  if (head.x > 380) {
    console.log("out of screen")
    head.x = -400
  }
  if (head.x < -400) {
    console.log("out of screen")
    head.x = 380
  }
  if (head.y < -300) {
    console.log("out of screen")
    head.y = 280
  }
  if (head.y > 280) {
    console.log("out of screen")
    head.y = -300
  }
  snakecoords.unshift(head);
  const has_eaten_food = snakecoords[0].x === food_x && snakecoords[0].y === food_y;
  if (has_eaten_food) {
    genFood();
  } else {
    snakecoords.pop();
  }
}

function randomFood(min, max){
    thing1 = (Math.floor(Math.random() * (max - min + 1)) + min);
    thing2 = thing1 * 20;
    return thing2;
}
 
function genFood() {  
    food_x = randomFood(-400 / 20, 380 / 20);
    food_y = randomFood(-300 / 20, 280 / 20);
    snakecoords.forEach(function has_snake_eaten_food(segment) {
    const has_eaten = segment.x == food_x && segment.y == food_y;
    if (has_eaten) genFood();
  });
}

function drawFood(x, y) {
    ctx.beginPath();
    ctx.rect(canvas.width/2 + x, canvas.height/2 + y, 20, 20);
    ctx.fillStyle = "lime";
    ctx.fill();
    ctx.closePath();
}

function drawPlayer() {
    snakecoords.forEach(drawSegments);
}

function drawSegments(Segment) {
    ctx.beginPath();
    ctx.rect(canvas.width/2 + Segment.x, canvas.height/2 + Segment.y, 20, 20);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawFood(food_x, food_y);
    drawLines();
    move();
    if (up == true) {
        dy = -20;
        dx = 0;
    }
    if (down == true) {
        dy = 20;
        dx = 0;
    }
    if (left == true) {
        dy = 0;
        dx = -20;
    }
    if (right == true) {
        dy = 0;
        dx = 20;
    }
    x += dx;
    y += dy;
}

document.addEventListener("keydown", keyHandler, false);

function keyHandler(e) {
    if(e.key == "w") {
        if (first == true) {
            up = true;
            first = false;
        } else if (left == true || right == true) {
            up = true;
            down = false;
            left = false;
            right = false;
        }
    }
    else if(e.key == "s") {
        if (first == true) {
            down = true;
            first = false;
        } else if (left == true || right == true) {
            up = false;
            down = true;
            left = false;
            right = false;
        }
    }
    if(e.key == "a") {
        if (first == true) {
            left = true;
            first = false;
        } else if (up == true || down == true) {
            up = false;
            down = false;
            left = true;
            right = false;
        }
    }
    else if(e.key == "d") {
        if (first == true) {
            right = true;
            first = false;
        } else if (up == true || down == true) {
            up = false;
            down = false;
            left = false;
            right = true;
        }
    }
}

genFood();
setInterval(draw, 75);
