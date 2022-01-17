import Bullet from './bullet';
import { IImageConstructor } from '../interfaces/image.interface';

export default class Enemy extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body;

  // variables
  private health!: number;
  private lastShoot!: number;
  private shootTime: number = 0;
  private speed!: number;
  private currentScene!: Phaser.Scene;

  // children
  private barrel!: Phaser.GameObjects.Sprite;
  private lifeBar!: Phaser.GameObjects.Graphics;

  // game objects
  private bullets!: Phaser.GameObjects.Group;

  private explosion!: Phaser.GameObjects.Particles.ParticleEmitter;

  private _tween!: Phaser.Tweens.Tween;

  public getBarrel(): Phaser.GameObjects.Image {
    return this.barrel;
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  public getTween(): Phaser.Tweens.Tween {
    return this._tween;
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.currentScene = aParams.scene;
    this.initContainer();
    this.scene.add.existing(this);
  }

  private initContainer() {
    // variables
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 100;

    // image
    this.setDepth(0);

    this.barrel = this.scene.add.sprite(
      this.x,
      this.y,
      'turretBlue',
      'turret_blue_8.png'
    );
    this.barrel.setOrigin(0.5, 0.65);
    this.barrel.setDepth(1);
    this.barrel.angle = 180;

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true,
    });

    // tweens
    this._tween = this.scene.tweens.add({
      targets: this,
      props: { y: this.y - 100 },
      delay: 0,
      duration: 2000,
      ease: 'Linear',
      easeParams: null,
      hold: 0,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true,
      paused: true,
    });

    // physics
    this.scene.physics.world.enable(this);

    const exhaust = this.currentScene.add.particles('smoke');
    this.explosion = exhaust.createEmitter({
      x: this.x,
      y: this.y,
      speed: { min: 250, max: 500 },
      quantity: 10,
      lifespan: { min: 200, max: 500 },
      alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
      scale: { start: 0.3, end: 0.01 },
      angle: { random: true, start: 0, end: 360 },
      frequency: 50,
      tint: 0x964b00,
      on: false,
    });
  }

  update(): void {
    if (this.active) {
      this.barrel.x = this.x;
      this.barrel.y = this.y;
      this.lifeBar.x = this.x;
      this.lifeBar.y = this.y;
      this.handleShooting();
    } else {
      this.destroy();
      this.currentScene.registry.values.score += 1000;
      this.currentScene.events.emit('scoreChanged');
      this.barrel.destroy();
      this.lifeBar.destroy();
    }
  }

  private handleShooting(): void {
    this.shootTime++;
    if (this.shootTime >= 200) {
      this.barrel.play('blueShoot', true);
      this.scene.sound.play('shoot');
      // this.scene.cameras.main.shake(20, 0.005);
      this.scene.tweens.add({
        targets: this,
        props: { alpha: 0.8 },
        delay: 0,
        duration: 5,
        ease: 'Power1',
        easeParams: null,
        hold: 0,
        repeat: 0,
        repeatDelay: 0,
        yoyo: true,
        paused: false,
      });

      if (this.bullets.getLength() < 10) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletBlue',
          })
        );

        this.shootTime = 0;
      }
    }
  }

  private redrawLifebar(): void {
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      -this.width / 2,
      this.height / 2,
      this.width * this.health,
      15
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15);
    this.lifeBar.setDepth(1);
  }

  public updateHealth(): void {
    this.health -= 0.1;
    if (this.health > 0) {
      this.scene.sound.play('hit');
      this.redrawLifebar();
    } else {
      this.health = 0;
      this.active = false;
      this.scene.sound.play('explosion');
      this.explosion.on = true;
      this.explosion.setPosition(this.x, this.y);
      this.currentScene.time.delayedCall(500, () => {
        this.explosion.on = false;
      });
    }
  }
}
