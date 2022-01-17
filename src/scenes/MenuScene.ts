import SettingMenu from './SettingMenu';
export default class MenuScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  private settingMenu!: SettingMenu;

  constructor() {
    super({
      key: 'MenuScene',
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;

    this.initGlobalDataManager();
  }

  create(): void {
    this.settingMenu = new SettingMenu(this);
    this.settingMenu.createNewGameButton(0);
    this.settingMenu.createSoundButton(1, false);
    this.settingMenu.show();

    // create background
    const map = this.make.tilemap({ key: 'map' });
    const mapSize = map.width * 48;
    const tilesets1 = map.addTilesetImage('tileset1', 'tileset1', 48, 48, 1, 2);
    const tilesets2 = map.addTilesetImage('tileset2', 'tileset2', 48, 48, 1, 2);
    const island = map.createLayer('Island', [tilesets1, tilesets2]);
    const grass = map.createLayer('Grass', [tilesets1, tilesets2]);
    const mountain = map.createLayer('Mountain', [tilesets1, tilesets2]);
    island.setDepth(-100);
    grass.setDepth(-100);
    mountain.setDepth(-100);
  }

  update(): void {}

  private initGlobalDataManager(): void {
    this.registry.set('score', 0);
  }
}
