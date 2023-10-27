// import { APPLE } from './constants';
const APPLE = "apple";
const SNAKE = "snake";
const WALL = "wall";
const APPLE_MAGNET = "apple magnet";
const COIN_MAGNET = "coin magnet";
const COIN = "coin";
const FREEZE = "freeze"
const ONE_WAY = "one way";
const DOOR = "door";
const KEY = "key";
const PORTAL = "portal";
const FINISH = "finish";
const FRENZY = "frenzy";
const GHOST = "ghost";
const GROUND = "ground";
const FONTFACE = "Verdana";
const FREEZE_COLOR = "rgb(0,174,239)";
const APPLE_COLOR = "rgb(255,0,0)";
const COIN_COLOR = "rgb(254,214,49)";
const SNAKE_COLOR = "rgb(0, 255,0)";
const FRENZY_COLOR = "purple";
const WALL_COLOR = "rgb(13,30,58)";
const GROUND_COLOR = "rgb(0,0,0)";

const MOVING = "moving";
const IDLE = "idle";
const DEAD = "dead";
const APPLE_MAGNETIC = "apple magnetic";
const COIN_MAGNETIC = "apple magnetic";
const VICTORY = "victory";
const FROZEN = "frozen"

const MAIN_MENU = "MAIN MENU";
const ENDLESS = "ENDLESS";
const LEVELS = "LEVELS";
const LEVEL = "LEVEL";
const GAME_OVER = "GAME OVER";
const LEVEL_GAME_OVER = "level game over";
const HELP = "HELP"


const RESTART = "PLAY AGAIN";


const SPEED = 8;
const LEVEL_COUNT = 15;
const POINTS_PER_COIN = 50;
const POINTS_PER_APPLE = 6;

const MAX_LEVEL_COINS = 3;
const MAX__LEVEL_SCORE = MAX_LEVEL_COINS * POINTS_PER_COIN;


const UNIT_SIZE = 20;
const WIDTH = 560;
const HEIGHT = 500;
const BLINK_FREQUENCY = 50;;
const TILE_WIDTH = WIDTH / UNIT_SIZE;
const TILE_HEIGHT = HEIGHT / UNIT_SIZE;
const GAME_UNITS = TILE_WIDTH * TILE_HEIGHT;
const BUTTON_HEIGHT = 40;
const BUTTON_WIDTH = 150;
const POWERUP_TIME = 100;
const FREEZE_TIME = 40;


//--------------------------------GLOBAL VARIABLES----------------------------------------------//

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const isMobile = detectMobile();
let bestLength = 0;
let highscore = 0;

let speed = SPEED;
let currentLevel = 0;

let appleSound = new Audio('./sounds/apple.mp3');
let ghostSound = new Audio('./sounds/ghost.mp3');
let magnetSound = new Audio('./sounds/magnet.mp3');
let coinSound = new Audio('./sounds/coin.mp3');
let victorySound = new Audio('./sounds/victory.mp3');
let oneWaySound = new Audio('./sounds/one-way.mp3');
let freezeSound = new Audio('./sounds/freeze.mp3');
let frenzySound = new Audio('./sounds/frenzy.mp3');
let keySound = new Audio('./sounds/key.mp3');
//--------------------------------SNAKE STATES----------------------------------------------//


function playSound(sound) {
    try {
        sound.volume = 0.40;
        sound.play();
    }
    catch (e) {
        console.error(e);
    }
}

class SnakeState {
    constructor(snake, type) {
        this.snake = snake;
        this.type = type;
    }

    update() {

    }
    exitState() {

    }

    drawHead(ctx) {
        //draws head
        ctx.fillStyle = this.snake.headColor;
        ctx.fillRect(this.snake.x[0] * UNIT_SIZE, this.snake.y[0] * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1);

    }
    drawBody(ctx) {
        //draws body
        ctx.fillStyle = SNAKE_COLOR;
        for (let i = 0; i <= this.snake.length; i++) {
            ctx.fillRect(this.snake.x[i] * UNIT_SIZE, this.snake.y[i] * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1)
        }

    }

    draw(ctx) {
        this.drawBody(ctx);
        this.drawHead(ctx);


    }




    isBodyCollision() {
        for (let i = this.snake.length; i > 0; i--) {
            if (this.snake.x[0] == this.snake.x[i + 1] && this.snake.y[0] == this.snake.y[i + 1]) {
                return true;
            }
        }
        return false
    }

    isObjectCollision(object) {
        return object.x == this.snake.x[0] && object.y == this.snake.y[0];
    }

}
class Victory extends SnakeState {
    constructor(snake) {
        super(snake, VICTORY);
        playSound(victorySound);
    }
    update() {
        this.snake.moveBody();
    }
    drawHead(ctx) {
        let randomR = Math.floor(Math.random() * 255);
        let randomG = Math.floor(Math.random() * 255);
        let randomB = Math.floor(Math.random() * 255);
        this.snake.headColor = "rgb(" + randomR + "," + randomG + "," + randomB + ")";
        ctx.fillStyle = this.snake.headColor;
        ctx.fillRect(this.snake.x[0] * UNIT_SIZE, this.snake.y[0] * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1)

    }

    draw(ctx) {
        this.drawBody(ctx);
        this.drawHead(ctx);

    }
    isBodyCollision() {
        false;
    }
}

class Moving extends SnakeState {
    constructor(snake) {
        super(snake, MOVING);
        this.snake.headColor = SNAKE_COLOR;

    }

    update() {
        this.snake.moveHead();
        this.snake.moveBody();
    }
}
class GhostState extends SnakeState {
    time = 0;
    constructor(snake) {
        super(snake, GHOST);
    }
    drawBody(ctx) {
        //draws body
        for (let i = 1; i < this.snake.length; i++) {
            ctx.strokeStyle = SNAKE_COLOR;
            ctx.strokeRect(this.snake.x[i] * UNIT_SIZE, this.snake.y[i] * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE)

        }
    }
    draw(ctx) {
        if (Ghost.maxTime - this.time <= 30) {
            if (Math.floor(Date.now() / BLINK_FREQUENCY) % 5) {
                this.drawBody(ctx);
            }
        }

        else {
            this.drawBody(ctx);
        }


        this.drawHead(ctx);

    }

    update() {
        this.time++;
        if (this.time >= Ghost.maxTime) {
            GhostState.time = 0;
            this.snake.changeState(new Moving(this.snake));

        }

        this.snake.moveBody();
        this.snake.moveHead();
    }
    isBodyCollision() {
        return false;
    }


}

