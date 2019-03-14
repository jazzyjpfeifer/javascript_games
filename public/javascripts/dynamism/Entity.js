class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
    }
}

class Paddle extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Paddle");

        this.setData("speed", 400);
    }

    moveLeft() {
        this.body.velocity.x = -this.getData("speed");
    }

    moveRight() {
        this.body.velocity.x = this.getData("speed");
    }

    update() {
        this.body.setVelocity(0, 0);

        //makes paddle not go off the screen
        this.x = Phaser.Math.Clamp(this.x, 67, this.scene.game.config.width -80);
    }
}

class Ball extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Ball");

        this.setData('onPaddle', true);
        this.setData('ball_speed', 300);
    }

    hitPaddle(ball, paddle) {
        let diff = 0;

        if (ball.x < paddle.x) {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }

        console.log(diff);
    }

    startGame() {

        this.body.velocity.y = -this.getData("ball_speed");
    }





}






