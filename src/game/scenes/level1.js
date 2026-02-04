import { Scene } from 'phaser';

export class level1 extends Scene {
    constructor () {
        super('level1');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
        this.TEXT_STYLE = {
            fontFamily: 'Arial Black, Sans-Serif',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
        };
        this.GROUND_LEVEL = (this.HEIGHT / 16) * 15;
        this.OBSTACLE_TIME = 750;
    }

    init (data) {
        this.playerKey = data?.key;
        this.playerName = data?.name;
    }

    preload () {
        this.initVariables();
    }

    initVariables () {
        
        this.gameStatus = 'Ready';
        this.gameSpeed = 8;
        this.respawnTime = 0;
        this.score = 0;
    }

    create () {
        this.createEnvironment();
        this.cameras.main.setBackgroundColor(0x4dc9ff);
        
        // Init Menu
        this.scene.launch('MenuBasic');
        this.menu = this.scene.get('MenuBasic');
        this.menu.initWithParentScene(this);
        
        // Set up cursors
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.obstacles = this.physics.add.group();
        this.createPlayer();

        // Set up scoring
        this.menu.createScore(this.sys.settings.key);
        setInterval(() => {
            if (!this.isGameRunning) return;
            this.score++;
            this.gameSpeed += 0.01;
            this.menu.updateScore(this.score);
        }, 100);

        this.startGame();
        this.showInstructions();
    }

    

    startGame () {
        this.isGameRunning = true;
        this.anims.resumeAll();
        this.physics.resume();
        this.menu.createPauseButton();
    }

    showInstructions () {
        this.instructions = this.add.text(this.WIDTH / 2, this.HEIGHT / 16 * 15, this.sys.game.device.os.desktop ? 'Use the spacebar to jump and avoid obstacles.' : 'Tap the screen to jump and avoid obstacles.', {
            ...this.TEXT_STYLE,
            fontSize: 18,
            strokeThickness: 4,
        }).setOrigin(0.5).setInteractive().setAlpha(0);
        this.tweens.add({
            targets: this.instructions,
            duration: 500,
            ease: 'Power2',
            alpha: 1,
            onComplete: () => {
                setTimeout(() => {
                    this.tweens.add({
                        targets: this.instructions,
                        duration: 500,
                        ease: 'Power2',
                        alpha: 0,
                        onComplete: () => {
                            this.instructions.destroy();
                        }
                    });
                }, 4000);
            }
        });
    }

    update (time, delta) { 
        if (this.isGameRunning) {
            const jump = this.cursors.up.isDown || this.spaceBar.isDown || this.input.activePointer.isDown;

            // Background Movement
            
            this.bgLayer0.tilePositionX += this.gameSpeed - 3;
            this.bgLayer1.tilePositionX += this.gameSpeed - 2;
            this.bgLayer2.tilePositionX += this.gameSpeed - 1;
            this.bgLayer3.tilePositionX += this.gameSpeed;

            

            // Obstacles
            this.respawnTime += this.gameSpeed;
            if (this.respawnTime >= Phaser.Math.Between(this.OBSTACLE_TIME, this.OBSTACLE_TIME + 150)) {
                this.respawnTime = 0;
                this.placeObstacle();
            }
            this.obstacles.getChildren().forEach(obstacle => {
                obstacle.x -= this.gameSpeed;
                if (obstacle.getBounds().right < 0) {
                    obstacle.destroy();
                }
            });
            
            // Player Jump
            if (this.player.body.onFloor()) {
                if (jump) {
                    this.player.anims.stop();
                    this.player.setVelocityY(-1800);
                    this.player.play(this.playerKey + '-jump-flipped', true);
                } else {
                    this.player.play(this.playerKey + '-move-flipped', true);
                }
            }

        }
    }
    
    stopGame (status) {
        this.isGameRunning = false;
        
        this.initVariables();
        this.menu.updateHighScore();
        this.tweens.add({
            targets: this.player,
            duration: 100,
            y: this.GROUND_LEVEL,
            ease: 'Power2',
            onComplete: () => {
                this.player.setPosition(this.player.x, this.GROUND_LEVEL);
            }
        });
        this.physics.pause();
        this.menu.stopGame(status);
        this.player.play(this.playerKey + '-death' + (this.playerIsFlipped ? '-flipped' : ''), true);
        
        if (window.navigator.vibrate) window.navigator.vibrate(50);
    }

    restartGame () {
        
        this.initVariables();
        this.player.setPosition(this.player.x, this.HEIGHT / 2);
        this.player.setVelocityY(0);
        this.obstacles.clear(true, true);
        this.player.play(this.playerKey + '-idle' + (this.playerIsFlipped ? '-flipped' : ''), true);

        this.physics.resume();
        this.anims.resumeAll();
        this.startGame();
    }

    pauseGame () {
        this.isGameRunning = false;
        
        this.physics.pause();
        this.anims.pauseAll();
    }

    unpauseGame () {
        this.isGameRunning = true;

        this.physics.resume();
        this.anims.resumeAll();
    }

    createEnvironment() {
        this.belowGround = this.add.rectangle(0, this.GROUND_LEVEL, this.WIDTH, this.HEIGHT / 16, '0x000000').setOrigin(0, 0).setAlpha(0);
        this.physics.add.existing(this.belowGround);
        this.belowGround.body.setImmovable();
        this.bgLayer0 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-forest-background').setOrigin(0, 0);
        this.bgLayer1 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-jungle').setOrigin(0, 0);
        this.bgLayer2 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-tropical-underbrush').setOrigin(0, 0);
        this.bgLayer3 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-path-with-grass').setOrigin(0, 0);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(0, this.GROUND_LEVEL - 27 - 154, 'sprite-' + this.playerKey).setGravityY(5000).setOrigin(0, 1);
        this.player.setSize(69, 154, true).setOffset(65, 27);
        this.playerIsFlipped = true;
        this.player.play(this.playerKey + '-idle' + (this.playerIsFlipped ? '-flipped' : ''), true);
        
        this.physics.add.collider(this.player, this.belowGround);
        this.physics.add.overlap(this.player, this.obstacles, () => {
            this.stopGame('Game Over');
        });
    }

    

    placeObstacle () {
        let obstacle;
        const obstacleNum = Phaser.Math.Between(0, 0);
        
        if (obstacleNum === 0) {
            obstacle = this.obstacles.create(this.WIDTH, this.GROUND_LEVEL - 154, 'element-aloe-vera');
            obstacle.setSize(105, 86, true).setOffset(50, 68);
            obstacle.play('aloe-vera-idle', true);
        }

        obstacle.setOrigin(0,0).setImmovable();
    }

    // Mobile Controls Handlers
    updateMobileCursor (key, isDown) {
        if (key) {
            this.cursors[key].isDown = isDown;
        } else {
            this.cursors.left.isDown = false;
            this.cursors.right.isDown = false;
            this.cursors.up.isDown = false;
            this.cursors.down.isDown = false;
        }
    }

    handleMobileActionButton (isDown) {
        if (isDown) {
            this.spaceBar.emit('down');
        } else {
            this.spaceBar.emit('up');
        }
    }

    handleMobileActionButtonSecondary (isDown) {
        if (isDown) {
            this.spaceBar.emit('down');
        } else {
            this.spaceBar.emit('up');
        }
    }
}