class Frozen extends SnakeState {
    static time = 0;
    constructor(snake) {
        super(snake, FROZEN);
        this.timerStarted = false;
        this.snake.headColor = SNAKE_COLOR;
    }
    draw(ctx) {
        if (Freeze.maxTime - Frozen.time <= 30) {
            if (Math.floor(Date.now() / BLINK_FREQUENCY) % 5) {
                this.drawBody(ctx);

                this.drawHead(ctx);
            }
        }

        else {
            this.drawBody(ctx);

            this.drawHead(ctx);
        }



    }
    update() {


        Frozen.time++;
        if (Frozen.time >= Freeze.maxTime) {
            this.snake.moveHead();
            Frozen.time = 0;
            this.snake.changeState(new Moving(this.snake))
        }
        this.snake.moveBody();
    }
    isBodyCollision() {
        return false;
    }
}

class Dead extends SnakeState {
    constructor(snake) {
        super(snake, DEAD);
        this.snake.headColor = "rgb(225,225,225)";
    }

}
class FrenzyState extends SnakeState {
    time = 0;
    constructor(snake) {
        super(snake, FRENZY);
        this.snake.headColor = FRENZY_COLOR;

    }

    exitState() {
        speed = SPEED
    }
    update() {



        speed = 15;
        this.time++;
        if (this.time >= Frenzy.maxTime) {
            speed = SPEED;
            this.snake.changeState(new Moving(this.snake));
        }
        this.snake.moveHead();
        this.snake.moveBody();
    }

    drawBody(ctx) {
        //draws body
        for (let i = 0; i <= this.snake.length; i++) {
            let randomR = Math.floor(Math.random() * 255);
            let randomG = Math.floor(Math.random() * 255);
            let randomB = Math.floor(Math.random() * 255);
            ctx.strokeStyle = "rgb(" + randomR + "," + randomG + "," + randomB + ")";
            ctx.strokeRect(this.snake.x[i] * UNIT_SIZE, this.snake.y[i] * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE)

        }
    }
    draw(ctx) {
        //we have 30 left in time, start blinking
        if (Frenzy.maxTime - this.time <= 30) {
            if (Math.floor(Date.now() / BLINK_FREQUENCY) % 5) {
                this.drawBody(ctx);
                this.drawHead(ctx);

            }
        }

        else {
            this.drawBody(ctx);
            this.drawHead(ctx);

        }




    }
    isBodyCollision() {
        return false;
    }

}

class AppleMagnetic extends SnakeState {
    appleRadius = 3;
    time = 0;
    constructor(snake) {
        super(snake, APPLE_MAGNETIC);
    }
    isObjectCollision(object) {
        if (object.type == APPLE) {
            return this.snake.x[0] >= object.x - this.appleRadius &&
                this.snake.x[0] <= object.x + this.appleRadius &&
                this.snake.y[0] >= object.y - this.appleRadius &&
                this.snake.y[0] <= object.y + this.appleRadius;

        }
        else {
            return this.snake.x[0] == object.x && this.snake.y[0] == object.y
        }

    }
    update() {
        this.time++;
        if (this.time >= AppleMagnet.maxTime) {
            this.snake.changeState(new Moving(this.snake));

        }
        this.snake.moveHead();
        this.snake.moveBody();
    }
    drawRings(ctx) {
        //draw magnetic fields (rings)
        ctx.strokeStyle = APPLE_COLOR;
        ctx.strokeRect(this.snake.x[0] * UNIT_SIZE - 50, this.snake.y[0] * UNIT_SIZE - 50, UNIT_SIZE * 6, UNIT_SIZE * 6);
        ctx.strokeRect(this.snake.x[0] * UNIT_SIZE - 10, this.snake.y[0] * UNIT_SIZE - 10, UNIT_SIZE * 2, UNIT_SIZE * 2);
        ctx.strokeRect(this.snake.x[0] * UNIT_SIZE - 30, this.snake.y[0] * UNIT_SIZE - 30, UNIT_SIZE * 4, UNIT_SIZE * 4);

    }
    draw(ctx) {
        if (AppleMagnet.maxTime - this.time <= 30) {
            if (Math.floor(Date.now() / BLINK_FREQUENCY) % 5) {
                this.drawRings(ctx);
            }
        }

        else {
            this.drawRings(ctx);
        }
        this.drawBody(ctx);

        //draws head
        ctx.fillStyle = APPLE_COLOR;
        ctx.fillRect(this.snake.x[0] * UNIT_SIZE, this.snake.y[0] * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1);

    }



}

class CoinMagnetic extends SnakeState {
    appleRadius = 3;
    time = 0;
    constructor(snake) {
        super(snake, COIN_MAGNETIC);
    }
    isObjectCollision(object) {
        if (object.type == COIN) {
            return this.snake.x[0] >= object.x - this.appleRadius &&
                this.snake.x[0] <= object.x + this.appleRadius &&
                this.snake.y[0] >= object.y - this.appleRadius &&
                this.snake.y[0] <= object.y + this.appleRadius;

        }
        else {
            return this.snake.x[0] == object.x && this.snake.y[0] == object.y
        }


    }
    update() {
        this.time++;

        if (this.time >= CoinMagnet.maxTime) {
            this.snake.changeState(new Moving(this.snake));
        }
        this.snake.moveHead();
        this.snake.moveBody();
    }
    drawRings(ctx) {
        //draw magnetic fields (rings)
        ctx.strokeStyle = COIN_COLOR;
        ctx.strokeRect(this.snake.x[0] * UNIT_SIZE - 50, this.snake.y[0] * UNIT_SIZE - 50, UNIT_SIZE * 6, UNIT_SIZE * 6);
        ctx.strokeRect(this.snake.x[0] * UNIT_SIZE - 10, this.snake.y[0] * UNIT_SIZE - 10, UNIT_SIZE * 2, UNIT_SIZE * 2);
        ctx.strokeRect(this.snake.x[0] * UNIT_SIZE - 30, this.snake.y[0] * UNIT_SIZE - 30, UNIT_SIZE * 4, UNIT_SIZE * 4);

    }
    draw(ctx) {
        if (CoinMagnet.maxTime - this.time <= 30) {
            if (Math.floor(Date.now() / BLINK_FREQUENCY) % 5) {
                this.drawRings(ctx);
            }
        }

        else {
            this.drawRings(ctx);
        }

        this.drawBody(ctx);

        //draws head
        ctx.fillStyle = COIN_COLOR;
        ctx.fillRect(this.snake.x[0] * UNIT_SIZE, this.snake.y[0] * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1);

    }

}
class Idle extends SnakeState {
    constructor(snake) {
        super(snake, IDLE);
        this.snake.headColor = SNAKE_COLOR;


    }
    update() {

        if (this.snake.changeX != 0 || this.snake.changeY != 0) {
            this.snake.changeState(new Moving(this.snake));

        }
    }
}


