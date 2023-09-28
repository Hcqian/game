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
        let bg = this.add.tileSprite(this.cameras.main.width/2,this.cameras.main.height/2,this.cameras.main.width,this.cameras.main.height,'backgroud')
        let startbutton = this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','Play_01').setInteractive()
        this.add.image(320,50,'atlas','top')  //怎么遮盖
        this.add.image(320,this.cameras.main.height,'atlas','bottom')

        startbutton.on('pointerover',()=>{
            startbutton.setTexture('atlas','Play_02')
        })
        startbutton.on('pointerout',()=>{
            startbutton.setTexture('atlas','Play_01')
        })
        startbutton.on('pointerdown',()=>{
            startbutton.destroy()
            game.scene.start<startGame>('startGame',{backgroud:bg})
        })

    }

}
class startGame extends Phaser.Scene{

    player?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    platforms?:Phaser.Physics.Arcade.StaticGroup
    cursors?:Phaser.Types.Input.Keyboard.CursorKeys
    jumped?:boolean =false
    move?:boolean = false
    backgroud?:Phaser.GameObjects.TileSprite
    platformsColloder?:Phaser.Physics.Arcade.Collider

    playerY:number = 0

    over:boolean = false

    constructor() {
        super('startGame');
    }

    create(data: { backgroud:Phaser.GameObjects.TileSprite }){
        this.backgroud = data.backgroud
        this.player = this.physics.add.sprite(this.cameras.main.width/2,this.cameras.main.height-200,'player')
        this.player.setCollideWorldBounds(true)
        this.playerY = this.player.y
        this.jumped = false;
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform0');
      //  (this.platforms.getChildren()[0].body as Phaser.Physics.Arcade.Body).allowGravity = false
        this.platformsColloder = this.physics.add.collider(this.player,this.platforms)

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.addPlatform()

    }

    private addPlatform(){
        let  width = Phaser.Math.Between(100,400)
        let  height = Phaser.Math.Between(200,300)
        this.platforms!.create(width,0,'atlas','platform0')
        width = Phaser.Math.Between(100,400)
        this.platforms!.create(width,height,'atlas','platform0')
        width = Phaser.Math.Between(100,400)
        height = Phaser.Math.Between(350,450)
        this.platforms!.create(width,height,'atlas','platform0')
        width = Phaser.Math.Between(100,400)
        height = Phaser.Math.Between(500,600)
        this.platforms!.create(width,height,'atlas','platform0')
    }
    private updatePlatform(){
        this.platforms!.incY(1)
        this.backgroud!.tilePositionY-=1
        this.platforms!.refresh()
        this.platforms!.children.iterate((child:Phaser.GameObjects.GameObject)=>{
            let body:Phaser.Physics.Arcade.Body =<Phaser.Physics.Arcade.Body> child.body
            if (body.y > 800) {
                let width = Phaser.Math.Between(100,400)
                body.reset(width,0)
            }
            return true
        })

    }

    update(time: number, delta: number) {
        if (this.over) return
        if (this.player!.y > 750) {this.over =true}
        super.update(time, delta);
        this.updatePlatform()
       // if (!this.move && this.cursors!.left.isDown) {
        if (this.cursors!.left.isDown) {
         //   this.move =true
            this.player!.setVelocityX(-160);
       // }else if(!this.move && this.cursors!.right.isDown){
       }else if(this.cursors!.right.isDown){
           // this.move =true
            this.player!.setVelocityX(160);
        }else {
            // if(this.player!.body.touching.down) {
            //  //   this.move =false
            //     this.jumped = false
            //     this.player!.setVelocityX(0)
            // }
        }
        if(this.player!.body.touching.down) {
            this.jumped = false
            this.player!.setVelocityX(0)
        }
        if(!this.jumped){
            this.jumped = true
            this.player!.setVelocityY(-400)
            this.platformsColloder!.active = false
        }else {
         //   console.log(this.player!.body.velocity.y)
            if (!this.platformsColloder!.active && this.player!.body.velocity.y > 0) {
                this.platformsColloder!.active = true
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