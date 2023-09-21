import Phaser from "phaser";

class startScene extends Phaser.Scene{
    constructor() {
        super('startScene');
    }

    preload(){
        this.load.image('title','assets/title.png')
        this.load.image('start-button','assets/start-button.png')
        this.load.image('instructions','assets/instructions.png')
        this.load.image('background','assets/background.png')
        this.load.image('ground','assets/ground.png')
        this.load.image('gameover','assets/gameover.png')
        //加载音效
        this.load.audio('score','assets/score.wav')
        this.load.audio('ground-hit','assets/ground-hit.wav')
        this.load.audio('pipe-hit','assets/pipe-hit.wav')


    }

}


class overScene extends Phaser.Scene{
    constructor() {
        super('overScene');
    }

}

class loadScene extends Phaser.Scene{
    constructor() {
        super('loadScene');
    }

}











const config = {
    type:Phaser.AUTO,
    width:430,
    height:600,
    physics:{
        default:'arcade',
        arcade:{
            gravity: {y:400},
            debug:false

        }
    },
    scene:[startScene,overScene,loadScene]

}


export const game = new Phaser.Game(config)