//-------------------------------GAME STATES-----------------------------------------------//

class GameState {

    constructor(type) {
        this.type = type;

    }


    drawBG(ctx) {
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

    }
    update() {


    }
    handleCollision() {

    }



}

class HelpA extends GameState {
    constructor() {
        super(HELP);
        let apple = new Apple(2, 6);
        let coin = new Coin(2, 9);
        let freeze = new Freeze(2, 12);
        let ghost = new Ghost(2, 15);
        let appleMagnet = new AppleMagnet(2, 18);
        let coinMagnet = new CoinMagnet(2, 21);
        let frenzy = new Frenzy(2, 24);

        this.objects = new Array(apple, coin, freeze, ghost, appleMagnet, coinMagnet, frenzy);
    }

    update() {
        this.drawBG(ctx);
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(ctx);

        }
        this.draw(ctx)

    }
    draw(ctx) {

        ctx.fillStyle = "white";
        ctx.font = "18px " + FONTFACE;
        ctx.textAlign = "center"

        ctx.fillText("HOW TO PLAY", canvas.width / 2, 30);

        ctx.font = "14px " + FONTFACE;
        ctx.textAlign = "center"

        var x = canvas.width / 2;
        var y = 3 * UNIT_SIZE + 14;


        var lastY = wrapText(ctx, "Use the arrow keys to move the snake. Hit your own snake body or a Wall,", x, y, canvas.width - 20);
        wrapText(ctx, "and it's game over!", x, lastY + 20, canvas.width - 20);

        ctx.textAlign = "left"


        var x = 2 * UNIT_SIZE + UNIT_SIZE + 20;
        var y = 6 * UNIT_SIZE + 14;


        var lastY = wrapText(ctx, "Apple: Eat an Apple to grow your snake body and", x, y, canvas.width - 20);
        wrapText(ctx, "increase your score by " + POINTS_PER_APPLE + " points.", x, lastY + 20, canvas.width - 20);

        var y = 9 * UNIT_SIZE + 14;
        wrapText(ctx, "Coin: Collecting a Coin increases your score by " + POINTS_PER_COIN + " points.", x, y, canvas.width - 20);

        var y = 12 * UNIT_SIZE + 14;

        var lastY = wrapText(ctx, "Freeze: Entering a Freeze stops the snake head in place, while the ", x, y, canvas.width - 20);
        wrapText(ctx, "body keeps moving!", x, lastY + 20, canvas.width - 20);

        var y = 15 * UNIT_SIZE + 14;

        var lastY = wrapText(ctx, "Ghost: Pick up a Ghost to move through your snake ", x, y, canvas.width - 20);

        wrapText(ctx, "body without dying!", x, lastY + 20, canvas.width - 20);

        var y = 18 * UNIT_SIZE + 14;

        var lastY = wrapText(ctx, "Apple Magnet: When you pick up an Apple Magnet, you can eat ", x, y, canvas.width - 30);
        wrapText(ctx, "apples from a distance.", x, lastY + 20, canvas.width - 20);

        var y = 21 * UNIT_SIZE + 14;

        var lastY = wrapText(ctx, "Coin Magnet: When you pick up a Coin Magnet, you can collect ", x, y, canvas.width - 20);
        wrapText(ctx, "coins from a distance.", x, lastY + 20, canvas.width - 20);

        var y = 24 * UNIT_SIZE + 14;

        var lastY = wrapText(ctx, "Apple Frenzy: Randomly spawns a bunch of apples everywhere ", x, y, canvas.width - 20);
        wrapText(ctx, "and allows you to move through your snake body without dying.", x, lastY + 20, canvas.width - 20);



    }
}


class HelpB extends GameState {
    constructor() {
        super(HELP);

        let oneWay = new OneWay(2, 6);
        let finish = new Finish(2, 9)
        this.objects = new Array(oneWay, finish);
    }

    update() {
        this.drawBG(ctx);
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(ctx);

        }
        this.draw(ctx)

    }
    draw(ctx) {

        ctx.fillStyle = "white";
        ctx.font = "18px " + FONTFACE;
        ctx.textAlign = "center"

        ctx.fillText("HOW TO PLAY", canvas.width / 2, 30);

        ctx.font = "14px " + FONTFACE;
        ctx.textAlign = "center"

        var x = canvas.width / 2;
        var y = 3 * UNIT_SIZE + 14;


        var lastY = wrapText(ctx, "Use the arrow keys to move the snake. Hit your own snake body or a Wall,", x, y, canvas.width - 20);
        wrapText(ctx, "and it's game over!", x, lastY + 20, canvas.width - 20);

        ctx.textAlign = "left"


        var x = 4 * UNIT_SIZE;
        var y = 6 * UNIT_SIZE + 14;


        var lastY = wrapText(ctx, "One-way: You can pass through a One-way only once ", x, y, canvas.width - 20);
        wrapText(ctx, "before it turns into a Wall.", x, lastY + 20, canvas.width - 20);

        var y = 9 * UNIT_SIZE + 14;


        var lastY = wrapText(ctx, "Finish: Reach the Finish to complete a Level. To win, all ", x, y, canvas.width - 20);
        wrapText(ctx, "Apples in the level must be eaten beofre crossing the Finish", x, lastY + 20, canvas.width - 20);

    }
}

function wrapText(ctx, text, x, y, maxWidth, fontSize) {
    var words = text.split(' ');
    var line = '';
    var lineHeight = fontSize;


    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    return (y);
}
class MainMenu extends GameState {
    constructor() {
        super(MAIN_MENU);
        this.draw(ctx);


    }
    draw(ctx) {
        this.drawBG(ctx);

    }




}

class GameOver extends GameState {
    constructor(snake) {
        super(GAME_OVER);
        this.snake = snake;
        toggleScreen("game-over", true);

        this.draw(ctx);



    }

    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.font = "22px " + FONTFACE;
        ctx.fillText(GAME_OVER, canvas.width / 2, canvas.height / 2 - BUTTON_HEIGHT * 3);
        ctx.fillText("Length: " + this.snake.length, canvas.width / 2, canvas.height / 2 - BUTTON_HEIGHT * 3 + 30);


    }


}


