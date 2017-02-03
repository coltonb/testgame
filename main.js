var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var input = [];

var lastUpdate = Date.now();

//Modulo fix
function mod(n, m) {
    return ((n % m) + m) % m;
}

function Player() {
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.size = 50;

    //In pixels per second
    this.moveSpeed = 500;

    this.draw = function(ctx) {
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(this.x - this.size / 2,
                     this.y - this.size / 2,
                     this.size,
                     this.size);
    }

    this.move = function(dt, input) {
        if (input.w) plr.y -= plr.moveSpeed * dt / 1000;
        if (input.a) plr.x -= plr.moveSpeed * dt / 1000;
        if (input.s) plr.y += plr.moveSpeed * dt / 1000;
        if (input.d) plr.x += plr.moveSpeed * dt / 1000;

        plr.x = mod(plr.x, WIDTH);
        plr.y = mod(plr.y, HEIGHT);

    }
}

var plr = new Player();

function load() {
    document.body.addEventListener("keydown", onKeydown);
    document.body.addEventListener("keyup", onKeyup);
}

function onKeydown(key) {
    key = key.key;
    if (key == 'w') input.w = true;
    if (key == 'a') input.a = true;
    if (key == 's') input.s = true;
    if (key == 'd') input.d = true;
}

function onKeyup(key) {
    key = key.key;
    if (key == 'w') input.w = false;
    if (key == 'a') input.a = false;
    if (key == 's') input.s = false;
    if (key == 'd') input.d = false;
}

(function renderFrame() {
    requestAnimationFrame(renderFrame);

    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    
    plr.move(dt, input);
    ctx.clearRect(0, 0, WIDTH, canvas.height);
    plr.draw(ctx);
}());

load();