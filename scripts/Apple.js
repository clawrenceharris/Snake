import SnakeObject from "./SnakeObject";
import { APPLE, UNIT_SIZE } from "./constants";

export default class Apple extends SnakeObject {
    constructor(x, y) {
        super(x, y, APPLE);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE - 1, UNIT_SIZE, UNIT_SIZE - 1);
    }

}