class LevelGameOver extends GameState {
    constructor(snake, levelData, didWin) {
        super(LEVEL_GAME_OVER);
        this.snake = snake;
        this.didWin = didWin;
        this.levelData = levelData;
        this.score = snake.coinsCollected * POINTS_PER_COIN + snake.applesCollected * POINTS_PER_APPLE;

        toggleScreen("level-game-over", true);



        this.clearStars();
        this.draw(ctx);


    }

    update() {
        this.snake.drawHead(ctx);
    }


    drawStar(cx, cy, spikes, outerRadius, innerRadius, strokeColor, fillColor) {
        var rot = Math.PI / 2 * 3;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius)
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = strokeColor || COIN_COLOR;
        ctx.stroke();
        ctx.fillStyle = fillColor || 'yellow';
        ctx.fill();
        ctx.lineWidth = 1;

    }

    drawStars() {
        let numStars = 0;

        let coinPercentage = this.snake.coinsCollected / this.levelData.numCoins * 100;

        if (coinPercentage >= 1 && coinPercentage <= 40) {
            numStars = 1;

        }
        else if (coinPercentage >= 41 && coinPercentage <= 99) {

            numStars = 2;

        }
        else if (coinPercentage == 100) {

            numStars = 3;
        }
        for (let i = 0; i < 3; i++) {
            this.drawStar(canvas.width / 2 + (i * 50) - 3 * 15, canvas.height / 2 - 130, 5, 15, 10, 'gray', 'lightgray')

        }
        for (let i = 0; i < numStars; i++) {

            this.drawStar(canvas.width / 2 + (i * 50) - 3 * 15, canvas.height / 2 - 130, 5, 15, 10)

        }

    }
    clearStars() {
        for (let i = 0; i < 3; i++) {

            const star = document.getElementById(i + 1);
            const img = document.getElementById(i + 1);

            if (img) {

                img.remove();

            }
        }
    }

    draw(ctx) {

        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.font = "22px " + FONTFACE;
        if (this.didWin) {
            ctx.fillText("LEVEL COMPLETE", canvas.width / 2, canvas.height / 2 - 200);
            ctx.fillText("Score: " + this.score, canvas.width / 2, canvas.height / 2 - 200 + 30);
            this.drawStars();

        }
        else {
            ctx.fillText(GAME_OVER, canvas.width / 2, canvas.height / 2 - BUTTON_HEIGHT * 3);
        }






    }
}
let levels = [];
fetch('levels.json')
    .then(response => response.json())
    .then(data => {
        levels = data.levels;


    });


class Level extends GameState {
    constructor(levelData) {
        super(LEVEL);
        this.levelData = levelData;
        this.score = 0;
        speed = 8;
        this.startGame();



    }
    update() {
        this.drawBG(ctx);
        this.drawGame(ctx);


        //update map
        this.map.update(ctx);

        //draw ui
        this.drawTopUI(ctx);
        this.drawBottomUI(ctx)

        //check collisions
        this.map.checkCollisions();




    }

    drawTopUI(ctx) {
        ctx.save();

        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(0, canvas.height - 40, canvas.width, 30);

        ctx.fillStyle = "white";
        ctx.font = "18px " + FONTFACE;

        ctx.textAlign = "left"
        ctx.fillText("Apples: " + this.snake.applesCollected + "/" + this.levelData.numApples, 20, 30);

        ctx.textAlign = "center"
        ctx.fillText("Level " + this.levelData.levelNum + ": " + this.levelData.title, canvas.width / 2, 30);

        ctx.textAlign = "right"
        ctx.fillText("Coins: " + this.snake.coinsCollected + "/" + this.levelData.numCoins, canvas.width - 20, 30);

        ctx.restore();
    }

    drawBottomUI(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "18px " + FONTFACE;
        ctx.textAlign = "left"
        ctx.fillText("Score: " + this.score, 20, canvas.height - 20);
        ctx.textAlign = "right"
        const highscore = this.levelData?.highscore || 0;
        ctx.fillText("Highscore: " + highscore, canvas.width - 20, canvas.height - 20);

        ctx.restore();

    }


    drawGame(ctx) {
        ctx.fillStyle = GROUND_COLOR;
        ctx.fillRect(canvas.width / 2 - WIDTH / 2, canvas.height / 2 - HEIGHT / 2, WIDTH, HEIGHT);

    }
    fillWals() {
        for (let y = 0; y < this.levelData.map.length; y++) {
            for (let x = 0; x < this.levelData.map[0].length; x++) {
                if (this.levelData.map[y][x] == "1") {
                    this.map.addObject(new Wall(x + game.minX, y + game.minY));
                }
            }
        }
    }
    fillMap() {

        // C = coin 0 = empty 1 = wall  3 = apple 4 = finish
        // 5 = freeze 7 = ghost P = portal 1a p = portal 2a W = portal 1b  w = portal 2b
        // Q = portal 3a  q = portal 3b 6 = one way D = door1 d = door2  b = door3
        // K = key1  k = key2  y = key3 E = enemy 1
        for (let y = 0; y < this.levelData.map.length; y++) {
            for (let x = 0; x < this.levelData.map[0].length; x++) {
                switch (this.levelData.map[y][x]) {
                    case "3":
                        this.map.addObject(new Apple(x + game.minX, y + game.minY));
                        break;
                    case "4":
                        this.map.addObject(new Finish(x + game.minX, y + game.minY));
                        break;
                    case "5":
                        this.map.addObject(new Freeze(x + game.minX, y + game.minY))
                        break;
                    case "6":
                        this.map.addObject(new OneWay(x + game.minX, y + game.minY))
                        break;
                    case "C":
                        this.map.addObject(new Coin(x + game.minX, y + game.minY));
                        break;
                    case "D":
                        this.map.addObject(new Door(x + game.minX, y + game.minY, "green"));
                        break;
                    case "d":
                        this.map.addObject(new Door(x + game.minX, y + game.minY, "pink"));
                        break;
                    case "K":
                        this.map.addObject(new Key(x + game.minX, y + game.minY, "green"));
                        break;

                    case "k":
                        this.map.addObject(new Key(x + game.minX, y + game.minY, "pink"));
                        break;



                }
            }
        }
    }
    startGame() {
        this.snake = new Snake(this.levelData.snakeX + game.minX, this.levelData.snakeY + game.minY, this.levelData.startLength);
        this.map = new GameMap(this.snake);
        this.fillWals();
        this.fillMap();


    }
    didWin() {
        return this.snake.applesCollected == this.levelData.numApples;
    }
    onGameOver(didWin) {
        this.isGameOver = true;
        levels[currentLevel - 1].score = this.score;
        if (didWin) {

            this.snake.changeState(new Victory(this.snake));
            if (this.score > (this.levelData?.highscore || 0)) {
                levels[currentLevel - 1].highscore = this.score;
            }

        }
        else {
            this.snake.changeState(new Dead(this.snake));

        }
        game.changeState(new LevelGameOver(this.snake, this.levelData, didWin))

    }
    handleCollision(other) {
        switch (other?.type) {
            case APPLE:
                playSound(appleSound);
                this.score += POINTS_PER_APPLE;
                this.snake.grow(1);
                this.snake.applesCollected++;
                this.map.removeObject(other);
                break;
            case COIN:
                playSound(coinSound);
                this.score += POINTS_PER_COIN;
                this.map.removeObject(other);
                this.snake.coinsCollected++;

                break;

            case SNAKE:
            case WALL:
                this.onGameOver(false);
                break;
            case GHOST:
                playSound(ghostSound)
                this.map.removeObject(other);
                this.snake.changeState(new GhostState(this.snake));

                break;
            case FREEZE:
                playSound(freezeSound);
                this.snake.changeState(new Frozen(this.snake));
                this.map.removeObject(other);
                break;
            case APPLE_MAGNET:
                playSound(magnetSound);
                this.map.removeObject(other);
                this.snake.changeState(new AppleMagnetic(this.snake));
                break;
            case COIN_MAGNET:
                playSound(magnetSound);
                this.map.removeObject(other);
                this.snake.changeState(new CoinMagnetic(this.snake));
                break;


            case ONE_WAY:
                if (other.isOpen) {
                    playSound(oneWaySound);
                    other.isOpen = false;
                }
                else {
                    this.onGameOver(false);
                }
                break;

            case PORTAL:
                this.snake.setPosition(other.endPortal.x, other.endPortal.y);
            case DOOR:

                if (!other.isOpen) {
                    this.onGameOver(false);
                }
                break;
            case KEY:
                playSound(keySound);
                Door.unlock(other.color);
                break;
            case FINISH:
                this.onGameOver(this.didWin());
                break;


        }
    }


}

