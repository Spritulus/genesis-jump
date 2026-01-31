import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Home } from './scenes/Home';
import { MenuBasic } from './scenes/MenuBasic';
import { level1 } from './scenes/level1';

const config = {
        type: AUTO,
        width: 1280,
        height: 720,
        parent: 'game-container',
        backgroundColor: '#000000',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        transparent: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [
            Preloader,
            Home,
            level1,
            MenuBasic
        ]
    };

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;