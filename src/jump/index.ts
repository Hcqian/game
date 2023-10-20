import Phaser from "phaser";
import Pan = Phaser.Cameras.Scene2D.Effects.Pan;

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
        // this.cameras.main.height=config.height-200
      // this.cameras.main.setBounds(-100,-100,500,800)
        let bg = this.add.tileSprite(this.cameras.main.width/2,this.cameras.main.height/2,this.cameras.main.width,this.cameras.main.height,'backgroud')
       let startbutton = this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','Play_01').setInteractive()
        //let startbutton = this.add.image(0,0,'atlas','Play_01').setInteractive()
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
        // this.butCollider = this.scene.physics.add.collider(this.scene.player!,this.staticBody,()=>{},()=>{
        //     this.scene.gameOver()
        //     return false
        // })

        //this.scene.platforms!.add(this.staticBody)
    }
    removeBut(){
        //this.scene.platforms!.remove(this.staticBody!)
        //this.scene.anims.remove('butFly')
        this.scene.physics.world.removeCollider(this.butCollider!)
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
    breakPlatColloder?:Phaser.Physics.Arcade.Collider
    butColloder?:Phaser.Physics.Arcade.Collider
    //enemyBut?:Phaser.Types.Physics.Arcade.SpriteWithStaticBody
    prePlat?:Phaser.Types.Physics.Arcade.SpriteWithStaticBody

    // onceplats?:Phaser.Physics.Arcade.Group
    breakplats?:Phaser.Physics.Arcade.Group
    moveplats?:Phaser.Physics.Arcade.Group
    onceplats?:Phaser.Physics.Arcade.Group
    // onceplats?:Phaser.Physics.Arcade.StaticGroup
    enemyGroup?:Phaser.Physics.Arcade.StaticGroup

//    playerY:number = 0

    over:boolean = false

    constructor() {
        super('startGame');
    }

    create(data: { backgroud:Phaser.GameObjects.TileSprite }){
        // this.cameras.main.setSize(500,650)
        //this.cameras.main.setBounds(0,200,500,1000)
        this.backgroud = data.backgroud
        this.player = this.physics.add.sprite(this.cameras.main.width/2,this.cameras.main.height-200,'player').setScale(0.5,0.5)
        this.player.setCollideWorldBounds(true)

        this.jumped = false;
        this.platforms = this.physics.add.staticGroup()
        this.moveplats = this.physics.add.group()
        this.onceplats = this.physics.add.group()
        //this.onceplats = this.physics.add.staticGroup()
        this.breakplats =this.physics.add.group({
            allowGravity: false
        })
        this.enemyGroup = this.physics.add.staticGroup()

        this.platforms.create(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform0');
       // this.prePlat = this.platforms.getChildren()[0]
        this.platformsColloder = this.physics.add.collider(this.player,this.platforms)
        this.movePlatColloder = this.physics.add.collider(this.player,this.moveplats)
        this.oncePlatColloder = this.physics.add.collider(this.player,this.onceplats)
        this.breakPlatColloder = this.physics.add.collider(this.player!,this.breakplats,()=>{},(object1, object2)=>{
            let sprite = <Phaser.Physics.Arcade.Sprite> object2;
                (sprite.body as Phaser.Physics.Arcade.Body).allowGravity = true
                sprite!.anims.play('platformSheet')
            return false
        })
        this.butColloder = this.physics.add.collider(this.player!,this.enemyGroup,()=>{
            this.gameOver()
        })

        this.cursors = this.input.keyboard!.createCursorKeys();
       this.add.image(320,50,'atlas','top').setDepth(99)
       this.add.image(320,this.cameras.main.height,'atlas','bottom').setDepth(100)


        this.addPlatform()
        this.addAnims()
    }

    private addPlatform(){
        this.prePlat = <Phaser.Types.Physics.Arcade.SpriteWithStaticBody>this.platforms!.getChildren()[this.platforms!.getLength()-1]
        for(let i = 0; i < 5; i++){
            let randompoint = this.randomCycleDirct(200,200,{x:this.prePlat!.x,y:this.prePlat!.y})
            this.platforms!.create(randompoint.x,randompoint.y,'atlas','platform0')
            this.prePlat = <Phaser.Types.Physics.Arcade.SpriteWithStaticBody>this.platforms!.getChildren()[this.platforms!.getLength()-1]
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

    private scroll(y:number){
        //this.platforms!.incY(y).refresh()
        //this.enemyGroup!.incY(y).refresh()
        //this.breakplats!.incY(y)
        this.moveplats!.incY(y)
       // this.onceplats!.incY(y)
        this.backgroud!.tilePositionY -= y
        for (let i = this.onceplats!.getChildren().length -1; i >= 0 ; i--) {
            let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> this.onceplats!.getChildren()[i]
            child.y+=y
            if(child.body!.y>750){
                this.onceplats!.remove(child)
                child.destroy()
            }
        }

        for (let i = this.breakplats!.getChildren().length -1; i >= 0 ; i--) {
            let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> this.breakplats!.getChildren()[i]
            child.y+=y
            if(child.body!.y>750){
                this.breakplats!.remove(child)
                child.destroy()
            }
        }
        for (let i = this.enemyGroup!.getChildren().length -1; i >= 0 ; i--) {
            let child =<Phaser.Types.Physics.Arcade.SpriteWithStaticBody> this.enemyGroup!.getChildren()[i]
            child.y+=y
            child.refreshBody()
            if(child.body!.y>750){
                child.anims.stop()
                this.enemyGroup!.remove(child)
                child.destroy()
            }
        }

        this.platforms!.children.iterate((obj:Phaser.GameObjects.GameObject)=>{
            let child =<Phaser.Types.Physics.Arcade.SpriteWithStaticBody> obj
            child.y+=y
            child.refreshBody()
            if (child.y > 800) {
                let randompoint = this.randomCycleDirct(200,200,{x:this.prePlat!.x,y:this.prePlat!.y})
                this.prePlat = <Phaser.Types.Physics.Arcade.SpriteWithStaticBody>this.randomObj(randompoint.x,randompoint.y,child)
            }
            return true
        })

    }
    flag:number = 0
    private updatePlatform(){
        //console.log(delta)
        if(this.player!.y < 350 || (this.flag <30 && this.flag > 0)) {
            this.scroll(Math.min(this.flag,10))
            this.flag++
            this.player!.y+=Math.min(this.flag,10)
        }else {
            this.flag = 0
        }
        for (let i = this.moveplats!.getChildren().length -1; i >= 0 ; i--) {
            let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> this.moveplats!.getChildren()[i]
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

    }
    randomObj(x:number,y:number,sprite:Phaser.GameObjects.GameObject){

        let randompoint = this.randomCycleDirct(100,100,{x:x,y:y})
        if (Phaser.Math.Between(0, 19) < 2) {
            this.addButEnemy(randompoint.x,randompoint.y)
        }else if(Phaser.Math.Between(0, 10) < 2){
            this.addBreakPlat(randompoint.x,randompoint.y)
        }
        randompoint = this.randomCycleDirct(200,200,{x:x,y:y})
        // console.log(Math.sqrt(Math.pow(x-randompoint.x,2)+Math.pow(randompoint.y,2)))
        if(Phaser.Math.Between(0, 10) < 2){
            this.addOncePlat(x,y);
            (sprite as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody).body.reset(randompoint.x,randompoint.y)
        }else if(Phaser.Math.Between(0, 10) < 2){
            this.addMovePlat(x,y);
            (sprite as Phaser.Types.Physics.Arcade.SpriteWithStaticBody).body.reset(randompoint.x,randompoint.y)
        } else
        {
            (sprite as Phaser.Types.Physics.Arcade.SpriteWithStaticBody).body.reset(x,y)
        }
        return sprite
    }

    addMovePlat(x:number,y:number){
        let mp = this.physics.add.sprite(x,y,'atlas','platform1');
        this.moveplats!.add(mp)
        mp.setCollideWorldBounds(true)
        mp.body.world.checkCollision.up = false;
        mp.setVelocityX(100);
        (mp.body! as Phaser.Physics.Arcade.Body).allowGravity = false
        mp.body!.immovable = true
    }
    addOncePlat(x:number,y:number){
        let op = this.physics.add.sprite(x,y,'atlas','platform3');
        this.onceplats!.add(op);
        op.setCollideWorldBounds(true);
        op.body.world.checkCollision.up = false;
      //  op.setCollideWorldBounds(true);
        (op.body! as Phaser.Physics.Arcade.Body).allowGravity = false
        op.setMass(0.05)
    }
    addBreakPlat(x:number,y:number){
        let bp = this.physics.add.sprite(x,y,'atlas','platform2');
        this.breakplats!.add(bp);
        (bp.body! as Phaser.Physics.Arcade.Body).allowGravity = false

    }
    addButEnemy(x:number,y:number){
        let enemyBut = this.physics.add.staticSprite(x,y,'atlas','but1')
        this.enemyGroup!.add(enemyBut)
        enemyBut.anims.play('butFly')
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
            if (!this.platformsColloder!.active && this.player!.body.velocity.y > 0) {//跳跃过程中，防止上方触碰平台
                this.changeColloder(true)
            }
        }
    }

    changeColloder(isActive:boolean){
        this.platformsColloder!.active = isActive
        this.movePlatColloder!.active = isActive
        this.oncePlatColloder!.active = isActive
        this.breakPlatColloder!.active = isActive

    }

    randomCycleDirct(min:number,max:number,point:{x:number,y:number}):{x:number,y:number}{
        let  angle = Phaser.Math.Between(30,90)
        let randomdirct = Phaser.Math.Between(min,max)
        let ydirct =Math.sin(Math.PI/180*angle)*randomdirct
        let xdirct =Math.cos(Math.PI/180*angle)*randomdirct
        let x=point.x
        if (point.x - xdirct < 0) {
            x+=xdirct
        }else if(point.x + xdirct >450){
            x-=xdirct
        }else{
            x = Phaser.Math.Between(0,1) == 0? x+xdirct:x-xdirct
        }
        return {x:x,y:point.y-ydirct}

    }

}



const config = {
    type:Phaser.AUTO,
    width:500,
    height:800,
    physics:{
        default:'arcade',
        arcade:{
            gravity: {y:500},
            debug:false

        }
    },
    scene:[loadGame,startGame]
}
export const game = new Phaser.Game(config)