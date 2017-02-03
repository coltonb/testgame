var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var input = [];

//Modulo fix
function mod(n, m) {
    return ((n % m) + m) % m;
}

function Player() {
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.size = 50;

    this.moveSpeed = 5;

    this.draw = function(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    this.move = function(input) {
        if (input.w) plr.y -= plr.moveSpeed;
        if (input.a) plr.x -= plr.moveSpeed;
        if (input.s) plr.y += plr.moveSpeed;
        if (input.d) plr.x += plr.moveSpeed;

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
    plr.move(input);
    ctx.clearRect(0, 0, WIDTH, canvas.height);
    plr.draw(ctx);
}());

load();