class Levels extends GameState {
    constructor() {
        super(LEVELS);
        this.draw(game.ctx);


    }

    draw(ctx) {
        this.drawBG(ctx);
    }



}



class Endless extends GameState {


    constructor() {
        super(ENDLESS);
        this.startGame();


    }
    startGame() {
        this.snake = new Snake(Math.round(canvas.width / 2 / UNIT_SIZE), Math.round(canvas.height / 2 / UNIT_SIZE));

        this.map = new GameMap(this.snake);
        this.spawner = new Spawner(this.map);
        var apple = this.spawner.spawnApple();
        this.map.addObject(apple);
        this.isGameOver = false;
        this.score = 0;
        this.frenzyApples = [];
    }

    drawLengthAndScore(ctx) {
        ctx.save();
        // ctx.fillStyle = WALL_COLOR;
        // ctx.fillRect(0, 0, canvas.width, 50);
        ctx.fillStyle = "white";
        ctx.font = "18px " + FONTFACE;
        ctx.textAlign = "left"

        ctx.fillText("Length: " + this.snake.length, 20, 30);
        ctx.textAlign = "right"

        ctx.fillText("Score: " + this.score, canvas.width - 20, 30);
        ctx.restore();
    }

    drawHighscore(ctx) {
        ctx.save();
        // ctx.fillStyle = WALL_COLOR;

        // ctx.fillRect(0, canvas.height - 40, canvas.width, 30);

        ctx.fillStyle = "white";
        ctx.font = "18px " + FONTFACE;
        ctx.textAlign = "left"
        ctx.fillText("Best Length: " + bestLength, 20, canvas.height - 20);
        ctx.textAlign = "right"

        ctx.fillText("Highscore: " + highscore, canvas.width - 20, canvas.height - 20);

        ctx.restore();

    }

    drawGame(ctx) {
        ctx.fillStyle = GROUND_COLOR;
        ctx.fillRect(canvas.width / 2 - WIDTH / 2, canvas.height / 2 - HEIGHT / 2, WIDTH, HEIGHT);

    }

    update() {
        this.drawBG(ctx);
        this.drawGame(ctx);

        //update map
        this.map.update(ctx);

        //draw UI
        this.drawLengthAndScore(ctx);
        this.drawHighscore(ctx)


        //check frenzy
        if (this.snake.currentState.type == FRENZY) {

            let position = this.map.getRandomEmptyPosition();
            let apple = new Apple(position.x, position.y, true);
            this.frenzyApples.push(apple);
            this.map.addObject(apple);

        }
        else {

            this.map.removeObjects(this.frenzyApples);
            this.frenzyApples = [];
        }


        //check win
        if (this.snake.length >= GAME_UNITS) {
            this.snake.changeState(new Victory(this.snake));
            this.isGameOver = true;
        }

        //check lose
        if (this.isGameOver) {

            if (this.snake.length > bestLength) {
                bestLength = this.snake.length;
            }
            if (this.score > highscore) {
                highscore = this.score;
            }
            game.changeState(new GameOver(this.snake))

        }

        else {
            //spawn objects only when the snake is not idle
            this.snake.currentState.type != IDLE && this.spawner.update();

            this.map.checkCollisions();



        }

    }
    handleCollision(other) {
        switch (other?.type) {
            case APPLE:
                playSound(appleSound);
                this.score += POINTS_PER_APPLE
                if (other.isFrenzyApple) {
                    this.map.removeObject(other);

                }
                else {
                    this.spawner.repositionApple();
                }



                this.snake.grow(4);
                break;
            case COIN:
                playSound(coinSound);
                this.score += 100;
                this.map.removeObject(other);
                break;

            case SNAKE:
            case WALL:
                this.isGameOver = true;
                this.snake.changeState(new Dead(this.snake));

                break;
            case GHOST:
                playSound(ghostSound)
                this.map.removeObject(other);
                this.snake.changeState(new GhostState(this.snake));
                break;
            case FREEZE:
                playSound(freezeSound);
                this.map.removeObject(other);
                this.snake.changeState(new Frozen(this.snake));
                break;
            case APPLE_MAGNET:
                playSound(magnetSound);
                this.map.removeObject(other);
                this.snake.changeState(new AppleMagnetic(this.snake));
                break;
            case COIN_MAGNET:
                playSound(magnetSound);
                this.map.removeObject(other);
                this.snake.changeState(new CoinMagnetic(this.snake));
                break;
            case FRENZY:
                playSound(frenzySound);
                this.map.removeObject(other);
                this.map.removeAllObjects();
                this.snake.changeState(new FrenzyState(this.snake));
                break;

        }
    }






}







