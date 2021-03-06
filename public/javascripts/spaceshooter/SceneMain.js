class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain"});
    }
    preload() {
        this.load.image("sprBg0", "assets/spaceshooter/sprBg0.png");
        this.load.image("sprBg1", "assets/spaceshooter/sprBg1.png");
        this.load.spritesheet("sprExplosion", "assets/spaceshooter/sprExplosion.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("sprEnemy0", "assets/spaceshooter/sprEnemy0.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprEnemy1", "assets/spaceshooter/sprEnemy1.png");
        this.load.spritesheet("sprEnemy2", "assets/spaceshooter/sprEnemy2.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprLaserEnemy0", "assets/spaceshooter/sprLaserEnemy0.png");
        this.load.image("sprLaserPlayer", "assets/spaceshooter/sprLaserPlayer.png");
        this.load.spritesheet("sprPlayer", "assets/spaceshooter/sprPlayer.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.audio("sndExplode0", "assets/spaceshooter/sndExplode0.wav");
        this.load.audio("sndExplode1", "assets/spaceshooter/sndExplode1.wav");
        this.load.audio("sndLaser", "assets/spaceshooter/sndLaser.wav");
    }

    create() {
        this.anims.create({
            key: "sprEnemy0",
            frames: this.anims.generateFrameNumbers("sprEnemy0"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "sprEnemy2",
            frames: this.anims.generateFrameNumbers("sprEnemy2"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "sprExplosion",
            frames: this.anims.generateFrameNumbers("sprExplosion"),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: "sprPlayer",
            frames: this.anims.generateFrameNumbers("sprPlayer"),
            frameRate: 20,
            repeat: -1
        });

        this.sfx = {
            explosions: [
                this.sound.add("sndExplode0"),
                this.sound.add("sndExplode1")
            ],
            laser: this.sound.add("sndLaser")
        };

        //initiating scrolling background
        this.backgrounds = [];
        for (let i = 0; i < 5; i++) { // create five scrolling backgrounds
            let bg = new ScrollingBackground(this, "sprBg0", i * 10);
            this.backgrounds.push(bg);
        }

        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprPlayer"
        );

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Enemy Group
        this.enemies = this.add.group();
        this.enemyLasers = this.add.group();
        this.playerLasers = this.add.group();

        //Spawn Timer
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                let enemy = null;

                if (Phaser.Math.Between(0, 10) >= 3) {
                    enemy = new GunShip(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                }
                else if (Phaser.Math.Between(0, 10) >= 5) {
                    if (this.getEnemiesByType("ChaserShip").length < 5) {
                        enemy = new ChaserShip(
                            this,
                            Phaser.Math.Between(0, this.game.config.width),
                            0
                        );
                    }
                } else {
                    enemy = new CarrierShip(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                }

                if (enemy !== null) {
                    enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
                    this.enemies.add(enemy);
                }

            },
            callbackScope: this,
            loop: true
        });

        //Enemy Collider
        this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
            if (enemy) {
               if (enemy.onDestroy !== undefined) {
                   enemy.onDestroy();
               }

               enemy.explode(true);

               playerLaser.destroy();
            }
        });

        //Player & Enemy Collider
        this.physics.add.overlap(this.player, this.enemies, function (player, enemy) {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead")) {
                player.explode(false);
                enemy.explode(true);
            }
        });

        //Player & Laser Collider
        this.physics.add.overlap(this.player, this.enemyLasers, function (player, laser) {
            if (!player.getData("isDead") &&
                !laser.getData("isDead")) {
                player.explode(false);
                laser.destroy();
            }
        });
    }

    update() {

        //update background
        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].update();
        }

        //update player
        if(!this.player.getData("IsDead")) {
            this.player.update();

            if (this.keyW.isDown) {
                this.player.moveUp();
            }
            else if (this.keyS.isDown) {
                this.player.moveDown()
            }
            else if (this.keyA.isDown) {
                this.player.moveLeft()
            }
            else if (this.keyD.isDown) {
                this.player.moveRight()
            }

            //fire laser
            if (this.keySpace.isDown) {
                this.player.setData("isShooting", true);
            } else {
                this.player.setData("timerShootTrick", this.player.getData("timerShootDelay") - 1);
                this.player.setData("isShooting", false);
            }
        }

        //update enemies
        for (let i = 0; i < this.enemies.getChildren().length; i++) {
            let enemy = this.enemies.getChildren()[i];

            enemy.update();
            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight) {

                if (enemy) {
                    if (enemy.onDestroy !== undefined) {
                        enemy.onDestroy();
                    }
                    enemy.destroy();
                }
            }
        }

        //frustum culling enemy lasers
        for (let i = 0; i < this.enemyLasers.getChildren().length; i++) {
            let laser = this.enemyLasers.getChildren()[i];
            laser.update();

            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        }

        //frustum culling player lasers
        for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
            var laser = this.playerLasers.getChildren()[i];
            laser.update();
            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        }
    };

    getEnemiesByType(type) {
        let arr = [];
        for (let i = 0; i < this.enemies.getChildren().lenght; i++) {
            let enemy = this.enemies.getChildren()[i];
            if (enemy.getData("type") === type) {
                arr.push(enemy);
            }
        }
        return arr;

    }



}
