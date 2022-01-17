import { GameObjects } from 'phaser';

export default class SettingMenu {
  soundSetting!: Phaser.GameObjects.Container;
  newGameSetting!: Phaser.GameObjects.Container;
  resumeSetting!: Phaser.GameObjects.Container;
  container!: Phaser.GameObjects.Container;
  checkmark!: Phaser.GameObjects.Image;
  boxNewGame!: Phaser.GameObjects.Image;
  boxResume!: Phaser.GameObjects.Image;
  currentScene!: Phaser.Scene;
  private isMute: boolean = false;
  private _opened = false;

  get isOpen() {
    return this._opened;
  }
  constructor(scene: Phaser.Scene) {
    this.currentScene = scene;
    const { width, height } = this.currentScene.scale;

    this.container = this.currentScene.add.container(width / 2, height + 300);
  }

  private toggleSound() {
    this.isMute = !this.checkmark.visible;

    this.isMute = !this.isMute;

    this.currentScene.sound.mute = this.isMute;

    this.checkmark.visible = !this.isMute;

    this.currentScene.registry.values.mute = !this.isMute;
  }

  public createNewGameButton(order: number) {
    this.newGameSetting = this.currentScene.add.container(0, 60 * order);
    this.boxNewGame = this.currentScene.add.image(
      0,
      0,
      'redSheet',
      'red_button10.png'
    );
    this.boxNewGame.setScale(1.2);

    const textNewGame = this.currentScene.add.text(0, -15, 'New Game', {
      color: 'black',
      fontSize: '28px',
    });
    textNewGame.setOrigin(0.5, 0);

    this.newGameSetting.add(this.boxNewGame);
    this.newGameSetting.add(textNewGame);

    this.boxNewGame
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.boxNewGame.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.boxNewGame.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.boxNewGame.setTint(0xffffff);
        this.toggleNewGame();
      });
    this.container.add(this.newGameSetting);
  }

  public createResumeButton(order: number) {
    this.resumeSetting = this.currentScene.add.container(0, 60 * order);
    this.boxResume = this.currentScene.add.image(
      0,
      0,
      'redSheet',
      'red_button10.png'
    );
    this.boxResume.setScale(1.2);

    const textResume = this.currentScene.add.text(0, -15, 'Resume', {
      color: 'black',
      fontSize: '28px',
    });
    textResume.setOrigin(0.5, 0);

    this.resumeSetting.add(this.boxResume);
    this.resumeSetting.add(textResume);

    this.boxResume
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.boxResume.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.boxResume.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.boxResume.setTint(0xffffff);
        this.toggleResume();
      });
    this.container.add(this.resumeSetting);
  }

  public createSoundButton(order: number, isMute: boolean) {
    this.soundSetting = this.currentScene.add.container(0, 60 * order);
    const boxSound = this.currentScene.add.image(
      0,
      0,
      'redSheet',
      'red_button10.png'
    );
    boxSound.setScale(1.2);

    const muteSoundButton = this.currentScene.add.image(
      -85,
      -2,
      'redSheet',
      'red_button07.png'
    );
    muteSoundButton.setScale(0.8);

    this.checkmark = this.currentScene.add.image(
      -85,
      -2,
      'redSheet',
      'red_boxTick.png'
    );
    this.checkmark.setScale(0.7);
    this.checkmark.visible = !isMute;

    const textSound = this.currentScene.add.text(-50, -15, 'Sound', {
      color: 'black',
      fontSize: '28px',
    });

    this.soundSetting.add(boxSound);
    this.soundSetting.add(muteSoundButton);
    this.soundSetting.add(this.checkmark);
    this.soundSetting.add(textSound);

    muteSoundButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        muteSoundButton.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        muteSoundButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        muteSoundButton.setTint(0xffffff);
        this.toggleSound();
      });

    this.container.add(this.soundSetting);
  }

  private toggleNewGame() {
    this.currentScene.scene.stop('GameScene');
    this.currentScene.scene.start('ui', { isMute: this.isMute });
  }

  private toggleResume() {
    this.hide();
  }

  show() {
    if (this._opened) {
      return;
    }

    this.currentScene.scene.pause('GameScene');
    const { height } = this.currentScene.scale;
    this.currentScene.tweens.add({
      targets: this.container,
      y: height / 2 - 100,
      duration: 300,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this._opened = true;
  }

  hide() {
    if (!this._opened) {
      return;
    }
    this.currentScene.scene.resume('GameScene');
    const { height } = this.currentScene.scale;

    this.currentScene.tweens.add({
      targets: this.container,
      y: height + 300,
      duration: 300,
      ease: Phaser.Math.Easing.Sine.InOut,
    });

    this._opened = false;
  }
}