//------------------------------------SNAKE OBJECTS------------------------------------------//




class SnakeObject {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }



}

class Portal extends SnakeObject {
    static portalEntered;
    constructor(x, y, id) {
        super(x, y, PORTAL);


    }
    setEndPortal(endPortal) {
        this.endPortal = endPortal;
    }

    update(ctx) {
        this.draw(ctx)
    }

    draw(ctx) {
        ctx.strokeStyle = "pink";
        ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE + 2, UNIT_SIZE);
        ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
        ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE - 2, UNIT_SIZE - 2);

    }

}

class Wall extends SnakeObject {
    constructor(x, y) {
        super(x, y, WALL);
    }

    update(ctx) {
        this.draw(ctx);
    }
    draw(ctx) {
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
        // ctx.strokeStyle = "black";
        // ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);


    }
}

class Finish extends SnakeObject {
    constructor(x, y) {
        super(x, y, FINISH);
    }

    update(ctx) {
        this.draw(ctx);
    }
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1);
    }
}




class OneWay extends SnakeObject {
    static maxTime = POWERUP_TIME;

    constructor(x, y, isOpen = true) {
        super(x, y, ONE_WAY);
        this.isOpen = isOpen;
    }
    update(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        if (this.isOpen) {
            ctx.strokeStyle = "rgb(163,91,49)";
            ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
        }
        else {
            ctx.fillStyle = "rgb(163,91,49)";
            ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);

        }
    }

}

class Door extends SnakeObject {
    static doors = [];
    constructor(x, y, color, isOpen = false) {
        super(x, y, DOOR);
        this.isOpen = isOpen;
        this.color = color;
        Door.doors.push(this);
    }

    update(ctx) {
        this.draw(ctx);
    }
    static unlock(color) {
        for (let i = 0; i < Door.doors.length; i++) {
            if (Door.doors[i].color == color) {
                Door.doors[i].isOpen = true;
            }
        }

    }
    draw(ctx) {

        if (this.isOpen) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
        }
        else {

            ctx.fillStyle = this.color;
            ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);

        }
    }
}

class Key extends SnakeObject {
    constructor(x, y, color) {
        super(x, y, KEY);

        this.color = color;
    }

    update(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.roundRect(this.x * UNIT_SIZE + 5, this.y * UNIT_SIZE, UNIT_SIZE / 2, UNIT_SIZE / 2, UNIT_SIZE / 4);
        ctx.stroke();
        ctx.fillRect(this.x * UNIT_SIZE + 7.5, this.y * UNIT_SIZE + UNIT_SIZE / 2, UNIT_SIZE - 15, UNIT_SIZE / 2);

        ctx.restore();


    }
}

class AppleMagnet extends SnakeObject {
    static maxTime = POWERUP_TIME;

    constructor(x, y) {
        super(x, y, APPLE_MAGNET);
        this.timerStarted = false;
    }
    update(ctx) {
        this.draw(ctx);

    }

    draw(ctx) {

        ctx.strokeStyle = APPLE_COLOR;
        ctx.strokeRect(this.x * UNIT_SIZE - 5, this.y * UNIT_SIZE - 5, UNIT_SIZE * 1.5, UNIT_SIZE * 1.5);
        ctx.strokeRect(this.x * UNIT_SIZE - 15, this.y * UNIT_SIZE - 15, UNIT_SIZE * 2.5, UNIT_SIZE * 2.5);
        ctx.fillStyle = APPLE_COLOR;
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);


    }

}


class CoinMagnet extends SnakeObject {
    static maxTime = POWERUP_TIME;

    constructor(x, y) {
        super(x, y, COIN_MAGNET);
        this.timerStarted = false;
    }

    update(ctx) {

        this.draw(ctx)
    }

    draw(ctx) {
        ctx.strokeStyle = COIN_COLOR;
        ctx.strokeRect(this.x * UNIT_SIZE - 5, this.y * UNIT_SIZE - 5, UNIT_SIZE * 1.5, UNIT_SIZE * 1.5);
        ctx.strokeRect(this.x * UNIT_SIZE - 15, this.y * UNIT_SIZE - 15, UNIT_SIZE * 2.5, UNIT_SIZE * 2.5);
        ctx.fillStyle = COIN_COLOR;

        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
    }
}



class Coin extends SnakeObject {
    static maxTime = POWERUP_TIME;

    constructor(x, y) {
        super(x, y, COIN);
    }

    update(ctx) {
        this.draw(ctx)

    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.fillStyle = COIN_COLOR;
        ctx.strokeStyle = COIN_COLOR;
        ctx.roundRect(this.x * UNIT_SIZE + 5, this.y * UNIT_SIZE + 5, UNIT_SIZE - 10, UNIT_SIZE - 10, (UNIT_SIZE - 10) / 2);
        ctx.fill();


        ctx.roundRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, UNIT_SIZE / 2);
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.restore();


    }
}



class Apple extends SnakeObject {
    constructor(x, y, isFrenzyApple = false) {
        super(x, y, APPLE);
        this.isFrenzyApple = isFrenzyApple;
    }


    update(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.fillStyle = APPLE_COLOR;
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE - 1, UNIT_SIZE - 1, UNIT_SIZE - 1);
    }

}

class Ghost extends SnakeObject {
    static maxTime = POWERUP_TIME;
    constructor(x, y) {
        super(x, y, GHOST);
        this.timerStarted = false;

    }
    update(ctx) {
        this.draw(ctx);

    }
    draw(ctx) {
        ctx.fillStyle = GROUND_COLOR;
        ctx.strokeStyle = SNAKE_COLOR;

        ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);

        ctx.fillStyle = GROUND_COLOR;
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x * UNIT_SIZE + 5, this.y * UNIT_SIZE + 5, UNIT_SIZE - 10, UNIT_SIZE - 10);


    }
}
class Frenzy extends SnakeObject {
    static maxTime = POWERUP_TIME;
    constructor(x, y) {
        super(x, y, FRENZY);
        this.timerStarted = false;
    }

