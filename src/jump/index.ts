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
        //this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform1');
        //let b = new Phaser.Geom.Rectangle(0, 0, 500, 200)

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
    staticBody?:Phaser.Types.Physics.Arcade.SpriteWithStaticBody
    private butCollider?:Phaser.Physics.Arcade.Collider
    scene:startGame

    constructor(config:{x:number,y:number,scene:startGame}) {
        this.scene =config.scene
        this.genBut(config.x,config.y)
    }
    private genBut(x:number,y:number){
        this.staticBody = this.scene.physics.add.staticSprite(x,y,'atlas','but1')
        this.staticBody.anims.play('butFly')
        this.butCollider = this.scene.physics.add.collider(this.scene.player!,this.staticBody,()=>{
            this.scene.gameOver()
        })
        this.scene.platforms!.add(this.staticBody)
    }
    removeBut(){
        this.scene.platforms!.remove(this.staticBody!)
        //this.scene.anims.remove('butFly')
        this.scene.physics.world.removeCollider(this.butCollider!)
        this.staticBody?.destroy()
    }


}

// class movePlat extends Phaser.GameObjects.Sprite{
//
//     diract:number =1
//     constructor(scene:Phaser.Scene, x:number, y:number, texture: string) {
//         super(scene, x, y, texture);
//         scene.add.existing<movePlat>(this);
//     }
//
// }
/**
class oncePlatform{

    body?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    scene:startGame

    constructor(config:{x:number,y:number,scene:startGame}) {
        this.scene =config.scene
        this.gen(config.x,config.y)
    }

    private gen(x:number,y:number){
        this.body = this.scene.physics.add.sprite(x,y,'atlas','platform3');
        this.scene.onceplats!.add(this.body)
        this.body.setCollideWorldBounds(true);
        (this.body.body! as Phaser.Physics.Arcade.Body).allowGravity = false
        this.body.setGravityY(800)
    }

    removeBut(){
        this.scene.onceplats!.remove(this.body!)
        this.body?.destroy()
    }
}
class movePlatform{
    body?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    scene:startGame

    constructor(config:{x:number,y:number,scene:startGame}) {
        this.scene =config.scene
        this.gen(config.x,config.y)
    }

    private gen(x:number,y:number){
        this.body = this.scene.physics.add.sprite(x,y,'atlas','platform1');
        this.scene.moveplats!.add(this.body)
        this.body.setCollideWorldBounds(true)
        this.body.setVelocityX(100);
        (this.body.body! as Phaser.Physics.Arcade.Body).allowGravity = false
        this.body.body!.immovable = true

    }

    removeBut(){
        this.scene.moveplats!.remove(this.body!)
        this.body?.destroy()
    }
}
**/
class breakPlatform{
    scene:startGame
    private breakCollider?:Phaser.Physics.Arcade.Collider
    staticBody?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    isBreak:boolean = false
    constructor(config:{x:number,y:number,scene:startGame}) {
        this.scene =config.scene
        this.gen(config.x,config.y)
    }

