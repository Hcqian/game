import Phaser from "phaser";

class loadGame extends Phaser.Scene{

    constructor() {
        super('loadGame');
    }
    preload(){
        this.load.image('backgroud', 'jump/assets/bg.jpg');
        this.load.image('btn', 'jump/assets/btn.png');
        this.load.atlas('atlas', 'jump/assets/atlas.png', 'jump/assets/atlas.json');
        this.load.audio('bg','jump/assets/bg.mp3');
        this.load.audio('jump','jump/assets/jump.mp3');
        this.load.audio('spring','jump/assets/spring.mp3');
        this.load.audio('false1','jump/assets/false1.mp3');
        this.load.audio('false2','jump/assets/false2.mp3');
        this.load.audio('click','jump/assets/click.mp3');
        this.load.spritesheet('player','jump/assets/bird.png',{frameWidth:34,frameHeight:24})
    }

    create(){
        this.add.tileSprite(this.cameras.main.width/2,this.cameras.main.height/2,this.cameras.main.width,this.cameras.main.height,'backgroud')
        let startbutton = this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','Play_01').setInteractive()
        this.add.image(320,50,'atlas','top')
        this.add.image(320,this.cameras.main.height,'atlas','buttom')

        startbutton.on('pointerover',()=>{
            startbutton.setTexture('atlas','Play_02')
        })
        startbutton.on('pointerout',()=>{
            startbutton.setTexture('atlas','Play_01')
        })
        startbutton.on('pointerdown',()=>{
            startbutton.destroy()
            game.scene.start<startGame>('startGame')
        })

    }

}
class startGame extends Phaser.Scene{

    player?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    platforms?:Phaser.Physics.Arcade.StaticGroup
    cursors?:Phaser.Types.Input.Keyboard.CursorKeys
    jumped?:boolean =false

    constructor() {
        super('startGame');
    }

    create(){
        this.player = this.physics.add.sprite(this.cameras.main.width/2,this.cameras.main.height-200,'player')
        this.jumped = false;
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform0')
        this.physics.add.collider(this.player,this.platforms);
        this.cursors = this.input.keyboard!.createCursorKeys();

    }

    private addPlatform(){


    }

    update(time: number, delta: number) {
        super.update(time, delta);
        if (this.cursors!.left.isDown) {
            this.player!.setVelocityX(-50);
        }else if(this.cursors!.right.isDown){
            this.player!.setVelocityX(50);
        }else if(!this.jumped && this.cursors!.up.isDown){
            this.jumped = true
            this.player!.setVelocityY(-350)
        }else {
            if(this.player!.body.touching.down) {
                this.jumped = false
                this.player!.setVelocityX(0)
            }
        }
    }
}



const config = {
    type:Phaser.AUTO,
    width:500,
    height:800,
    physics:{
        default:'arcade',
        arcade:{
            gravity: {y:400},
            debug:false

        }
    },
    scene:[loadGame,startGame]
}
export const game = new Phaser.Game(config)