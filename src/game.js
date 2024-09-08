const socket = io();

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

let player;
let otherPlayers = {};

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

function create() {
    this.add.image(400, 300, 'sky');

    player = this.physics.add.sprite(400, 300, 'player').setDisplaySize(50, 50);

    // Listen for updates from the server
    socket.on('currentPlayers', (players) => {
        Object.keys(players).forEach((id) => {
            if (id === socket.id) {
                addPlayer(this, players[id], true);
            } else {
                addPlayer(this, players[id], false);
            }
        });
    });

    socket.on('newPlayer', (playerInfo) => {
        addPlayer(this, playerInfo, false);
    });

    socket.on('playerDisconnected', (playerId) => {
        if (otherPlayers[playerId]) {
            otherPlayers[playerId].destroy();
            delete otherPlayers[playerId];
        }
    });

    socket.on('playerMoved', (playerInfo) => {
        if (otherPlayers[playerInfo.id]) {
            otherPlayers[playerInfo.id].setPosition(playerInfo.x, playerInfo.y);
        }
    });
}

function update() {
    const cursors = this.input.keyboard.createCursorKeys();
    let moved = false;

    if (cursors.left.isDown) {
        player.x -= 5;
        moved = true;
    } else if (cursors.right.isDown) {
        player.x += 5;
        moved = true;
    }

    if (cursors.up.isDown) {
        player.y -= 5;
        moved = true;
    } else if (cursors.down.isDown) {
        player.y += 5;
        moved = true;
    }

    if (moved) {
        socket.emit('playerMovement', { x: player.x, y: player.y });
    }
}

function addPlayer(scene, playerInfo, isSelf) {
    const playerSprite = scene.add.sprite(playerInfo.x, playerInfo.y, 'player').setDisplaySize(50, 50);

    if (isSelf) {
        player = playerSprite;
    } else {
        otherPlayers[playerInfo.id] = playerSprite;
    }
}
