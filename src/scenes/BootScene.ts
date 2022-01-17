import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: 'BootScene',
    });
  }

  preload(): void {
    // set the background, create the loading and progress bar
    this.cameras.main.setBackgroundColor(0x000000);
    this.createLoadingGraphics();

    // pass value to change the loading bar fill
    this.load.on(
      'progress',
      (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x88e453, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    // delete bar graphics, when loading complete
    this.load.on(
      'complete',
      () => {
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );

    // load our package
    this.load.image('tankRed', 'Tank_assets2/body_red.png');
    this.load.atlas(
      'turretRed',
      'Tank_assets2/turret_red.png',
      'Tank_assets2/turret_red.json'
    );
    this.load.image('tankBlue', 'Tank_assets2/body_blue.png');
    this.load.atlas(
      'turretBlue',
      'Tank_assets2/turret_blue.png',
      'Tank_assets2/turret_blue.json'
    );
    this.load.image('bulletBlue', 'Tank_assets/bullet_blue.png');
    this.load.image('bulletRed', 'Tank_assets/bullet_red.png');
    // this.load.image('reticle', 'Tank_assets/reticle.png');
    this.load.image('tileset1', 'Tilesets/tileset1_extruded.png');
    this.load.image('tileset2', 'Tilesets/tileset2_extruded.png');
    this.load.tilemapTiledJSON('map', 'Map/new_map.json');
    this.load.bitmapFont('font', 'Font/font.png', 'Font/font.fnt');
    this.load.atlasXML(
      'redSheet',
      'uipack_fixed/Spritesheet/redSheet.png',
      'uipack_fixed/Spritesheet/redSheet.xml'
    );

    this.load.image('blueCircle', 'uipack_fixed/PNG/blue_boxTick.png');
    this.load.image('blueCross', 'uipack_fixed/PNG/blue_boxCross.png');

    this.load.audio('soundtrack', 'Sound/soundtrack.mp3');
    this.load.audio('shoot', 'Sound/tank_shooting.wav');
    this.load.audio('hit', 'Sound/Hit.wav');
    this.load.audio('explosion', 'Sound/Explosion.wav');

    this.load.image('smoke', 'Particles/blackSmoke24.png');
  }

  create() {
    this.initGlobalDataManager();

    this.anims.create({
      key: 'turretRedIdle',
      frames: [
        {
          key: 'turretRed',
          frame: 'turret_red_8.png',
        },
      ],
    });
    this.anims.create({
      key: 'redShoot',
      frames: this.anims.generateFrameNames('turretRed', {
        start: 2,
        end: 8,
        prefix: 'turret_red_',
        suffix: '.png',
      }),
      frameRate: 30,
    });
    this.anims.create({
      key: 'turretBlueIdle',
      frames: [
        {
          key: 'turretBlue',
          frame: 'turret_blue_8.png',
        },
      ],
    });
    this.anims.create({
      key: 'blueShoot',
      frames: this.anims.generateFrameNames('turretBlue', {
        start: 2,
        end: 8,
        prefix: 'turret_blue_',
        suffix: '.png',
      }),
      frameRate: 30,
    });
  }

  update(): void {
    this.scene.start('MenuScene');
  }

  private createLoadingGraphics(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0xffffff, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }

  private initGlobalDataManager(): void {
    this.registry.set('score', 0);
    this.registry.set('mute', false);
  }
}
