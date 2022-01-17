export default class GameWinScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: 'GameWinScene',
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
  }

  create(): void {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, 'YOU WIN!', {
        color: 'white',
        fontSize: '100px',
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `HIGHSCORE ${this.registry.values.score}`,
        {
          color: 'white',
          fontSize: '28px',
        }
      )
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 100,
        'PRESS S TO PLAY AGAIN',
        {
          color: 'white',
          fontSize: '28px',
        }
      )
      .setOrigin(0.5, 0.5);
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('MenuScene');
    }
  }
}
