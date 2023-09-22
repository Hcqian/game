import Phaser from "phaser";

let bg:Phaser.GameObjects.TileSprite
let width:number = 430
let height:number = 600

class startScene extends Phaser.Scene{
    constructor() {
        super('startScene');
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

    preload(){
        this.load.image('title','flappybird/assets/title.png')
        this.load.image('start-button','flappybird/assets/start-button.png')
        this.load.image('instructions','flappybird/assets/instructions.png')
        this.load.image('background','flappybird/assets/background.png')
        this.load.image('ground','flappybird/assets/ground.png')
        this.load.image('gameover','flappybird/assets/gameover.png')
        //加载音效
        this.load.audio('score','flappybird/assets/score.wav')
        this.load.audio('ground-hit','flappybird/assets/ground-hit.wav')
        this.load.audio('pipe-hit','flappybird/assets/pipe-hit.wav')

        this.load.spritesheet('pipes','flappybird/assets/pipes.png',{frameWidth:54,frameHeight:320})
        this.load.spritesheet('bird','flappybird/assets/bird.png',{frameWidth:34,frameHeight:24})

    }

    create(){
        bg = this.add.tileSprite(width/2, height/2, width, height, 'background')
        let title = this.add.image(width/2,100,'title')
        let instructions = this.add.image(width/2,height/2,'instructions')
        let startButton = this.add.image(width/2,height-100,'start-button').setInteractive()

        this.anims.create({
            key:'fly',
            frames: this.anims.generateFrameNumbers('bird',{start:0,end:2}),
            frameRate:10,
            repeat: -1
        })

        startButton.on('pointerdown', ()=>{
            title.destroy()
            startButton.destroy()
            instructions.destroy()
            this.scene.start<startScene>('startScene')
        })

    }

}

const config = {
    type:Phaser.AUTO,
    width:width,
    height:height,
    physics:{
        default:'arcade',
        arcade:{
            gravity: {y:400},
            debug:false

        }
    },
    scene:[loadScene,startScene,overScene]
}

export const game = new Phaser.Game(config)