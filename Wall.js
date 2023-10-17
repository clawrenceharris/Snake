import SnakeObject from "./SnakeObject";
import { UNIT_SIZE, WALL } from "./constants";

export default class Wall extends SnakeObject {
    constructor(x, y) {
        super(x, y, WALL);
    }

    update(ctx) {
        this.draw(ctx);
    }
    draw(ctx) {
        ctx.fillStyle = 'rgb(13,30,58)';
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
    }
}