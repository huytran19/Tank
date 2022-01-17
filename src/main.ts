import Phaser from 'phaser';

import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import UIScene from './scenes/UIScene';
import GameOverScene from './scenes/GameOverScene';
import GameWinScene from './scenes/GameWinScene';
const config: Phaser.Types.Core.GameConfig = {
  title: 'Tank',
  type: Phaser.AUTO,
  version: '1.0',
  width: 1200,
  height: 800,
  input: { keyboard: true, mouse: true },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    zoom: 1,
  },
  scene: [
    BootScene,
    MenuScene,
    GameScene,
    UIScene,
    GameOverScene,
    GameWinScene,
  ],
  audio: {
    disableWebAudio: true,
  },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(config);
});