    private gen(x:number,y:number){
        this.staticBody = this.scene.physics.add.sprite(x,y,'atlas','platform2');
        this.breakCollider = this.scene.physics.add.collider(this.scene.player!,this.staticBody,()=>{},()=>{
            if (this.scene.player!.body.velocity.y < 0 && !this.isBreak) {
                (this.staticBody!.body as Phaser.Physics.Arcade.Body).allowGravity = true
                this.staticBody!.anims.play('platformSheet')
                this.isBreak =true
               // this.scene.breakplats!.remove(this.staticBody!)
            }
            return false
        })
        this.scene.breakplats!.add(this.staticBody)
    }
    removeBut(){
        this.scene.breakplats!.remove(this.staticBody!)
        this.scene.physics.world.removeCollider(this.breakCollider!)
        this.staticBody?.destroy()
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
    movePlatColloder?:Phaser.Physics.Arcade.Collider
    oncePlatColloder?:Phaser.Physics.Arcade.Collider
    enemyBut?:butEnemy|undefined
    prePlat?:Phaser.GameObjects.GameObject

    // onceplats?:Phaser.Physics.Arcade.Group
    breakplats?:Phaser.Physics.Arcade.Group
    moveplats?:Phaser.Physics.Arcade.Group
    onceplats?:Phaser.Physics.Arcade.Group

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
        this.moveplats = this.physics.add.group()
        this.onceplats = this.physics.add.group()
        this.breakplats =this.physics.add.group({
            allowGravity: false
        })
        this.platforms.create(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform0');
       // this.prePlat = this.platforms.getChildren()[0]
        this.platformsColloder = this.physics.add.collider(this.player,this.platforms)
        this.movePlatColloder = this.physics.add.collider(this.player,this.moveplats)
        this.oncePlatColloder = this.physics.add.collider(this.player,this.onceplats)

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.add.image(320,50,'atlas','top').setDepth(99)
        this.add.image(320,this.cameras.main.height,'atlas','bottom').setDepth(100)


        this.addPlatform()
        this.addAnims()
    }

    private addPlatform(){
        // let b = new Phaser.Geom.Rectangle(0, this.prePlatPoint.y-400, 500, 200)
        // Phaser.Math.RandomXY(b as Phaser.Math.Vector2)
        this.prePlat = this.platforms!.getChildren()[this.platforms!.getLength()-1]
        console.log(this.prePlat)
        while (this.prePlat!.body!.position.y > 100){
            let  width = Phaser.Math.Between(50,450)
            let  height = Phaser.Math.Between(Math.max(this.prePlat!.body!.position.y-300,0),this.prePlat!.body!.position.y-100)
            this.platforms!.create(width,height,'atlas','platform0')
            this.prePlat = this.platforms!.getChildren()[this.platforms!.getLength()-1]
        }
    }

    private addAnims(){
        this.anims.create({
            key: 'platformSheet',
            frames:this.anims.generateFrameNames('atlas',{
                prefix:'platformSheet_',
                start:2,
                end:4,
                zeroPad:2
            }),
            frameRate:10,
            repeat:0
        })
        this.anims.create({
            key: 'butFly',
            frames:this.anims.generateFrameNames('atlas',{
                prefix:'but',
                start:1,
                end:4
            }),
            frameRate:50,
            repeat:-1
        })

    }
    private updatePlatform(){
        if(this.player!.y < 400 && this.player!.body.velocity.y > 0){
            this.platforms!.incY(10)
            this.platforms!.refresh()
            this.breakplats!.incY(10)
            this.moveplats!.incY(10)
            this.onceplats!.incY(10)
            this.backgroud!.tilePositionY-=10
            this.player!.y += 10
        }
       // console.log(this.player!.body.mass)
        for (let i = this.moveplats!.getChildren().length -1; i >= 0 ; i--) {
            let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> this.onceplats!.getChildren()[i]
            if (Object.is(child.body!.velocity.x , -0)) {
                child.setVelocityX(-100)
            }else if (Object.is(child.body!.velocity.x , 0)){
                child.setVelocityX(100)
            }
            if(child.body!.y>750){
                this.moveplats!.remove(child)
                child.destroy()
            }

        }
        for (let i = this.onceplats!.getChildren().length -1; i >= 0 ; i--) {
            let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> this.onceplats!.getChildren()[i]
            if(child.body!.y>750){
                this.onceplats!.remove(child)
                child.destroy()
            }
        }
        // this.moveplats!.getChildren().forEach(c=>{
        //     let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> c
        //     if (Object.is(child.body!.velocity.x , -0)) {
        //         child.setVelocityX(-100)
        //     }else if (Object.is(child.body!.velocity.x , 0)){
        //         child.setVelocityX(100)
        //     }
        //     if(child.body!.y>800){
        //         this.moveplats!.remove(child)
        //         child.destroy()
        //     }
        // })
        // this.onceplats!.getChildren().forEach(c=>{
        //     let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> c
        //     if(child.body!.y>800){
        //         this.onceplats!.remove(child)
        //         child.destroy()
        //     }
        // })

        if (this.enemyBut != undefined && this.enemyBut.staticBody!.y > 800) {
            this.enemyBut?.removeBut()
            this.enemyBut =undefined
        }
        this.platforms!.children.iterate((child:Phaser.GameObjects.GameObject)=>{
            let body:Phaser.Physics.Arcade.Body =<Phaser.Physics.Arcade.Body> child.body
            if (body.y > 800) {
                let width = Phaser.Math.Between(50,450)
                body.reset(width,0)
                if (this.enemyBut == undefined) this.randomObj(Phaser.Math.Between(100,400),100)
            }
            return true
        })
    }
    randomObj(x:number,y:number){
        this.addOncePlat(x,y)
  /**
        if (Phaser.Math.Between(0, 19) < 2)
        {
            this.enemyBut = new butEnemy({x:x,y:y,scene:this})
            //this.enemyBut = new OncePlatform({x:x,y:y,scene:this})
        }else if(Phaser.Math.Between(0, 10) < 2){
            new breakPlatform({x:x,y:y,scene:this})

        }else if(Phaser.Math.Between(0, 10) < 2){

            this.addMovePlat(x,y)

        }else if(Phaser.Math.Between(0, 10) < 2){
            this.addOncePlat(x,y)
        }
**/
    }

    addMovePlat(x:number,y:number){
        let mp = this.physics.add.sprite(x,y,'atlas','platform1');
        this.moveplats!.add(mp)
        mp.setCollideWorldBounds(true)
        mp.setVelocityX(100);
        (mp.body! as Phaser.Physics.Arcade.Body).allowGravity = false
        mp.body!.immovable = true
    }
    addOncePlat(x:number,y:number){
        let op = this.physics.add.sprite(x,y,'atlas','platform3');
        this.onceplats!.add(op)
        op.setCollideWorldBounds(true);
        (op.body! as Phaser.Physics.Arcade.Body).allowGravity = false
        op.setMass(0.05)
        //op.setGravityY(800)
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
            this.player!.setVelocityX(-150);
            this.player!.flipX =true
       }else if(this.cursors!.right.isDown){
            this.player!.setVelocityX(150);
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
            this.jumped = true
            this.player!.setVelocityY(-500)
            this.changeColloder(false)

        }else {
         //   console.log(this.player!.body.velocity.y)
            if (!this.platformsColloder!.active && this.player!.body.velocity.y > 0) {//跳跃过程中，防止上方触碰平台
                this.changeColloder(true)
            }
        }
    }

    changeColloder(isActive:boolean){
        this.platformsColloder!.active = isActive
        this.movePlatColloder!.active = isActive
        this.oncePlatColloder!.active = isActive
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