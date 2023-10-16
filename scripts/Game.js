import Apple from "./Apple";
import { Snake } from "./Snake";
import { GAME_UNITS, HEIGHT, RESTART_BUTTON, TILE_HEIGHT, TILE_WIDTH, UNIT_SIZE, WIDTH } from "./constants";


export default class Game {
    isGameOver = false;
    speed = 9;
    apple = new Apple(15, 10);
    snake = new Snake(10, 10);
    bestLength = 0;

    constructor(ctx) {
        this.objects = new Array(this.apple);
        this.ctx = ctx;
        this.fillBorders();
        this.startGame();
        this.update();
    }

    startGame() {

        this.snake.changeX = 0;
        this.snake.changeY = 0;
        this.apple = new Apple(TILE_WIDTH / 2 + 5, TILE_HEIGHT / 2);
        this.snake = new Snake(TILE_WIDTH / 2, TILE_HEIGHT / 2);
        this.isGameOver = false;
        this.objects = new Array(this.apple);
        this.fillBorders();

    }
    drawGame() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

    }
    update() {

        setTimeout(() => {

            this.update();

            this.drawGame();
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].update(ctx);
            }
            this.snake.update(this.ctx);

            if (this.isGameOver) {
                this.drawGameOver();
                if (this.snake.length > this.bestLength) {
                    this.bestLength = this.snake.length;
                }
            }
            else {
                this.checkCollision();
                this.drawLength();


            }
            this.apple.update(this.ctx);



        }, 1000 / this.speed);

    }
    fillBorders() {

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < TILE_HEIGHT; y++) {
                if (x == 0 || x == TILE_WIDTH - 1 || y == 0 || y == height - 1) {
                    var wall = new Wall(x, y);
                    this.objects.push(wall);
                }
            }
        }
    }
    drawLength() {
        ctx.fillStyle = "rgb(13,30,58)";
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.fillStyle = "white";
        ctx.font = "18px Verdana";
        ctx.textAlign = "center"

        ctx.fillText("Length: " + this.snake.length, 50, canvas.height - 10);
        ctx.fillText("Best: " + this.bestLength, canvas.width - 50, canvas.height - 10);


    }

    drawGameOver() {
        ctx.fillStyle = "rgb(51,51,51)";
        ctx.strokeStyle = "white"
        ctx.roundRect(RESTART_BUTTON.x, RESTART_BUTTON.y, RESTART_BUTTON.width, RESTART_BUTTON.height, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.font = "22px sans-serif";
        ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);
        ctx.fillText("Length: " + this.snake.length, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2 + (restartButton.height / 4) + 60);
    }
    handleCollision(other) {
        switch (other.type) {
            case APPLE:
                var position = this.getRandomEmptyPosition();
                this.apple.setPosition(position.x, position.y);
                this.snake.grow();
                break;
            case SNAKE:
            case WALL:
                this.isGameOver = true;
                this.snake.changeState(new Dead(this.snake));
                break;

        }
    }
    getRandomEmptyPosition() {
        while (this.snake.length < GAME_UNITS) {
            let x = Math.floor(Math.random() * TILE_WIDTH);
            let y = Math.floor(Math.random() * TILE_HEIGHT);
            if (!this.isOccupied(x, y) && this.snake.x[0] != x && this.snake.y[0] != y) {
                return { x, y };
            }
        }
    }

    checkCollision() {
        var other = this.isOccupied(this.snake.x[0], this.snake.y[0])
        if (other) {
            console.log("collided with " + other.type);
            this.handleCollision(other);

        }

        for (let i = this.snake.length; i > 0; i--) {
            if (this.snake.x[0] == this.snake.x[i + 1] && this.snake.y[0] == this.snake.y[i + 1]) {
                this.handleCollision(this.snake);

            }

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
}



