class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMainMenu"});
    }

    preload() {
        this.load.image("sprBg0", "assets/spaceshooter/sprBg0.png");
        this.load.image("sprBg1", "assets/spaceshooter/sprBg1.png");
        this.load.image("sprBtnPlay", "assets/spaceshooter/sprBtnPlay.png");
        this.load.image("sprBtnPlayHover", "assets/spaceshooter/sprBtnPlayHover.png");
        this.load.image("sprBtnPlayDown", "assets/spaceshooter/sprBtnPlayDown.png");
        this.load.image("sprBtnRestart", "assets/spaceshooter/sprBtnRestart.png");
        this.load.image("sprBtnRestartHover", "assets/spaceshooter/sprBtnRestartHover.png");
        this.load.image("sprBtnRestartDown", "assets/spaceshooter/sprBtnRestartDown.png");

        this.load.audio("sndBtnOver", "assets/spaceshooter/sndBtnOver.wav");
        this.load.audio("sndBtnDown", "assets/spaceshooter/sndBtnDown.wav");
    }

    create() {
        this.sfx = {
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };

        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnPlay"
        );

        this.btnPlay.setInteractive();

       this.btnPlay.on("pointerover", function () {
           this.btnPlay.setTexture("sprBtnPlayHover");
           this.sfx.btnOver.play();
       }, this);


        this.btnPlay.on("pointerout", function() {
            this.setTexture("sprBtnPlay");
        });

        this.btnPlay.on("pointerdown", function() {
            this.btnPlay.setTexture("sprBtnPlayDown");
            this.sfx.btnDown.play();
        }, this);

        this.btnPlay.on("pointerup", function() {
            this.btnPlay.setTexture("sprBtnPlay");
            this.scene.start("SceneMain");
        }, this);

        //Game Title
        this.title = this.add.text(this.game.config.width * 0.5, 128, "SPACE INVASION", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#fff',
            align: 'center'
        });

        this.title.setOrigin(0.5);

        this.backgrounds = [];
        for (let i = 0; i < 5; i++) {
            let keys = ["sprBg0", "sprBg1"];
            let key = keys[Phaser.Math.Between(0, keys.length - 1)];
            let bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }

        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }



    }


}
