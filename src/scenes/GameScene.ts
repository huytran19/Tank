import Player from '~/objects/Player';
import Bullet from '~/objects/bullet';
import Enemy from '~/objects/Enemy';

export default class GameScene extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private tilesets1!: Phaser.Tilemaps.Tileset;
  private tilesets2!: Phaser.Tilemaps.Tileset;
  private island!: Phaser.Tilemaps.TilemapLayer;
  private grass!: Phaser.Tilemaps.TilemapLayer;
  private mountain!: Phaser.Tilemaps.TilemapLayer;
  private player!: Player;
  private startKey!: Phaser.Input.Keyboard.Key;
  private enemies!: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  init(): void {}

  create(): void {
    this.sound.play('soundtrack', { loop: true });
    this.map = this.make.tilemap({ key: 'map' });
    const mapSize = this.map.width * 48;
    this.tilesets1 = this.map.addTilesetImage(
      'tileset1',
      'tileset1',
      48,
      48,
      1,
      2
    );
    this.tilesets2 = this.map.addTilesetImage(
      'tileset2',
      'tileset2',
      48,
      48,
      1,
      2
    );
    this.island = this.map.createLayer('Island', [
      this.tilesets1,
      this.tilesets2,
    ]);
    this.island.setCollisionByProperty({ collides: true });
    this.grass = this.map.createLayer('Grass', [
      this.tilesets1,
      this.tilesets2,
    ]);
    this.mountain = this.map.createLayer('Mountain', [
      this.tilesets1,
      this.tilesets2,
    ]);
    this.mountain.setCollisionByProperty({ collides: true });
    this.enemies = this.add.group({ runChildUpdate: true });
    this.createObject();
    this.add.existing(this.player);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, mapSize, mapSize);

    this.physics.add.collider(this.player, this.island);
    this.physics.add.collider(this.player, this.mountain);
    this.physics.add.collider(
      this.player.getBullets(),
      this.island,
      this.bulletHitLayer,
      undefined,
      this
    );
    this.physics.add.collider(
      this.player.getBullets(),
      this.mountain,
      this.bulletHitLayer,
      undefined,
      this
    );
    this.physics.add.collider(this.enemies, this.island);
    this.physics.add.collider(this.enemies, this.mountain);
    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      this.physics.add.collider(
        enemy.getBullets(),
        this.island,
        this.bulletHitLayer,
        undefined,
        this
      );
    });
    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      this.physics.add.collider(
        enemy.getBullets(),
        this.mountain,
        this.bulletHitLayer,
        undefined,
        this
      );
    });

    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      this.physics.add.overlap(
        enemy.getBullets(),
        this.player,
        this.enemyBulletHitPlayer,
        undefined,
        this
      );
    });
    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      this.physics.add.overlap(
        this.player.getBullets(),
        enemy,
        this.playerBulletHitEnemy,
        undefined,
        this
      );
    });

    this.player.setDepth(0);
  }

  update(): void {
    if (this.enemies.children.size === 0) {
      this.time.delayedCall(1000, () => {
        this.scene.start('GameWinScene');
      });
    }
    this.player.update();
    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      enemy.update();
      if (this.player.active && enemy.active) {
        var angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.player.body.x,
          this.player.body.y
        );
        enemy.getBarrel().angle =
          (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }, this);
  }

  createObject(): void {
    const objects = this.map.getObjectLayer('Objects').objects as any[];

    objects.forEach((object) => {
      if (object.type === 'Player') {
        this.player = new Player({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankRed',
        });
      } else if (object.type === 'Enemy') {
        const enemy = new Enemy({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankBlue',
        });
        const tweenEnemy = enemy.getTween();
        tweenEnemy.play();
        this.enemies.add(enemy);
      }
    });
  }
  private bulletHitLayer(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const bullet = obj1 as Bullet;
    bullet.destroy();
  }

  enemyBulletHitPlayer(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const bullet = obj1 as Bullet;
    const player = obj2 as Player;
    bullet.destroy();
    player.updateHealth();
  }

  private playerBulletHitEnemy(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const bullet = obj1 as Bullet;
    const enemy = obj2 as Enemy;
    bullet.destroy();
    enemy.updateHealth();
  }
}
