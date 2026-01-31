import { Scene } from 'phaser';

export class Home extends Scene {
    constructor () {
        super('Home');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
        this.TEXT_STYLE = {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
        };
        this.gameSpeed = 3;
        this.didCreateAnims = false;
    }

    init () {
        this.characters = [
            {
                key: 'adam',
                name: 'Adam'
            }, 
            {
                key: 'eve',
                name: 'Eve'
            }
        ];
    }

    preload () {
        this.createAnims();
    }

    create () {
        this.createEnvironment();
        
        this.cameras.main.setBackgroundColor(0x4dc9ff);
        this.createMenu();
        this.createLogo();
    }

    createEnvironment() {
        this.bgLayer0 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-forest-background').setOrigin(0, 0);
        this.createClouds();
        this.bgLayer1 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-jungle').setOrigin(0, 0);
        this.bgLayer2 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-tropical-underbrush').setOrigin(0, 0);
        this.bgLayer3 = this.add.tileSprite(0, 0, this.WIDTH, this.HEIGHT, 'part-jungle-path-with-grass').setOrigin(0, 0);
    }

    update (time, delta) { 
        this.bgLayer0.tilePositionX += this.gameSpeed - 3;
        this.bgLayer1.tilePositionX += this.gameSpeed - 2;
        this.bgLayer2.tilePositionX += this.gameSpeed - 1;
        this.bgLayer3.tilePositionX += this.gameSpeed;
    }
    
    createClouds () {
        this.clouds = this.add.group();
        for (let i = 0; i < 3; i++) {
            const x = Phaser.Math.Between(0, this.WIDTH),
                y = Phaser.Math.Between(this.HEIGHT / 3, this.HEIGHT / 2);
            this.clouds.add(this.add.image(x, y, 'cloud' + (Phaser.Math.Between(0, 1) ? '2' : '')));
        }
    }

    createMenu () {
        const options = [
            {
                text: 'Start Game',
                onClick: () => {
                    this.createCharacterSelectionMenu();
                }
            }
        ];

        this.menu?.destroy && this.menu.destroy();
        this.menu = this.add.container(this.WIDTH / 2, this.HEIGHT / 2 - 70);
        this.menu.add(this.getMenuItems(options));
        this.menu.setPosition(this.WIDTH / 2, (this.HEIGHT - this.menu.height) / 2);
    }

    getMenuItems (options) {
        const menuItems = [
                this.add.image(0, -72, 'logo').setOrigin(0.5)
            ],
            scene = this;

        let index = 0;

        for (const option of options) {
            const button = scene.add.text(0, 80 + index * 70, option.text, this.TEXT_STYLE).setOrigin(0.5).setInteractive();
            button.on('pointerdown', option.onClick);
            menuItems.push(button);
            index++;
        }
        
        return menuItems;
    }

    createCharacterSelectionMenu () {
        const buttonGap = 72;
        this.menu?.destroy && this.menu.destroy();

        this.menu = this.add.container(0, 0);
        this.title = this.add.text(0, 0, 'Select Your Character', this.TEXT_STYLE);
        this.title.setPosition((this.WIDTH - this.title.width) / 2, 200);

        let index = 0;
        for (const character of this.characters) {
            const button = this.createCharacterButton(character.key, character.name, () => {
                this.scene.start('level1', character);
            }, index % 2 === 0);
            
            this.menu.add(button);
            button.x = index * (button.width + buttonGap);
            index++;
        }

        this.menu.setSize(this.menu.list.length * this.menu.list[0].width + (this.menu.list.length - 1) * buttonGap, this.menu.list[0].height);
        this.menu.setPosition(this.WIDTH/2 - this.menu.width/2, this.HEIGHT/2 - 50);
    }

    createCharacterButton (characterKey, characterName, onClick, flipped = false) {
        const button = this.add.container(0, 0),
            characterSprite = this.add.sprite(0, 0, 'character-' + characterKey).setScale(1).setOrigin(0),
            characterText = this.add.text(0, characterSprite.height, characterName, {
                ...this.TEXT_STYLE,
                fontSize: 24,
                align: 'center'
            }).setOrigin(1, 1),
            clickableArea = this.add.rectangle(0, 0, characterSprite.width, characterSprite.height + characterText.height, 0x000000, 0).setOrigin(0);

        characterSprite.play(characterKey + '-idle' + (flipped ? '-flipped' : ''), true);
        Phaser.Display.Align.In.Center(characterText, characterSprite, 0, 120);

        clickableArea.setInteractive();
        clickableArea.on('pointerdown', onClick);

        button.add([characterSprite, characterText, clickableArea]);
        button.setSize(characterSprite.width, characterSprite.height + characterText.height);

        return button;
    }

    createLogo () {
        this.spritulusLogoContainer = this.add.container();
        this.spritulusLogo = this.add.image(0, 0, 'spritulus-logo').setScale(0.5);
        this.spritulusText = this.add.text(16, this.HEIGHT - 32, 'Made with Spritulus', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff'
        });
        this.spritulusLogo.setPosition(16 + (this.spritulusText.width * 0.5), this.spritulusText.y - 32);
        this.spritulusLogoContainer.add(this.spritulusLogo);
        this.spritulusLogoContainer.add(this.spritulusText);
        this.spritulusLogo.setInteractive();
        this.spritulusLogo.on('pointerdown', () => {
            window.open('https://spritulus.com', '_blank');
        });
    }
        
    createAnims () {
        if (!this.didCreateAnims) {
        this.anims.create({
            key: 'adam-idle',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'adam-idle-flipped',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 27, end: 34 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'adam-move',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 19, end: 26 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'adam-move-flipped',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 46, end: 53 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'adam-jump',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 17, end: 18 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'adam-jump-flipped',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 44, end: 45 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'adam-fall',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 15, end: 16 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'adam-fall-flipped',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 42, end: 43 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'adam-death',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 8, end: 14 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'adam-death-flipped',
            frames: this.anims.generateFrameNumbers('character-adam', { start: 35, end: 41 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'eve-idle',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'eve-idle-flipped',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 27, end: 34 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'eve-move',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 19, end: 26 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'eve-move-flipped',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 46, end: 53 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'eve-jump',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 17, end: 18 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'eve-jump-flipped',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 44, end: 45 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'eve-fall',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 15, end: 16 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'eve-fall-flipped',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 42, end: 43 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'eve-death',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 8, end: 14 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'eve-death-flipped',
            frames: this.anims.generateFrameNumbers('character-eve', { start: 35, end: 41 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'aloe-vera-idle',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 11, end: 11 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'aloe-vera-idle-flipped',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 23, end: 23 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'aloe-vera-attack-1',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 0, end: 10 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'aloe-vera-attack-1-flipped',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 12, end: 22 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'aloe-vera-take-hit',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 0, end: 10 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'aloe-vera-take-hit-flipped',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 12, end: 22 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'aloe-vera-death',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 0, end: 10 }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'aloe-vera-death-flipped',
            frames: this.anims.generateFrameNumbers('element-aloe-vera', { start: 12, end: 22 }),
            frameRate: 8,
            repeat: 0
        });
            this.didCreateAnims = true;
        }
    }
}