// scenes/MainMenuScene.js

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Load any assets for the main menu here (e.g., buttons, background)
    }

    create() {
        // Title Text
        this.add.text(400, 150, 'Ploobus Quest', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

        // Start Button
        const startButton = this.add.text(400, 300, 'Start New Run', { fontSize: '32px', fill: '#00ff00' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.startNewRun());

        // Optional: Options and Quit buttons can be added similarly
    }

    startNewRun() {
        // Transition to Map Scene
        const newRun = this.registry.get('CurrentRun');
        newRun.registry = this.registry;
        newRun.scene = this.scene;
        newRun.camera = this.camera;
        newRun.game = this.game;
        newRun.ploobusTeam = generatePloobusTeam();
        newRun.gold = 0;
        this.registry.set('CurrentRun', {});
        this.scene.start('MapScene');
    }

    generatePloobusTeam() {
        const ploobusTeam = [];
        for (let i = 0; i < 4; i++) {
            ploobusTeam.push(ploobusDex[i]);
        }
        return ploobusTeam;
    }
}
