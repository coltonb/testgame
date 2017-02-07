var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var input = [];
var objects = [];

var lastUpdate = Date.now();

//Modulo fix
function mod(n, m) {
    return ((n % m) + m) % m;
}

function Bullet(x, y, dir) {
    this.x = x;
    this.y = y;
    this.size = 20;
    
    this.moveDir = dir;
    this.moveSpeed = 0.6;

    this.draw = function(ctx) {
        ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.fillRect(this.x - this.size / 2,
                     this.y - this.size / 2,
                     this.size,
                     this.size);
    }

    this.move = function(dt) {
        if (this.moveDir == 0) this.y -= this.moveSpeed * dt;
        if (this.moveDir == 1) this.x -= this.moveSpeed * dt;
        if (this.moveDir == 2) this.y += this.moveSpeed * dt;
        if (this.moveDir == 3) this.x += this.moveSpeed * dt;

        this.x = mod(this.x, WIDTH);
        this.y = mod(this.y, HEIGHT);
    }

    setTimeout(function() {
        var index = objects.indexOf(this);
        console.log(objects, 1);
        if (index != -1) {
            objects.splice(index, 1);
        }
    }, 1000);

}

function Player() {
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.size = 50;
    this.cd = 0;

    //In pixels per second
    this.moveSpeed = 0.5;

    this.draw = function(ctx) {
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(this.x - this.size / 2,
                     this.y - this.size / 2,
                     this.size,
                     this.size);
    }

    this.shoot = function(dt, input) {
        if (this.cd > 0) {
            this.cd -= dt;
            return;
        }

        if (input.ArrowUp) {
            objects.push(new Bullet(this.x, this.y, 0));
            //this.cd = 500;
            return;
        }
        if (input.ArrowLeft) {
            objects.push(new Bullet(this.x, this.y, 1));
            //this.cd = 500;
            return;
        }
        if (input.ArrowDown) {
            objects.push(new Bullet(this.x, this.y, 2));
            //this.cd = 500;
            return;
        }
        if (input.ArrowRight) {
            objects.push(new Bullet(this.x, this.y, 3));
            //this.cd = 500;
            return;
        }
    }

    this.move = function(dt, input) {
        if (input.w) plr.y -= plr.moveSpeed * dt;
        if (input.a) plr.x -= plr.moveSpeed * dt;
        if (input.s) plr.y += plr.moveSpeed * dt;
        if (input.d) plr.x += plr.moveSpeed * dt;

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
    input[key] = true;
}

function onKeyup(key) {
    key = key.key;
    input[key] = false;
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, canvas.height);
    objects.forEach(function(e) {
        e.draw(ctx);
    });
}

function update(dt) {
    objects.forEach(function(e) {
        e.move(dt);
    });
}

(function renderFrame() {
    requestAnimationFrame(renderFrame);

    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    
    plr.move(dt, input);
    plr.shoot(dt, input);
    update(dt);
    draw();
    plr.draw(ctx);
}());

load();