    update(ctx) {
        this.draw(ctx);

    }
    draw(ctx) {
        const x = this.x * UNIT_SIZE + UNIT_SIZE / 2;
        const y = this.y * UNIT_SIZE - 5;
        const width = UNIT_SIZE + 10;
        const height = UNIT_SIZE + 10;
        ctx.save();/*  w w  w .j a va 2 s  .c o m*/
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 3;

        // top left edge
        ctx.lineTo(x - width / 2, y + height / 2);

        // bottom left edge
        ctx.lineTo(x, y + height);

        // bottom right edge
        ctx.lineTo(x + width / 2, y + height / 2);

        // closing the path automatically creates
        // the top right edge
        ctx.closePath();

        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);

        let randomR = Math.floor(Math.random() * 255);
        let randomG = Math.floor(Math.random() * 255);
        let randomB = Math.floor(Math.random() * 255);
        ctx.fillStyle = "rgb(" + randomR + "," + randomG + "," + randomB + ")";

        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
        ctx.lineWidth = 1;
        ctx.restore();
    }
}
class Freeze extends SnakeObject {
    static maxTime = FREEZE_TIME;
    constructor(x, y) {
        super(x, y, FREEZE);
    }
    update(ctx) {
        this.draw(ctx);
    }
    draw(ctx) {
        const x = this.x * UNIT_SIZE + UNIT_SIZE / 2;
        const y = this.y * UNIT_SIZE;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);

        // top left edge
        ctx.lineTo(x - UNIT_SIZE / 2, y + UNIT_SIZE / 2);

        // bottom left edge
        ctx.lineTo(x, y + UNIT_SIZE);

        // bottom right edge
        ctx.lineTo(x + UNIT_SIZE / 2, y + UNIT_SIZE / 2);

        // closing the path automatically creates
        // the top right edge
        ctx.closePath();

        ctx.strokeStyle = FREEZE_COLOR;
        ctx.stroke();

        ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1);
        ctx.restore();


    }
}
class Snake extends SnakeObject {

    currentState = new Idle(this);
    changeY = 0;
    changeX = 0;
    coinsCollected = 0;
    applesCollected = 0;
    x = [];
    y = [];
    coins = 0;
    constructor(x, y, length = 1) {
        super(x, y, SNAKE);
        this.x[0] = x;
        this.y[0] = y;

        this.length = length;

    }
    setPosition(x, y) {
        this.x[0] = x;
        this.y[0] = y;
    }


    changeState(state) {
        this.currentState.exitState();
        this.currentState = state;
    }

    collectCoin() {
        this.coinsCollected++;
    }

    setChangeX() {

    }
    drawHead(ctx) {
        this.currentState.drawHead(ctx);
    }
    drawBody(ctx) {
        this.currentState.drawBody(ctx);

    }
    update(ctx) {
        this.currentState.update();

        this.draw(ctx);
    }

    draw(ctx) {

        this.currentState.draw(ctx);


    }

    grow(amount = 4) {
        this.length += amount;
    }
    moveBody() {
        for (let i = this.length; i > 0; i--) {

            this.x[i] = this.x[i - 1];
            this.y[i] = this.y[i - 1];
        }

    }
    moveHead() {
        this.x[0] += this.changeX;
        this.y[0] += this.changeY;
    }
}




//-------------------------------------GAME-----------------------------------------//


class Spawner {
    timer = 0;
    objects = new Array(Coin, Coin, Coin, CoinMagnet, AppleMagnet, Ghost, Freeze, Freeze, Frenzy);
    constructor(map) {
        this.map = map;
        this.timerMax = 40;
        this.maxObjects = 4;

    }

    update() {
        const minLength = 9; //the minimum length the snake has to be before spawning begins
        const objects = this.map.objects.filter(item => item.type != WALL && item.type != APPLE);
        if (objects.length <= this.maxObjects && this.map.snake.length >= minLength && this.map.snake.length < GAME_UNITS / 3 && this.map.snake.currentState.type != FRENZY)
            this.timer++;

        if (this.timer >= this.timerMax) {
            this.timer = 0;
            this.timerMax = Math.floor(Math.random() * 20);
            this.maxObjects = Math.floor(Math.random() * 6);
            let objectsToSpawn = this.getRandomObjects();
            for (let i = 0; i < objectsToSpawn.length; i++) {
                var position = this.map.getRandomEmptyPosition();

                let snakeObject = new objectsToSpawn[i];
                snakeObject.setPosition(position.x, position.y);
                this.map.addObject(snakeObject);


            }

        }


    }
    getRandomObjects() {
        let numObjects = Math.floor(Math.random() * 3);
        let objectIndex = Math.floor(Math.random() * this.objects.length);

        let objects = [];

        for (let i = 0; i < numObjects; i++) {
            objects.push(this.objects[objectIndex]);
        }

        return objects;
    }
    spawnApple() {
        let position = this.map.getRandomEmptyPosition();
        if (!position) {
            return null;
        }
        var apple = new Apple(position.x, position.y);
        this.apple = apple;
        return apple;
    }

    repositionApple() {
        let position = this.map.getRandomEmptyPosition();
        if (position)
            this.apple.setPosition(position.x, position.y);
    }

}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)


class GameMap {
    constructor(snake) {
        this.snake = snake;

        this.objects = new Array();

        this.fillWals();
    }


    removeObject(object) {
        this.objects = this.objects.filter(item => object != item);
    }
    removeObjects(objects) {
        for (let i = 0; i < objects.length; i++) {
            this.objects = this.objects.filter(item => objects[i] != item);
        }
    }
    removeAllObjects() {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].type != WALL && this.objects[i].type != APPLE) {
                this.removeObject(this.objects[i]);
            }
        }
    }
    addObject(object) {
        this.objects.push(object);
    }
    update(ctx) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(ctx);
        }

        //update the snake (player)
        this.snake.update(ctx);

    }
    fillWals() {

        for (let x = game.minX - 1; x < TILE_WIDTH + game.minX; x++) {
            for (let y = game.minY - 1; y < TILE_HEIGHT + game.minY; y++) {
                if (x == game.minX - 1 || x == TILE_WIDTH + game.minX - 1 || y == game.minY - 1 || y == TILE_HEIGHT + game.minY - 1) {
                    let wall = new Wall(x, y);
                    this.objects.push(wall);
                }
            }
        }

    }
    getRandomEmptyPosition() {

        while (true) {
            let x = Math.floor(clamp(Math.random() * canvas.width, game.minX, game.maxX));
            let y = Math.floor(clamp(Math.random() * canvas.height, game.minY, game.maxY));
            if (this.snake.length >= GAME_UNITS) {
                return null;
            }

            if (!this.isOccupied(x, y) && !this.isOnBody(x, y)) {

                return { x, y };

            }


        }




    }
    isOnBody(x, y) {
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake.x[i] == x && this.snake.y[i] == y)
                return true;
        }
    }
    isOccupied(x, y) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].x == x && this.objects[i].y == y) {
                return this.objects[i];
            }
        }
        return null;
    }
    checkCollisions() {

        for (let i = 0; i < this.objects.length; i++) {
            if (this.snake.currentState.isObjectCollision(this.objects[i])) {
                game.currentState.handleCollision(this.objects[i]);
            }

        }

        if (this.snake.currentState.isBodyCollision()) {
            game.currentState.handleCollision(this.snake);

        }

    }


}


