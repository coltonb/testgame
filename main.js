var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var input = [];
var objects = [];

var lastUpdate = Date.now();

var screenShake = 0;

const soundPath = "assets/sound/";

var shootsfx = new Audio(soundPath + "shoot.wav");
var hitsfx = new Audio(soundPath + "hit.wav");

//Modulo fix
function mod(n, m) {
    return ((n % m) + m) % m;
}

function Bullet(x, y, dir) {
    this.x = x;
    this.y = y;
    this.size = 15;
    
    this.moveDir = dir;
    this.moveSpeed = 0.6;

    this.lifeTime = 666;

    this.active = true;

    this.draw = function(ctx) {
        ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.fillRect(this.x - this.size / 2,
                     this.y - this.size / 2,
                     this.size,
                     this.size);
    }

    this.update = function(dt) {
        if (this.moveDir == 0) this.y -= this.moveSpeed * dt;
        if (this.moveDir == 1) this.x -= this.moveSpeed * dt;
        if (this.moveDir == 2) this.y += this.moveSpeed * dt;
        if (this.moveDir == 3) this.x += this.moveSpeed * dt;

        this.x = mod(this.x, WIDTH);
        this.y = mod(this.y, HEIGHT);

        this.lifeTime -= dt;

        if (this.lifeTime <= 0) {
            this.active = false;
            hitsfx.play();
            screenShake += 7;
        }
    }

}

function Player() {
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.size = 33;
    this.cd = 0;

    //In pixels per second
    this.moveSpeed = 0.5;

    this.active = true;    

    this.draw = function(ctx) {
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(this.x - this.size / 2,
                     this.y - this.size / 2,
                     this.size,
                     this.size);
    }

    this.shoot = function(dt) {
        if (this.cd > 0) {
            this.cd -= dt;
            return;
        }

        if (input.ArrowUp) {
            objects.push(new Bullet(this.x, this.y, 0));
            this.cd = 500;
            shootsfx.play();
        } else if (input.ArrowLeft) {
            objects.push(new Bullet(this.x, this.y, 1));
            this.cd = 500;
            shootsfx.play();
        } else if (input.ArrowDown) {
            objects.push(new Bullet(this.x, this.y, 2));
            this.cd = 500;
            shootsfx.play();
        } else if (input.ArrowRight) {
            objects.push(new Bullet(this.x, this.y, 3));
            this.cd = 500;
            shootsfx.play();
        }
    }

    this.update = function(dt) {
        if (input.w) this.y -= this.moveSpeed * dt;
        if (input.a) this.x -= this.moveSpeed * dt;
        if (input.s) this.y += this.moveSpeed * dt;
        if (input.d) this.x += this.moveSpeed * dt;

        this.x = mod(this.x, WIDTH);
        this.y = mod(this.y, HEIGHT);

        this.shoot(dt);
    }
}

var plr = new Player();
objects.push(plr);

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

function draw(dt) {
    ctx.clearRect(0, 0, WIDTH, canvas.height);
    preEffects(dt);
    objects.forEach(function(e) {
        e.draw(ctx);
    });
    postEffects(dt);
}

function preEffects() {
    ctx.save();
    if (screenShake > 0) {
        ctx.translate(Math.random()*15 - 7.5, Math.random()*15 - 7.5);
        screenShake--;
    }
}

function postEffects() {
    ctx.restore();
}

function update(dt) {
    objects.forEach(function(e, i) {
        e.update(dt);

        if (!e.active)
            objects.splice(i, 1);
    });
}

(function renderFrame() {
    requestAnimationFrame(renderFrame);

    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    
    update(dt);
    draw(dt);
}());

load();