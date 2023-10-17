import SnakeBaseState from "./SnakeBaseState";

export class Moving extends SnakeBaseState {
    constructor(snake) {
        super(snake);
        this.snake.headColor = "rgb(0,255,0)";
    }
    moveSnake() {
        this.snake.x[0] += this.snake.changeX;
        this.snake.y[0] += this.snake.changeY;
    }
    update() {
        this.moveSnake();
        this.snake.moveBody();
    }



}

