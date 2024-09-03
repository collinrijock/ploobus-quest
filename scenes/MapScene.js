// scenes/MapScene.js

export default class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapScene' });
        this.currentNodeId = 1; // Start at node 1
    }

    preload() {
        // Load assets for the map (e.g., node images, paths)
    }

    create() {
        // Example: Simple node representation using circles
        this.nodes = [
            { x: 100, y: 300, id: 1, connections: [2, 3] },
            { x: 300, y: 150, id: 2, connections: [4] },
            { x: 500, y: 300, id: 3, connections: [4] },
            { x: 700, y: 150, id: 4, connections: [] }
        ];

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffffff, 1);

        // Draw lines between nodes (paths)
        this.nodes.forEach(node => {
            node.connections.forEach(connection => {
                const connectedNode = this.nodes.find(n => n.id === connection);
                this.graphics.strokeLineShape(new Phaser.Geom.Line(node.x, node.y, connectedNode.x, connectedNode.y));
            });
        });

        // Create and draw the nodes
        this.nodeCircles = {};
        this.nodes.forEach(node => {
            const color = (node.id === this.currentNodeId) ? 0x0000ff : 0x999999; // Blue for current, gray for inactive
            const nodeCircle = this.add.circle(node.x, node.y, 20, color)
                .setInteractive({ useHandCursor: true });

            this.add.text(node.x, node.y, `${node.id}`, { fontSize: '16px', fill: '#000' }).setOrigin(0.5);

            this.nodeCircles[node.id] = nodeCircle;
        });

        // Highlight connected nodes
        this.updateConnectedNodes();

        // Back to Main Menu Button
        const backButton = this.add.text(50, 550, 'Main Menu', { fontSize: '20px', fill: '#ff0000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.backToMainMenu());
    }

    updateConnectedNodes() {
        // Get the current node
        const currentNode = this.nodes.find(n => n.id === this.currentNodeId);

        // Make connected nodes interactive and yellow
        currentNode.connections.forEach(connection => {
            const connectedNode = this.nodeCircles[connection];
            connectedNode.setFillStyle(0xffff00); // Yellow
            connectedNode.on('pointerdown', () => this.moveToNode(connection));
        });
    }

    moveToNode(nodeId) {
        // Disable interaction for previous nodes
        this.nodes.forEach(node => {
            this.nodeCircles[node.id].disableInteractive();
            if (node.id !== nodeId) {
                this.nodeCircles[node.id].setFillStyle(0x999999); // Gray for inactive nodes
            }
        });

        // Set the new current node
        this.currentNodeId = nodeId;
        this.nodeCircles[nodeId].setFillStyle(0x0000ff); // Blue for the current node

        // Update the connected nodes
        this.updateConnectedNodes();
    }

    enterBattle(nodeId) {
        // Pass nodeId if needed for battle setup
        this.scene.start('BattleScene', { nodeId: nodeId });
    }

    backToMainMenu() {
        this.scene.start('MainMenuScene');
    }
}
