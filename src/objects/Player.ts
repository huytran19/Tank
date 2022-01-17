import Bullet from './bullet';
import { IImageConstructor } from '../interfaces/image.interface';

export default class Player extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body;

  private currentScene!: Phaser.Scene;
  // variables
  private health!: number;
  private shootTime: number = 0;
  private speed!: number;

  // children
  private barrel!: Phaser.GameObjects.Sprite;
  private lifeBar!: Phaser.GameObjects.Graphics;

  // game objects
  private bullets!: Phaser.GameObjects.Group;

  // input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveForward!: Phaser.Input.Keyboard.Key;
  private moveBack!: Phaser.Input.Keyboard.Key;
  private rotateKeyLeft!: Phaser.Input.Keyboard.Key;
  private rotateKeyRight!: Phaser.Input.Keyboard.Key;
  private shootingKey!: Phaser.Input.Keyboard.Key;

  private leftExhaust!: Phaser.GameObjects.Particles.ParticleEmitter;
  private rightExhaust!: Phaser.GameObjects.Particles.ParticleEmitter;
  private explosion!: Phaser.GameObjects.Particles.ParticleEmitter;

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    this.currentScene = aParams.scene;
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage() {
    // variables
    this.health = 1;
    this.speed = 200;

    // image
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.angle = 0;

    this.barrel = this.scene.add.sprite(
      this.x,
      this.y,
      'turretRed',
      'turret_red_8.png'
    );
    this.barrel.setOrigin(0.5, 0.65);
    this.barrel.setDepth(1);
    this.barrel.angle = 90;

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true,
    });

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.moveForward = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.moveBack = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.rotateKeyLeft = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.rotateKeyRight = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this.shootingKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // physics
    this.scene.physics.world.enable(this);

    //particle
    const direction = new Phaser.Math.Vector2(0, 0);
    direction.setToPolar(this.rotation, 1);

    const dx = -direction.x;
    const dy = -direction.y;

    const ox = dx * this.width * 0.55;
    const oy = dy * this.width * 0.55;
    const exhaust = this.currentScene.add.particles('smoke');
    this.leftExhaust = exhaust.createEmitter({
      accelerationY: 0,
      accelerationX: 0,
      speedY: { min: 100 * dy, max: 300 * dy },
      speedX: { min: -10 * dx, max: 10 * dx },
      quantity: 10,
      lifespan: { min: 100, max: 300 },
      alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
      scale: { start: 0.05, end: 0.04 },
      rotate: { min: -180, max: 180 },
      angle: { random: true, start: 0, end: 180 },
      frequency: 15,
      follow: this,
      followOffset: { y: oy - 25 },
      tint: 0x964b00,
      on: true,
    });
    this.rightExhaust = exhaust.createEmitter({
      accelerationY: 0,
      accelerationX: 0,
      speedY: { min: 100 * dy, max: 300 * dy },
      speedX: { min: -10 * dx, max: 10 * dx },
      quantity: 10,
      lifespan: { min: 100, max: 300 },
      alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
      scale: { start: 0.05, end: 0.04 },
      rotate: { min: -180, max: 180 },
      angle: { random: true, start: 0, end: 180 },
      frequency: 15,
      follow: this,
      followOffset: { y: oy + 25 },
      tint: 0x964b00,
      on: true,
    });

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
      this.handleInput();
      this.handleShooting();
    } else {
      this.destroy();
      this.barrel.destroy();
      this.lifeBar.destroy();
    }
  }

  private handleInput() {
    const direction = new Phaser.Math.Vector2(0, 0);
    direction.setToPolar(this.rotation, 1);
    const dx = direction.x;
    const dy = direction.y;
    // move tank forward
    // small corrections with (- MATH.PI / 2) to align tank correctly
    if (this.moveForward.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation - Math.PI / 2 + 1.5,
        this.speed,
        this.body.velocity
      );
      this.leftExhaust.accelerationX.propertyValue = -1000 * dx;
      this.leftExhaust.accelerationY.propertyValue = -1000 * dy;
      this.rightExhaust.accelerationX.propertyValue = -1000 * dx;
      this.rightExhaust.accelerationY.propertyValue = -1000 * dy;
    } else if (this.moveBack.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation - Math.PI / 2 + 1.5,
        -this.speed,
        this.body.velocity
      );
    } else {
      this.body.setVelocity(0, 0);
      this.leftExhaust.accelerationX.propertyValue = 0;
      this.leftExhaust.accelerationY.propertyValue = 0;
      this.rightExhaust.accelerationX.propertyValue = 0;
      this.rightExhaust.accelerationY.propertyValue = 0;
    }

    // rotate tank
    if (this.cursors.left.isDown) {
      this.barrel.rotation -= 0.05;
    } else if (this.cursors.right.isDown) {
      this.barrel.rotation += 0.05;
    }

    // rotate barrel
    if (this.rotateKeyLeft.isDown) {
      this.rotation -= 0.05;
    } else if (this.rotateKeyRight.isDown) {
      this.rotation += 0.05;
    }
    if (this.leftExhaust) {
      const ox = -dx * this.width * 0.5 + dy * 25;
      const oy = -dy * this.width * 0.5 - dx * 25;
      const ddx = -dx;
      const ddy = -dy;
      this.leftExhaust.setSpeedX(0);
      this.leftExhaust.setSpeedY(0);

      this.leftExhaust.followOffset.x = ox;
      this.leftExhaust.followOffset.y = oy;
    }
    if (this.rightExhaust) {
      const ox = -dx * this.width * 0.5 - dy * 25;
      const oy = -dy * this.width * 0.5 + dx * 25;

      const ddx = -dx;
      const ddy = -dy;

      this.rightExhaust.setSpeedX(0);
      this.rightExhaust.setSpeedY(0);

      this.rightExhaust.followOffset.x = ox;
      this.rightExhaust.followOffset.y = oy;
    }
  }

  private handleShooting(): void {
    this.shootTime++;
    if (this.shootingKey.isDown && this.shootTime >= 30) {
      this.barrel.play('redShoot', true);
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

      if (this.bullets.getLength() < 1000) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletRed',
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
    if (this.health > 0) {
      this.health -= 0.05;
      this.scene.sound.play('hit');
      this.redrawLifebar();
    } else {
      this.health = 0;
      this.active = false;
      this.scene.sound.play('explosion');
      this.leftExhaust.on = false;
      this.rightExhaust.on = false;
      this.explosion.on = true;
      this.explosion.setPosition(this.x, this.y);
      this.currentScene.time.delayedCall(500, () => {
        this.explosion.on = false;
      });
      this.scene.time.delayedCall(1000, () => {
        this.currentScene.scene.start('GameOverScene');
      });
    }
  }
}
