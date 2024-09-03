// scenes/BattleScene.js

export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    init(data) {
        this.nodeId = data.nodeId; // Optional: Use nodeId to determine battle specifics
    }

    preload() {
        // Load battle assets (e.g., Ploobus sprites, UI elements)
    }

    create() {
        // Background
        this.cameras.main.setBackgroundColor('#000000');

        // Display Battle Info
        this.add.text(400, 50, 'Battle!', { fontSize: '40px', fill: '#ffffff' }).setOrigin(0.5);

        // Player's Ploobus
        this.playerPloobus = {
            name: 'Player Ploobus',
            type: 'Goo',
            hp: 100,
            attack: 20,
            moves: [
                { name: 'Goo Slap', type: 'Goo', power: 15 },
                { name: 'Sticky Trap', type: 'Goo', power: 0, effect: 'Bind' }
            ]
        };

        // Enemy Ploobus
        this.enemyPloobus = {
            name: 'Enemy Ploobus',
            type: 'Bone',
            hp: 80,
            attack: 15,
            moves: [
                { name: 'Bone Smash', type: 'Bone', power: 20 },
                { name: 'Skeletal Strike', type: 'Bone', power: 10, effect: 'Stun' }
            ]
        };

        // Display HP
        this.playerHPText = this.add.text(200, 150, `HP: ${this.playerPloobus.hp}`, { fontSize: '20px', fill: '#00ff00' });
        this.enemyHPText = this.add.text(600, 150, `HP: ${this.enemyPloobus.hp}`, { fontSize: '20px', fill: '#ff0000' });

        // Display Ploobuses
        this.add.text(200, 100, this.playerPloobus.name, { fontSize: '24px', fill: '#00ff00' }).setOrigin(0.5);
        this.add.text(600, 100, this.enemyPloobus.name, { fontSize: '24px', fill: '#ff0000' }).setOrigin(0.5);

        // Display Moves
        this.moveButtons = this.playerPloobus.moves.map((move, index) => {
            const button = this.add.text(200 + index * 150, 400, move.name, { fontSize: '20px', fill: '#ffffff', backgroundColor: '#0000ff' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.playerMove(index));

            return button;
        });

        // Battle Log
        this.battleLog = this.add.text(400, 500, 'Choose your move!', { fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5);
    }

    playerMove(moveIndex) {
        const move = this.playerPloobus.moves[moveIndex];
        this.executeMove(this.playerPloobus, this.enemyPloobus, move);

        if (this.checkBattleEnd()) return;

        // Enemy's Turn
        this.time.delayedCall(1000, () => {
            const enemyMoveIndex = Phaser.Math.Between(0, this.enemyPloobus.moves.length - 1);
            const enemyMove = this.enemyPloobus.moves[enemyMoveIndex];
            this.executeMove(this.enemyPloobus, this.playerPloobus, enemyMove);
            this.checkBattleEnd();
        }, [], this);
    }

    executeMove(attacker, defender, move) {
        if (move.power > 0) {
            defender.hp -= move.power;
            this.battleLog.setText(`${attacker.name} used ${move.name}!`);
        } else {
            this.battleLog.setText(`${attacker.name} used ${move.name}!`);
            // Handle move effects like Bind or Stun
        }

        // Update HP texts
        this.playerHPText.setText(`HP: ${this.playerPloobus.hp}`);
        this.enemyHPText.setText(`HP: ${this.enemyPloobus.hp}`);
    }

    checkBattleEnd() {
        if (this.playerPloobus.hp <= 0) {
            this.battleLog.setText('You Lost!');
            this.time.delayedCall(2000, () => {
                this.scene.start('MapScene');
            }, [], this);
            return true;
        }

        if (this.enemyPloobus.hp <= 0) {
            this.battleLog.setText('You Won!');
            this.time.delayedCall(2000, () => {
                this.scene.start('MapScene');
            }, [], this);
            return true;
        }

        return false;
    }
}