class Game {
    isPaused = false;
    constructor(ctx) {
        this.ctx = ctx;
        this.currentState = new MainMenu();
        this.minX = Math.round((canvas.width / 2 - WIDTH / 2) / UNIT_SIZE);
        this.maxX = Math.round((canvas.width / 2 + WIDTH / 2) / UNIT_SIZE - 1);
        this.minY = Math.round((canvas.height / 2 - HEIGHT / 2) / UNIT_SIZE);
        this.maxY = Math.round((canvas.height / 2 + HEIGHT / 2) / UNIT_SIZE - 1);

        this.update();
    }


    changeState(state) {
        this.currentState = state;
    }
    update() {

        setTimeout(() => {

            this.currentState.update();
            this.update();



        }, 1000 / speed);

    }




}

//-----------------------------------INPUT-------------------------------------------//
function moveSnake(direction) {

    if (game.currentState.type != ENDLESS && game.currentState.type != LEVEL) {
        return;
    }
    const snake = game.currentState.snake;

    if (direction == "U") {
        if (snake.changeY == 1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeY = -1;
        snake.changeX = 0;
    }
    if (direction == "L") {
        if (snake.changeX == 1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeY = 0;
        snake.changeX = -1;
    }
    if (direction == "R") {
        if (snake.changeX == -1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeX = 1;
        snake.changeY = 0;
    }

    if (direction == "D") {
        if (snake.changeY == -1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeY = 1;
        snake.changeX = 0;

    }


}


function onKeyDown(event) {
    //up
    if (event.keyCode == 38) {
        moveSnake("U");

    }
    //down
    if (event.keyCode == 40) {
        moveSnake("D")

    }

    //left
    if (event.keyCode == 37) {
        moveSnake("L")
    }

    //right
    if (event.keyCode == 39) {
        moveSnake("R");

    }


}

//-----------------------------------MAIN-------------------------------------------//
function detectMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

function toggleScreen(id, show) {
    let element = document.getElementById(id);
    let display = show ? 'grid' : 'none';
    element.style.display = display;
}

function onEndlessPress() {
    if (canvas) {

        toggleScreen("main-menu", false);
        game.changeState(new Endless(game));
    }

}

function onLevelsPress() {

    toggleScreen("main-menu", false);
    toggleScreen("levels", true);
    toggleScreen("level-game-over", false);


    game.changeState(new Levels());
}

function onMainMenuPress() {
    toggleScreen("game-over", false);
    toggleScreen("main-menu", true);
    toggleScreen("levels", false);
    toggleScreen("level-game-over", false);

    toggleScreen("helpA", false);
    toggleScreen("helpB", false);


    game.changeState(new MainMenu());
}
function onRestartEndlessPress() {
    toggleScreen("game-over", false);
    toggleScreen("level-game-over", false);
    game.changeState(new Endless());

}

function onRestartLevelPress() {
    toggleScreen("level-game-over", false);
    game.changeState(new Level(levels[currentLevel - 1]));

}
function onNextLevelPress() {

    if (currentLevel < LEVEL_COUNT) {
        currentLevel++;
        toggleScreen('level-game-over', false);
        game.changeState(new Level(levels[currentLevel - 1]));
    }

}

function onHelpPress() {
    toggleScreen("main-menu", false);
    toggleScreen("helpA", true);

    game.changeState(new HelpA());
}

function onHelpNextPress() {
    toggleScreen("helpA", false);
    toggleScreen("helpB", true);
    game.changeState(new HelpB());


}
function onHelpBackPress() {
    toggleScreen("helpB", false);
    toggleScreen("helpA", true);
    game.changeState(new HelpA());


}
function main() {
    toggleScreen("game-over", false);
    toggleScreen("level-game-over", false);
    toggleScreen("levels", false);
    toggleScreen("helpA", false);
    toggleScreen("helpB", false);


    if (isMobile == true) {




        const container = document.getElementById("canvas-container");
        container.style.width = "100%";
        container.style.height = "100%"


        //create and append up buton
        var button = document.createElement("button");
        button.className = "control-button";
        button.id = "up";

        button.onclick = () => moveSnake("U");

        var node = document.createTextNode("↑");
        button.appendChild(node);
        var element = document.getElementById("up-container");
        element.appendChild(button);



        //create and append down button
        var button = document.createElement("button");
        button.className = "control-button";
        button.id = "down";

        button.onclick = () => moveSnake("D");

        var node = document.createTextNode("↓");
        button.appendChild(node);
        var element = document.getElementById("down-container");
        element.appendChild(button);



        //create and append left button
        var button = document.createElement("button");
        button.className = "control-button";
        button.id = "left";

        button.onclick = () => moveSnake("L");
        var node = document.createTextNode("←");
        button.appendChild(node);
        var element = document.getElementById("left-right-container");
        element.appendChild(button);

        //create and add middle div
        var div = document.createElement("div");

        div.className = "control-button";
        element.appendChild(div);

        //create and append right button
        var button = document.createElement("button");
        button.id = "right";
        button.className = "control-button";
        button.onclick = () => moveSnake("R");

        var node = document.createTextNode("→");
        button.appendChild(node);
        element.appendChild(button);



    }
    for (let i = 0; i < LEVEL_COUNT; i++) {
        const button = document.createElement("button");
        const node = document.createTextNode(i + 1);
        button.style.width = isMobile ? "40px" : "60px";
        button.style.height = isMobile ? "40px" : "60px";

        button.onclick = (e) => {
            toggleScreen("levels", false);
            currentLevel = i + 1;
            game.changeState(new Level(levels[i]));
        }
        button.appendChild(node);
        const element = document.getElementById("level-buttons-container");
        element.appendChild(button);
    }






}
const game = new Game(ctx);

document.body.addEventListener('keydown', onKeyDown);

main();