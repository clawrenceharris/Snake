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
const RESTART = "PLAY AGAIN";
const LEVEL_GAME_OVER = "level game over";
const SPEED = 9;
const LEVEL_COUNT = 15;
const POINTS_PER_COIN = 100;
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

const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

let bestLength = 0;
let highscore = 0;

let speed = SPEED;
let currentLevel = 0;

let appleSound = document.querySelector('#apple-crunch');
let ghostSound = document.querySelector('#ghost');
let magnetSound = document.querySelector('#magnet');
let coinSound = document.querySelector('#coin');
let victorySound = document.querySelector("#victory");
let oneWaySound = document.querySelector("#one-way");
let freezeSound = document.querySelector("#freeze");
let frenzySound = document.querySelector("#frenzy");

//--------------------------------SNAKE STATES----------------------------------------------//


function playSound(sound) {
    try {
        sound.play();
    }
    catch (e) {
        console.log(e);
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

    draw(ctx) {
        let randomR = Math.floor(Math.random() * 255);
        let randomG = Math.floor(Math.random() * 255);
        let randomB = Math.floor(Math.random() * 255);
        this.snake.headColor = "rgb(" + randomR + "," + randomG + "," + randomB + ")";
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



        speed = 20;
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
        ctx.font = "22px sans-serif";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - BUTTON_HEIGHT * 3);
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


        this.draw(ctx);

        this.clearStars();
        if (didWin)
            this.showStars();

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

    showStars() {
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
            this.drawStar(canvas.width / 2 + (i * 50) - 3 * 15, canvas.height / 2 - BUTTON_HEIGHT * 2.5, 5, 15, 10, 'gray', 'lightgray')

        }
        for (let i = 0; i < numStars; i++) {

            this.drawStar(canvas.width / 2 + (i * 50) - 3 * 15, canvas.height / 2 - BUTTON_HEIGHT * 2.5, 5, 15, 10)

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
    update() {

        this.snake.update(ctx);
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.font = "22px sans-serif";
        if (this.didWin) {
            ctx.fillText("LEVEL COMPLETE", canvas.width / 2, canvas.height / 2 - BUTTON_HEIGHT * 3.5 - 30);
            ctx.fillText("Score: " + this.score, canvas.width / 2, canvas.height / 2 - BUTTON_HEIGHT * 3.5);

        }
        else {
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - BUTTON_HEIGHT * 3);
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
        ctx.font = "18px Verdana";

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
        ctx.font = "18px Verdana";
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
    fillBorders() {
        for (let y = 0; y < this.levelData.map.length; y++) {
            for (let x = 0; x < this.levelData.map[0].length; x++) {
                if (this.levelData.map[y][x] == "1") {
                    this.map.addObject(new Wall(x + game.minX, y + game.minY));
                }
            }
        }
    }
    fillMap() {
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

                }
            }
        }
    }
    startGame() {
        this.snake = new Snake(this.levelData.snakeX + game.minX, this.levelData.snakeY + game.minY, this.levelData.startLength);
        this.map = new GameMap(this.snake);
        this.fillBorders();
        this.fillMap();


    }
    didWin() {
        console.log(this.snake.applesCollected == this.levelData.numApples)
        return this.snake.applesCollected == this.levelData.numApples;
    }
    onGameOver(didWin) {
        this.isGameOver = true;
        levels[currentLevel - 1].score = this.score;
        console.log(didWin)
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


            case FINISH:
                this.onGameOver(this.didWin());
                break;


        }
    }


}
// C = coin
// 0 = empty
// 1 = border
// @ = player
// 3 = apple
// 4 = finish
// 5 = freeze
// 7 = ghost
// P = portal 1a
// p = portal 2a
// W = portal 1b
// w = portal 2b
// Q = portal 1c
// q = portal 2c
// 6 = one way
// D = door 1
// d = door 2
// b = door 3
// K = key 1
// k = key 2
// y = key 3
// E = enemy 1
const level = [


    {
        width: 29,
        startLength: 1,
        height: 29,
        numCoins: 3,
        numApples: 5,
        snakeX: 2,
        snakeY: 27,
        map: [
            "11111111111111111111111111111",
            "15000000000000000000000000051",
            "10111111111111111111111111101",
            "10100000000000000000000000101",
            "10101111111111111111111110101",
            "10101000000000000000000010101",
            "10101011111111111111111010101",
            "10101010000000000000001010101",
            "10101010111111111111101010101",
            "10101010111111111111101010101",
            "10101010111111111111101010101",
            "10101010111111111111101010101",
            "10101010111100000111101010101",
            "10101010111101110111101010101",
            "10101010111101310111101010101",
            "10001010111101110111101010101",
            "10101010111100000111101010101",
            "10101010111111111111101010101",
            "10101010111111111111101010101",
            "10101010111111111111101010101",
            "10101010111111111111101010101",
            "10101010000000000000001010101",
            "10101011111111111111111010101",
            "10101000000000000000000010101",
            "10101111111111111111111110101",
            "10100000000000000000000000101",
            "10111111111111111111111111101",
            "14000000000000000000000000051",
            "11111111111111111111111111111",



        ]
    },

]

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
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(0, canvas.height - 40, canvas.width, 30);
        ctx.fillStyle = "white";
        ctx.font = "18px Verdana";
        ctx.textAlign = "left"

        ctx.fillText("Length: " + this.snake.length, 20, 30);
        ctx.textAlign = "right"

        ctx.fillText("Score: " + this.score, canvas.width - 20, 30);
        ctx.restore();
    }

    drawHighscore(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "18px Verdana";
        ctx.textAlign = "left"
        ctx.fillText("Best Length: " + bestLength, 20, canvas.height - 20);
        ctx.textAlign = "right"

        ctx.fillText("Highscore: " + highscore, canvas.width - 20, canvas.height - 20);

        ctx.restore();

    }

    drawGame(ctx) {
        ctx.fillStyle = GROUND_COLOR
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
            let apple = new Apple(position.x, position.y);
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
                this.score += 6
                this.spawner.repositionApple();
                this.snake.grow();
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
class Ground extends SnakeObject {
    constructor(x, y) {
        super(x, y, GROUND);
    }
    update(ctx) {
        this.draw(ctx);
    }
    draw(ctx) {
        ctx.fillStyle = GROUND_COLOR;
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
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
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
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

        ctx.fillStyle = COIN_COLOR
        ctx.roundRect(this.x * UNIT_SIZE + 5, this.y * UNIT_SIZE + 5, UNIT_SIZE - 10, UNIT_SIZE - 10, (UNIT_SIZE - 10) / 2);
        ctx.fill();
        ctx.strokeStyle = COIN_COLOR;
        ctx.roundRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, UNIT_SIZE / 2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();


    }
}



class Apple extends SnakeObject {
    constructor(x, y) {
        super(x, y, APPLE);
    }


    update(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.fillStyle = APPLE_COLOR;
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE - 1, UNIT_SIZE, UNIT_SIZE - 1);
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
        ctx.save();/*  w w  w .j a va 2 s  .c o m*/
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

        ctx.strokeRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
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
        const objects = this.map.objects.filter(item => item.type != WALL && item.type != APPLE);
        if (objects.length <= this.maxObjects && this.map.snake.length >= 9 && this.map.snake.length < GAME_UNITS / 3)
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

        this.fillBorders();
    }


    removeObject(object) {
        this.objects = this.objects.filter(item => object != item);
    }
    removeObjects(objects) {
        for (let i = 0; i < objects.length; i++) {
            this.objects = this.objects.filter(item => objects[i] != item);
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
    fillBorders() {

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
                console.log("collided with " + this.objects[i].type)
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



function onKeyDown(event, game) {
    if (game.currentState.type != ENDLESS && game.currentState.type != LEVEL) {
        return;
    }

    if (event.keyCode == 32) {
        game.isPaused = !game.isPaused;
    }
    //up
    const snake = game.currentState.snake;

    if (event.keyCode == 38) {
        if (snake.changeY == 1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeY = -1;
        snake.changeX = 0;

    }
    //down
    if (event.keyCode == 40) {
        if (snake.changeY == -1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeY = 1;
        snake.changeX = 0;

    }

    //left
    if (event.keyCode == 37) {
        if (snake.changeX == 1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeY = 0;
        snake.changeX = -1;

    }
    //right
    if (event.keyCode == 39) {
        if (snake.changeX == -1 && snake.length > 1 && snake.currentState.type != FROZEN) {
            return;
        }
        snake.changeX = 1;
        snake.changeY = 0;

    }



}

//-----------------------------------MAIN-------------------------------------------//
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
function main() {
    toggleScreen("game-over", false);
    toggleScreen("level-game-over", false);
    toggleScreen("levels", false);

    for (let i = 0; i < LEVEL_COUNT; i++) {
        const button = document.createElement("button");
        const node = document.createTextNode(i + 1);
        button.style.width = "60px";
        button.style.height = "60px";
        button.style.backgroundColor = "rgb(51,51,51)";
        // button.style.float = "left"

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

document.body.addEventListener('keydown', (e) => onKeyDown(e, game));

main();