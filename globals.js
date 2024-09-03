import Phaser from 'phaser';

interface CurrentRun {
    registry: Phaser.Registry,
    scene: Phaser.Scene,
    camera: Phaser.Camera,
    game: Phaser.Game,
    ploobusTeam: ploobus[],
    gold: number,
}

interface ploobus {
    id: number,
    dexNumber: number,
    species: string,
    hp: number,
    attack: number,
    defense: number,
    speed: number,
    specialDefense: number,
    specialAttack: number,
    type: string,
    moves: Object[],
    ability: string, /* id */
    height: number,
    weight: number,
}

export default {
    CurrentRun
    ploobus,
}