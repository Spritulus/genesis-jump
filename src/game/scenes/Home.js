import { Scene } from 'phaser';

export class Home extends Scene {
    constructor () {
        super('Home');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
        this.TEXT_STYLE = {
            fontFamily: 'Arial Black, Sans-Serif',
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
        this.menu = this.add.container(this.WIDTH / 2, this.HEIGHT / 2 - 100);
        this.menu.add(this.getMenuItems(options));
        this.menu.setPosition(this.WIDTH / 2, (this.HEIGHT - this.menu.height) / 2);
    }

    getMenuItems (options) {
        const menuItems = [
                this.add.image(0, -88, 'logo').setOrigin(0.5)
            ],
            scene = this;

        let index = 0;

        for (const option of options) {
            const button = scene.add.text(0, 100 + index * 70, option.text, this.TEXT_STYLE).setOrigin(0.5).setInteractive();
            button.on('pointerdown', option.onClick);

            if (index === 0 && options.length === 1) {
                scene.tweens.add({
                    targets: button,
                    scale: 1.08,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }

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
        this.spritulusText = this.add.text(16, this.HEIGHT - 40, 'Made with Spritulus', {
            fontFamily: 'Arial, Sans-Serif',
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
                frames: this.anims.generateFrameNumbers('character-adam', { start: 21, end: 28 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'adam-move',
                frames: this.anims.generateFrameNumbers('character-adam', { start: 17, end: 20 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'adam-move-flipped',
                frames: this.anims.generateFrameNumbers('character-adam', { start: 38, end: 41 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'adam-fall',
                frames: this.anims.generateFrameNumbers('character-adam', { start: 15, end: 16 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'adam-fall-flipped',
                frames: this.anims.generateFrameNumbers('character-adam', { start: 36, end: 37 }),
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
                frames: this.anims.generateFrameNumbers('character-adam', { start: 29, end: 35 }),
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
                frames: this.anims.generateFrameNumbers('character-eve', { start: 21, end: 28 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'eve-move',
                frames: this.anims.generateFrameNumbers('character-eve', { start: 17, end: 20 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'eve-move-flipped',
                frames: this.anims.generateFrameNumbers('character-eve', { start: 38, end: 41 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'eve-fall',
                frames: this.anims.generateFrameNumbers('character-eve', { start: 15, end: 16 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'eve-fall-flipped',
                frames: this.anims.generateFrameNumbers('character-eve', { start: 36, end: 37 }),
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
                frames: this.anims.generateFrameNumbers('character-eve', { start: 29, end: 35 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'basic-bush-idle',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 22, end: 22 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'basic-bush-idle-flipped',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 52, end: 52 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'basic-bush-attack-1',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 23, end: 29 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'basic-bush-attack-1-flipped',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 53, end: 59 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'basic-bush-take-hit',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 11, end: 21 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'basic-bush-take-hit-flipped',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 41, end: 51 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'basic-bush-death',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 0, end: 10 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'basic-bush-death-flipped',
                frames: this.anims.generateFrameNumbers('element-basic-bush', { start: 30, end: 40 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-idle',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 0, end: 10 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'grassy-clump-idle-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 34, end: 44 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'grassy-clump-attack-1',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 11, end: 21 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-attack-1-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 45, end: 55 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-take-hit',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 22, end: 32 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-take-hit-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 56, end: 66 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-death',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 33, end: 33 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-death-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump', { start: 67, end: 67 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-2-idle',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 0, end: 10 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'grassy-clump-2-idle-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 30, end: 40 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'grassy-clump-2-attack-1',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 23, end: 29 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-2-attack-1-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 53, end: 59 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-2-take-hit',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 11, end: 21 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-2-take-hit-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 41, end: 51 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-2-death',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 22, end: 22 }),
                frameRate: 8,
                repeat: 0
            });
            this.anims.create({
                key: 'grassy-clump-2-death-flipped',
                frames: this.anims.generateFrameNumbers('element-grassy-clump-2', { start: 52, end: 52 }),
                frameRate: 8,
                repeat: 0
            });
            this.didCreateAnims = true;
        }
    }
}