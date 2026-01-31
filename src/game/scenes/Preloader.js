import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor () {
        super('Preloader');
        this.WIDTH = 1280;
        this.HEIGHT = 720;
    }

    init () {
        this.cameras.main.setBackgroundColor(0x4dc9ff);
        const margin = 50,
            progressdBarHeight = 16;

        this.add.rectangle(margin, (this.HEIGHT - progressdBarHeight)/2, this.WIDTH - (margin * 2), progressdBarHeight)
            .setStrokeStyle(1, 0xffffff)
            .setOrigin(0, 0);
        const bar = this.add.rectangle(margin + 2, (this.HEIGHT - progressdBarHeight)/2 + 2, 50, progressdBarHeight - 4, 0xffffff)
            .setOrigin(0, 0);
        this.load.on('progress', (progress) => {
            bar.width = 4 + ((this.WIDTH - (margin * 2) - 8) * progress);
        });
    }

    preload () {
        this.load.setPath('assets');
        
        // Spritulus Logo
        this.load.svg('spritulus-logo', 'spritulus-logo.svg');

        // Pause-Play Icons
        this.load.svg('pause-icon', 'pause-icon.svg');
        this.load.svg('play-icon', 'play-icon.svg');
        
        // Game Logo
        this.load.svg('logo', 'logo.svg', {
            height: 500,
            width: 500
        });
        
        // Scene Effect - Clouds
        this.load.svg('cloud', 'cloud.svg');
        this.load.svg('cloud2', 'cloud2.svg');

        // Characters
        this.load.spritesheet(
            'character-adam',
            'character-adam.png',
            { frameWidth: 200, frameHeight: 200 }
        );

        this.load.spritesheet(
            'character-eve',
            'character-eve.png',
            { frameWidth: 200, frameHeight: 200 }
        );

        // Elements
        this.load.spritesheet(
            'element-aloe-vera',
            'element-aloe-vera.png',
            { frameWidth: 200, frameHeight: 200 }
        );

        // Environments
        const jungleScale = Math.round((this.HEIGHT / 2400) * 1000) / 1000;
        this.load.svg(
            'part-jungle-forest-background',
            'part-jungle-forest-background.svg',
            { width: 6400 * jungleScale, height: 2400 * jungleScale }
        );

        this.load.svg(
            'part-jungle-jungle',
            'part-jungle-jungle.svg',
            { width: 6400 * jungleScale, height: 2400 * jungleScale }
        );

        this.load.svg(
            'part-jungle-tropical-underbrush',
            'part-jungle-tropical-underbrush.svg',
            { width: 6400 * jungleScale, height: 2400 * jungleScale }
        );

        this.load.svg(
            'part-jungle-path-with-grass',
            'part-jungle-path-with-grass.svg',
            { width: 6400 * jungleScale, height: 2400 * jungleScale }
        );

    }

    create () {
        this.scene.start('Home');
    }
}