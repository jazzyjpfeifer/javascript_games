class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMainMenu"});
    }

    preload() {
        this.load.image("background", "assets/dynamism/background.png");
        this.load.image("play_btn", "assets/dynamism/btn_play.png");
        this.load.image("play_btn_hvr", "assets/dynamism/btn_play_hover.png")
    }
    create () {
        this.add.image(game.config.width / 2, game.config.width / 2, 'background');

        //Game Title
        this.title = this.add.text(this.game.config.width * 0.5, 128, "Dynamism", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#fff',
            align: 'center'
        });

        this.title.setOrigin(0.5);

        //Buttons
        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.4,
            "play_btn"
        );

        this.btnPlay.setInteractive();

        this.btnPlay.on("pointerover", function() {
            this.btnPlay.setTexture("play_btn_hvr");
        }, this);

        this.btnPlay.on("pointerout", function () {
            this.setTexture("play_btn")
        });

        this.btnPlay.on("pointerup", function () {
            this.scene.start("SceneMain");
        }, this);

    }

}
