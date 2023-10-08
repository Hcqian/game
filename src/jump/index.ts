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
        this.load.image('player', 'jump/assets/doodler.png');
       // this.load.spritesheet()
       // this.load.spritesheet('player','jump/assets/bird.png',{frameWidth:34,frameHeight:24})
    }

    create(){
        let bg = this.add.tileSprite(this.cameras.main.width/2,this.cameras.main.height/2,this.cameras.main.width,this.cameras.main.height,'backgroud')
        let startbutton = this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','Play_01').setInteractive()



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

class butEnemy{
    enemyBut?:Phaser.Types.Physics.Arcade.SpriteWithStaticBody
    butAnims?:Phaser.Animations.Animation
    butCollider?:Phaser.Physics.Arcade.Collider
    scene:startGame
    // x:number
    // y:number

    constructor(config:{x:number,y:number,scene:startGame}) {
        this.scene =config.scene
        this.genBut(config.x,config.y)
    }
    private genBut(x:number,y:number){
        this.enemyBut = this.scene.physics.add.staticSprite(x,y,'atlas','but1')
        this.scene.anims.create({
            key: 'butFly',
            frames:this.scene.anims.generateFrameNames('atlas',{
                prefix:'but',
                start:1,
                end:4
                //zeroPad:1,
                //suffix:'.png'
            }),
            frameRate:50,
            repeat:-1
        })
        this.enemyBut.anims.play('butFly')
        this.butCollider = this.scene.physics.add.collider(this.scene.player!,this.enemyBut,()=>{
            this.scene.gameOver()
        })
        this.scene.platforms!.add(this.enemyBut)
    }
    removeBut(){
        this.scene.platforms!.remove(this.enemyBut!)
        this.scene.anims.remove('butFly')
        this.scene.physics.world.removeCollider(this.butCollider!)
        this.enemyBut?.destroy()

    }


}
class startGame extends Phaser.Scene{

    public player?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    platforms?:Phaser.Physics.Arcade.StaticGroup
    cursors?:Phaser.Types.Input.Keyboard.CursorKeys
    jumped?:boolean =false
    move?:boolean = false
    backgroud?:Phaser.GameObjects.TileSprite
    platformsColloder?:Phaser.Physics.Arcade.Collider
    enemyBut?:butEnemy|undefined

//    playerY:number = 0

    over:boolean = false

    constructor() {
        super('startGame');
    }

    create(data: { backgroud:Phaser.GameObjects.TileSprite }){
        this.backgroud = data.backgroud
        this.player = this.physics.add.sprite(this.cameras.main.width/2,this.cameras.main.height-200,'player').setScale(0.5,0.5)
        this.player.setCollideWorldBounds(true)

     //   this.playerY = this.player.y
        // this.player.setScrollFactor(0,1)//相机
        //let camera = this.cameras.main.setSize(500,400)
        //this.cameras.main.startFollow(this.player)

       // this.cameras.main.stopFollow()

        this.jumped = false;
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform0');
      //  (this.platforms.getChildren()[0].body as Phaser.Physics.Arcade.Body).allowGravity = false
        this.platformsColloder = this.physics.add.collider(this.player,this.platforms)

        this.cursors = this.input.keyboard!.createCursorKeys();
        let top = this.add.image(320,50,'atlas','top').setDepth(99)
        let bottom = this.add.image(320,this.cameras.main.height,'atlas','bottom').setDepth(100)

        this.addPlatform()
        //this.genBut(200,200)
        //this.enemyBut = new butEnemy({x:200,y:200,scene:this})
        //const object2 = this.add.container(0, 0, [top,bottom]);
        //this.cameras.main.startFollow(object2)
      //  this.children.bringToTop(top)
      //  this.children.bringToTop(bottom)
        console.log(this.children)

    }


    private addPlatform(){
        let  width = Phaser.Math.Between(100,400)
        let  height = Phaser.Math.Between(200,300)
        this.platforms!.create(width,100,'atlas','platform0')
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
                if (this.enemyBut == undefined) this.randomBut(Phaser.Math.Between(100,400),-100)
            }
            if (this.enemyBut != undefined && this.enemyBut.enemyBut!.y > 800) {
                this.enemyBut?.removeBut()
                this.enemyBut =undefined
            }
            return true
        })
    }
    randomBut(x:number,y:number){
        if (Phaser.Math.Between(0, 19) < 2)
        {
            this.enemyBut = new butEnemy({x:x,y:y,scene:this})
        }
    }
    gameOver(){
        this.over =true
        this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'atlas','gameOver')
    }

    update(time: number, delta: number) {
        if (this.over) return
        if (this.player!.y > 750) this.gameOver()
        super.update(time, delta);
        this.updatePlatform()
        if (this.cursors!.left.isDown) {
            this.player!.setVelocityX(-160);
            this.player!.flipX =true
       }else if(this.cursors!.right.isDown){
            this.player!.setVelocityX(160);
            this.player!.flipX =false
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
           // console.log(Math.floor(Math.random() * 10))
            this.jumped = true
            this.player!.setVelocityY(-450)
            this.platformsColloder!.active = false
        }else {
         //   console.log(this.player!.body.velocity.y)
            if (!this.platformsColloder!.active && this.player!.body.velocity.y > 0) {//跳跃过程中，防止上方触碰平台
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