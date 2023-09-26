import Phaser from "phaser";

let bg:Phaser.GameObjects.TileSprite
let width:number = 350
let height:number = 505



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
        this.loadFn()
    }

    private loadFn(){
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let config = {
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                fontFamily: '20px monospace',
                color: '#ffffff'
            }
        }

        let loadingText = this.make.text(config);
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                fontFamily: '18px monospace',
                color: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value:number)=>{
            percentText.setText(value * 100 + '%');
        });

        this.load.on('complete', ()=> {
            loadingText.destroy();
            percentText.destroy();
        });
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
            game.scene.start<startScene>('startScene')
        })

    }
    update(time: number, delta: number) {
        super.update(time, delta);
        bg.tilePositionX+=0.5
    }

}
class startScene extends Phaser.Scene{

  //  platforms?: Phaser.Physics.Arcade.StaticGroup;
    platforms?: Phaser.Physics.Arcade.Group;
    pipesX:number = 200 //管道位置
    scoreText?:Phaser.GameObjects.Text
    score:number=0
    player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    over:boolean = false
    ground?: Phaser.GameObjects.TileSprite

    constructor() {
        super('startScene');
    }
    create(){
   //     bg = this.add.tileSprite(width/2, height/2, width, height, 'background')
   //     this.platforms = this.physics.add.staticGroup()
        this.platforms = this.physics.add.group()
        this.createPipes()
        this.ground = this.add.tileSprite(config.width-335/2, config.height-112/2,335,112, 'ground')
        this.scoreText = this.add.text(10,10,this.score+'').setFontSize(36)
        this.player = this.physics.add.sprite(100,100,'bird')
        this.input.on('pointerdown',()=>{
            if(this.over) return;
            this.tweens.add({
                targets: this.player,
                duration:50,
                angle:-20,
            })
            //设置角色Y轴速度
            this.player!.setVelocityY(-200)
        })
        this.player.anims.play('fly')
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        if(!this.over){
            bg.tilePositionX+=0.5
            this.ground!.tilePositionX+=5
            this.updatePipes()
            this.platforms!.setVelocityX(-200)

        }

        this.physics.add.overlap(this.player!,this.platforms!,()=>{
            if(this.over) return;
            this.sound.play('pipe-hit')
            this.gameOver()
        })
        this.physics.add.collider(this.player!,this.ground!,()=>{
            if(this.over) return;
            this.sound.play('ground-hit')
            this.gameOver()
        })
    }
    private gameOver(){
        this.over = true
        this.score = 0
        this.player!.anims.stop()
        this.platforms!.setVelocityX(0)

    }
    updatePipes() {
        this.platforms!.children.iterate((child: Phaser.GameObjects.GameObject) => {
            let body:Phaser.Physics.Arcade.Body =<Phaser.Physics.Arcade.Body> child.body
            if (body.x < -54) {
                let topY = Phaser.Math.Between(-60, 0)
                let bottomY = Phaser.Math.Between(400, 460)
                if (body.y < 20) {//上管
                    this.score++
                    this.scoreText!.setText(this.score + '')
                    this.sound.play('score')
                    body.reset(config.width, topY)
                } else {//下管
                    body.reset(config.width, bottomY)
                }
            }
            return true
        })
    }
    private createPipes(){
        let interval = Phaser.Math.Between(100,135)
        let topY = Phaser.Math.Between(-40,20)
        let bottomY = Phaser.Math.Between(380,440)
        this.pipesX += interval
        this.platforms!.create(this.pipesX,topY,"pipes")
        this.platforms!.create(this.pipesX,bottomY,"pipes",1)
        this.platforms?.children.iterate((child:Phaser.GameObjects.GameObject) =>{
            let body:Phaser.Physics.Arcade.Body =<Phaser.Physics.Arcade.Body> child.body
            body.allowGravity = false
            return true
        })
        if (this.platforms!.children.size < 4) {
            this.createPipes()
        }

    }
}
class overScene extends Phaser.Scene{
    constructor() {
        super('overScene');
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





/**
var loadScene = {
    key:'loadScene',
    active:true,
    preload: loadPreload,
    create: loadCreate,
}
var gameStartScene = {
    key:'gameStartScene',
    create: gameCreate,
    update: update
}
const config = {
    type: Phaser.AUTO,
    width: 288,
    height: 505,
    // 设置重力
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false,
        }
    },
    scene: [loadScene,gameStartScene],
};
export const game = new Phaser.Game(config)
let bg:Phaser.GameObjects.TileSprite
function loadPreload(this:Phaser.Scene) {
    this.load.image('background','flappybird/assets/background.png')
    this.load.image('start-button','flappybird/assets/start-button.png')
}
function loadCreate(this:Phaser.Scene) {
    bg = this.add.tileSprite(config.width / 2, config.height / 2, config.width, config.height, 'background')
    var startButton = this.add.image(config.width/2,config.height-100,'start-button').setInteractive()
    startButton.on('pointerdown',  () =>{
        startButton.destroy()
        game.scene.start<Phaser.Scene>('gameStartScene');
    });
}

function gameCreate() {

}
function update() {

}
**/