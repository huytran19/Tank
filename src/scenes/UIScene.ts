import SettingMenu from './SettingMenu';

export default class UIScene extends Phaser.Scene {
  private settingMenu!: SettingMenu;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private pauseTime!: number;
  private isMuteProps!: boolean;
  private textElements!: Map<string, Phaser.GameObjects.Text>;
  private gameScene!: Phaser.Scene;
  closeButton!: Phaser.GameObjects.Image;
  constructor() {
    super('ui');
  }

  init(data) {
    this.isMuteProps = data.isMute;
  }

  create() {
    this.scene.run('GameScene');
    this.pauseTime = 0;
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.pauseKey.isDown = false;

    this.settingMenu = new SettingMenu(this);
    this.settingMenu.createResumeButton(0);
    this.settingMenu.createNewGameButton(1);
    this.settingMenu.createSoundButton(2, this.isMuteProps);
    this.closeButton = this.add.image(0, 0, 'blueCircle');
    this.closeButton.setScale(1.2);
    this.closeButton.setOrigin(0, 0);
    this.closeButton.setDepth(3);
    Phaser.Display.Align.In.TopRight(
      this.closeButton,
      this.add.zone(
        this.scale.width / 2 - 10,
        this.scale.height / 2 + 4,
        1200,
        800
      )
    );

    this.closeButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        this.closeButton.setTint(0xe0e0e0);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.closeButton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.closeButton.setTint(0xffffff);

        if (this.settingMenu.isOpen) {
          this.settingMenu.hide();
        } else {
          this.settingMenu.show();
        }
      });

    this.textElements = new Map([
      [
        'SCORE',
        this.add.text(10, 10, `Score ${this.registry.get('score')}`, {
          color: 'white',
          fontSize: '28px',
        }),
      ],
    ]);
    // create events
    this.gameScene = this.scene.get('GameScene');
    // level.events.on('coinsChanged', this.updateCoins, this);
    this.gameScene.events.on('scoreChanged', this.updateScore, this);
  }
  update() {
    this.pauseTime++;
    if (this.pauseKey.isDown && this.pauseTime >= 20) {
      this.pauseTime = 0;
      if (this.settingMenu.isOpen) {
        this.settingMenu.hide();
      } else {
        this.settingMenu.show();
      }
    }

    if (!this.settingMenu.isOpen) {
      this.closeButton.setTexture('blueCircle');
    } else {
      this.closeButton.setTexture('blueCross');
    }
  }

  private updateScore() {
    this.textElements
      .get('SCORE')!
      .setText(`Score ${this.registry.get('score')}`);
  }
}
