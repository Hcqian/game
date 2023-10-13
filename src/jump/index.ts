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
        //this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform2');
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


class OncePlatform{
    scene:startGame
    private onceCollider?:Phaser.Physics.Arcade.Collider
    staticBody?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    constructor(config:{x:number,y:number,scene:startGame}) {
        this.scene =config.scene
        this.gen(config.x,config.y)
    }

    private gen(x:number,y:number){
        this.staticBody = this.scene.physics.add.sprite(x,y,'atlas','platform2');
        this.onceCollider = this.scene.physics.add.collider(this.scene.player!,this.staticBody,()=>{
            if (this.scene.player!.body.velocity.y < 0) {
                (this.staticBody!.body as Phaser.Physics.Arcade.Body).allowGravity = true
                this.staticBody!.anims.play('platformSheet')
            }
        })
        this.scene.onceplats!.add(this.staticBody)
    }
    removeBut(){
        this.scene.onceplats!.remove(this.staticBody!)
        this.scene.physics.world.removeCollider(this.onceCollider!)
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
    enemyBut?:butEnemy|undefined
    prePlat?:Phaser.GameObjects.GameObject

    onceplats?:Phaser.Physics.Arcade.Group
    moveplats?:Phaser.Physics.Arcade.StaticGroup

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
        this.onceplats =this.physics.add.group({
            allowGravity: false
        })
        this.platforms.create(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform0');
       // this.prePlat = this.platforms.getChildren()[0]
        this.platformsColloder = this.physics.add.collider(this.player,this.platforms)

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.add.image(320,50,'atlas','top').setDepth(99)
        this.add.image(320,this.cameras.main.height,'atlas','bottom').setDepth(100)


        this.addPlatform()
        this.addAnims()
        //this.genBut(200,200)
        //this.enemyBut = new butEnemy({x:200,y:200,scene:this})
        //const object2 = this.add.container(0, 0, [top,bottom]);
        //this.cameras.main.startFollow(object2)
      //  this.children.bringToTop(top)
      //  this.children.bringToTop(bottom)
       // console.log(this.children)

    }
    /**
    private createOncePlat(x:number,y:number){
        let test = this.physics.add.sprite(this.cameras.main.width/2,this.cameras.main.height/2,'atlas','platform2')
        this.onceplatfroms?.add(test)
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
        this.physics.add.collider(this.player!,this.onceplatfroms!,()=>{},(object1, object2)=>{
            //(object2 as Phaser.Physics.Arcade.Body).allowGravity = true;
            let a = <Phaser.Physics.Arcade.Sprite> object2;
            if (!a.body!.allowGravity)
                a.anims.play('platformSheet');
            (a.body as  Phaser.Physics.Arcade.Body).setAllowGravity(true)
            return false
        })

    }
     **/


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
        if(this.player!.y < 400&&this.player!.body.velocity.y > 0){
            this.platforms!.incY(10)
            this.platforms!.refresh()
            this.onceplats!.incY(10)
            //this.moveplats!.incY(10)
            this.backgroud!.tilePositionY-=10
            this.player!.y += 10
        }
        //this.moveplats!.incX(10)
        if (this.enemyBut != undefined && this.enemyBut.staticBody!.y > 800) {
            this.enemyBut?.removeBut()
            this.enemyBut =undefined
        }
        this.platforms!.children.iterate((child:Phaser.GameObjects.GameObject)=>{
            let body:Phaser.Physics.Arcade.Body =<Phaser.Physics.Arcade.Body> child.body
            if (body.y > 800) {
                let width = Phaser.Math.Between(50,450)
                body.reset(width,0)
                if (this.enemyBut == undefined) this.randomObj(Phaser.Math.Between(100,400),100,'but')
            }
            return true
        })
    }
    randomObj(x:number,y:number,type:string){
        if (type == 'but' && Phaser.Math.Between(0, 19) < 2)
        {
            this.enemyBut = new butEnemy({x:x,y:y,scene:this})
            //this.enemyBut = new OncePlatform({x:x,y:y,scene:this})
        }else if(type == 'oncePlat'){

        }else if(type == 'movePlat'){

        }else if(type == 'breakPlat'){

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
        console.log(this.player!.body.velocity.y)
        if(!this.jumped){
            this.jumped = true
            this.player!.setVelocityY(-500)
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