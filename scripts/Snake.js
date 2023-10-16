import SnakeObject from "./SnakeObject";
import { SNAKE, UNIT_SIZE } from "./constants";

export class Snake extends SnakeObject {

    currentState = new Idle(this);
    x = [];
    y = [];
    changeX = 0;
    changeY = 0;
    constructor(x, y, length = 1) {
        super(x, y, SNAKE);
        this.headColor = "rgb(0,255,0)";
        this.x[0] = x;
        this.y[0] = y;
        this.length = length;

    }


    changeState(state) {
        this.currentState = state;
    }
    update(ctx) {
        this.currentState.update(this);
        this.draw(ctx);
    }

    draw(ctx) {
        //draws body
        ctx.fillStyle = "rgb(0,255,0)";
        for (let i = 0; i <= this.length; i++) {
            ctx.fillRect(this.x[i] * UNIT_SIZE, this.y[i] * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1)
        }

        //draws head
        ctx.fillStyle = this.headColor
        ctx.fillRect(this.x[0] * UNIT_SIZE, this.y[0] * UNIT_SIZE, UNIT_SIZE - 1, UNIT_SIZE - 1);


    }

    grow() {
        this.length += 4
    }
    moveBody() {
        for (let i = this.length; i > 0; i--) {

            this.x[i] = this.x[i - 1];
            this.y[i] = this.y[i - 1];
        }

    }
}