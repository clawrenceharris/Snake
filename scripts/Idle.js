import SnakeBaseState from "./SnakeBaseState";

export class Idle extends SnakeBaseState {
    constructor(snake) {
        super(snake);
        this.snake.headColor = "rgb(0,255,0)";


    }

    update() {

        if (this.snake.changeX != 0 || this.snake.changeY != 0) {
            this.snake.changeState(new Moving(this.snake));

        }
    }

}

