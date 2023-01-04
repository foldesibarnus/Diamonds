const canvas = document.getElementById("canvas");
const div = document.getElementById("div");
const ctx = canvas.getContext("2d");
const names = ["floor", "wall", "diamond", "player", "smaragd", "rubin", "lava", "checkpoint", "enemy"];
const floor = 0, wall = 1, diamond = 2, player = 3, smaragd = 4, rubin = 5, lava = 6, checkpoint = 7, enemy = 8;
const images = [];

let diamondCounter = 0;

let counter = 0;

for(i in names) {
  const image = new Image();
  image.addEventListener("load", tracker);
  image.src = "img/" + names[i] + ".png";
  images[i] = image;
}

function tracker() {if(++counter == names.length) loaded();}

function loaded() {
  update();
  document.body.addEventListener('keydown', onKeyPress);
}

const size = 70;
const row = 5;
const position = {x: 5, y: row};
const pcheckpoint = {x: 5,y: row};
const world = [
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 0, 1, 0, 2, 0],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 1, 8, 0, 0],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
const width = world[0].length, height = world.length, screenWidth = width, screenHeight = 10;

console.log(size*screenWidth, size*screenHeight);
canvas.width = size*screenWidth;
canvas.height = size*screenHeight;


function draw(x, y) {
  let offset = row - position.y;
  if(y < offset || y - offset >= height) {
    ctx.clearRect(x*size, y*size, size, size);
  } else {
    let img;
    if(y == position.y + offset && x == position.x) img = images[player];
    else img = images[world[y - offset][x]];
    ctx.drawImage(img, x*size, y*size, size, size);
  }
}

function update() {
  for(let y = 0; y < screenHeight; y++) {
    for(let x = 0; x < screenWidth; x++) {
      draw(x, y);
    }
  }
}

function set(x, y, type, force = false) { // Kezeli a táblával szomszédos mezőket
  if(y < 0 || y >= height || x < -1 || x > width) return false;
  if(x == -1) x = width - 1;
  if(x == width) x = 0;
  if(world[y][x] != floor && !force) return false;
  world[y][x] = type;
  return true;
}

function onKeyPress(event) {
  let x = position.x, x0 = x;
  // Nyilak kezelése
  switch (event.keyCode) {
    case 37:	// Left
      x = x == 0 ? width - 1 : x - 1;
      if(world[position.y][x] == wall) break;
      position.x = x;
      draw(x, row);
      draw(x0, row);
      break;
    case 38:	// Up
      if(position.y == 0) break;
      if(world[position.y - 1][position.x] == wall) break;
      position.y--;
      update();
      break;
    case 39:	// Right
      x = x == width - 1 ? 0 : x + 1;
      if(world[position.y][x] == wall) break;
      position.x = x;
      draw(x, row);
      draw(x0, row);
      break;
    case 40:	// Down
      if(position.y == height - 1) break;
      if(world[position.y + 1][position.x] == wall) break;
      position.y++;
      update();
      break;
    case 32:	// Space
      alert('x: ' + position.x + ', y: ' + position.y +  ', height: ' + height + 'diamonds:' + diamondCounter);
      break;
  }
  if(world[position.y][position.x] == diamond) {
    world[position.y][position.x] = floor;
    diamondCounter++;
    div.innerHTML = "Diamonds: " + diamondCounter;
  }
  if(world[position.y][position.x] == smaragd) {
    world[position.y][position.x] = floor;
    set(position.x + 1, position.y, diamond);
    set(position.x + 1, position.y + 1, diamond);
    set(position.x, position.y + 1, diamond);
    set(position.x - 1, position.y + 1, diamond);
    set(position.x - 1, position.y, diamond);
    set(position.x - 1, position.y -1, diamond);
    set(position.x, position.y - 1, diamond);
    set(position.x + 1, position.y - 1, diamond);
    update();
  }
  if(world[position.y][position.x] == checkpoint) {pcheckpoint.x = position.x, pcheckpoint.y = position.y};
  if(world[position.y][position.x] == lava) {position.x = pcheckpoint.x, position.y = pcheckpoint.y};
}
