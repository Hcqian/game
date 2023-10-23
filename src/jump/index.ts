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
        // this.cameras.main.height=config.height-200
      // this.cameras.main.setBounds(-100,-100,500,800)
        let bg = this.add.tileSprite(this.cameras.main.width/2,this.cameras.main.height/2,this.cameras.main.width,this.cameras.main.height,'backgroud')
        let startbutton = this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','Play_01').setInteractive()

       // let test = this.add.sprite(this.cameras.main.width/2,this.cameras.main.height-300,'atlas','bonus2') //火箭

       //let test = this.add.image(this.cameras.main.width/2,this.cameras.main.height-300,'atlas','bonus3') //帽子
     //   let test = this.add.image(this.cameras.main.width/2,this.cameras.main.height-300,'atlas','bonus01') //弹簧伸长
     //    let test = this.add.image(this.cameras.main.width/2,this.cameras.main.height-300,'atlas','bonus0') //弹簧压缩
        //this.add.image(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform1');

        startbutton.on('pointerover',()=>{
            startbutton.setTexture('atlas','Play_02')
            // test.anims.play('bonus2anim')
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
type updateFunc = {key:String,updateFun:Function}
class startGame extends Phaser.Scene{

    public player?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    platforms?:Phaser.Physics.Arcade.StaticGroup
    cursors?:Phaser.Types.Input.Keyboard.CursorKeys
    jumped?:boolean =false
    backgroud?:Phaser.GameObjects.TileSprite
    platformsCollider?:Phaser.Physics.Arcade.Collider
    movePlatCollider?:Phaser.Physics.Arcade.Collider
    oncePlatCollider?:Phaser.Physics.Arcade.Collider
    breakPlatCollider?:Phaser.Physics.Arcade.Collider
    butCollider?:Phaser.Physics.Arcade.Collider
    prePlat?:Phaser.Types.Physics.Arcade.SpriteWithStaticBody

    // updateFuncs?:updateFunc[]
    updateFuncs?:Array<updateFunc> = new Array<updateFunc>()
    breakplats?:Phaser.Physics.Arcade.Group
    moveplats?:Phaser.Physics.Arcade.Group
    onceplats?:Phaser.Physics.Arcade.Group
    rockets?:Phaser.Physics.Arcade.Group
    enemyGroup?:Phaser.Physics.Arcade.StaticGroup



    over:boolean = false

    constructor() {
        super('startGame');
    }

    create(data: { backgroud:Phaser.GameObjects.TileSprite }){
        // this.cameras.main.setSize(500,650)
        //this.cameras.main.setBounds(0,200,500,1000)
        this.backgroud = data.backgroud
        this.player = this.physics.add.sprite(this.cameras.main.width/2,this.cameras.main.height-200,'player').setScale(0.5,0.5)
        this.player.parentContainer = this.add.container()
        // let container = this.add.container();
        // this.player = this.physics.add.sprite(0,0,'player').setScale(0.5,0.5)
        // container.add(this.player)
        this.player.setCollideWorldBounds(true)
        this.jumped = false;
        this.platforms = this.physics.add.staticGroup()
        this.moveplats = this.physics.add.group()
        this.rockets = this.physics.add.group({
            allowGravity: false
        })
        this.onceplats = this.physics.add.group()
        this.breakplats =this.physics.add.group({
            allowGravity: false
        })
        this.enemyGroup = this.physics.add.staticGroup()

        this.platforms.create(this.cameras.main.width/2,this.cameras.main.height-150,'atlas','platform0');
        this.addCollider()

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.add.image(320,50,'atlas','top').setDepth(99)
        this.add.image(320,this.cameras.main.height,'atlas','bottom').setDepth(100)


        this.addPlatform()
        this.addAnims()
    }

    private addPlatform(){
        this.prePlat = <Phaser.Types.Physics.Arcade.SpriteWithStaticBody>this.platforms!.getChildren()[this.platforms!.getLength()-1]
        for(let i = 0; i < 5; i++){
            let randompoint = this.randomCycleDirct(170,220,{x:this.prePlat!.x,y:this.prePlat!.y})
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
        this.anims.create({// 火箭喷射
            key: 'bonus2anim',
            frames:this.anims.generateFrameNames('atlas',{
                prefix:'bonus2anim_',
                start:1,
                end:10,
                zeroPad:2
            }),
            frameRate:10,
            repeat:0
        })

    }

    private createRocket(x:number,y:number){
        // let test = this.physics.add.staticSprite(x,y,'atlas','bonus2') //火箭
        let test = this.physics.add.sprite(x,y,'atlas','bonus2').setScale(0.5,0.5)//火箭
        this.rockets!.add(test)
        test.setImmovable(true)
    }
    private addCollider(){

        this.platformsCollider = this.physics.add.collider(this.player!,this.platforms!)
        this.movePlatCollider = this.physics.add.collider(this.player!,this.moveplats!)
        this.oncePlatCollider = this.physics.add.collider(this.player!,this.onceplats!)
        this.breakPlatCollider = this.physics.add.collider(this.player!,this.breakplats!,()=>{},(object1, object2)=>{
            let sprite = <Phaser.Physics.Arcade.Sprite> object2;
            (sprite.body as Phaser.Physics.Arcade.Body).allowGravity = true
            sprite!.anims.play('platformSheet')
            return false
        })
        this.butCollider = this.physics.add.collider(this.player!,this.enemyGroup!,()=>{
            this.gameOver()
        })
        let collider = this.physics.add.collider(this.player!,this.rockets!,(object1, object2)=>{
            let sprite = <Phaser.Physics.Arcade.Sprite> object2;
            sprite!.anims.play('bonus2anim')
            sprite.on('animationcomplete',()=>{
                (sprite.body as Phaser.Physics.Arcade.Body).allowGravity = true;
                (this.player!.body as Phaser.Physics.Arcade.Body).allowGravity = true
                this.updateFuncs = this.updateFuncs!.filter(f=>f.key !='rocketUpdate')
                collider.active = true
            },this)
            let update:updateFunc = {key:'rocketUpdate',updateFun:()=>{
                sprite.y=this.player!.y
                if( this.player!.flipX){
                    sprite.x=this.player!.x+20
                    sprite!.flipX =false
                }else {
                    sprite.x=this.player!.x-20
                    sprite!.flipX =true
                }
                (this.player!.body as Phaser.Physics.Arcade.Body).allowGravity = false
                this.scroll(10)
            }}
            this.updateFuncs?.push(update)
            collider.active =false
            return false
        })
    }


    private scroll(y:number){
        this.moveplats!.incY(y)
        this.backgroud!.tilePositionY -= y
        for (let i = this.rockets!.getChildren().length -1; i >= 0 ; i--) {
            let child =<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> this.rockets!.getChildren()[i]
            child.y+=y
            if(child.body!.y>750){
                this.rockets!.remove(child)
                child.destroy()
            }
        }
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
            this.player!.y += Math.min(this.flag,10)
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
        randompoint = this.randomCycleDirct(170,220,{x:x,y:y})
        this.createRocket(x,y-30)
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
        this.updateFuncs?.forEach(v=> v.updateFun())
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
            this.changeCollider(false)

        }else {
            if (!this.platformsCollider!.active && this.player!.body.velocity.y > 0) {//跳跃过程中，防止上方触碰平台
                this.changeCollider(true)
            }
        }
    }

    changeCollider(isActive:boolean){
        this.platformsCollider!.active = isActive
        this.movePlatCollider!.active = isActive
        this.oncePlatCollider!.active = isActive
        this.breakPlatCollider!.active = isActive

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