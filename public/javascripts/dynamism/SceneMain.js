class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain"});
    }

    preload() {
        this.load.image("background", "assets/dynamism/background.png");
        this.load.image("paddle", "assets/dynamism/paddle.png");
        this.load.spritesheet("ball", "assets/dynamism/ball_sprite.png", {
            frameWidth: 70, frameHeight: 60
        });

    }

    create() {
        //create background
        this.add.image(game.config.width / 2, game.config.width / 2, 'background');

        //create paddle
        this.paddle = new Paddle(
            this,
            400,
            550,
            'paddle'
        );

        //paddle input events
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //create ball
        /*
        this.ball = new Ball(
            this,
            400,
            505,
            'ball'
        );
        */

        this.ball = this.physics.add.image(400, 500, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);

        //add colliders
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    }

    update () {
        this.paddle.update();

        this.ball.hitPaddle(this.ball, this.paddle);



        if (this.keyA.isDown) {
            this.paddle.moveLeft();
        } else if (this.keyD.isDown) {
            this.paddle.moveRight();
        }

        if (this.keySpace.isDown) {
          //  this.ball.startGame();
        }


    }




}

