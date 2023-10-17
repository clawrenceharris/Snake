import SnakeBaseState from "./SnakeBaseState";

export class Dead extends SnakeBaseState {
    constructor(snake) {
        super(snake);
        this.snake.headColor = "rgb(225,225,225)";
    }

    update() {

    }




}

