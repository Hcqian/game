import Phaser from 'phaser'


class MainScene extends Phaser.Scene{

    constructor() {
        super("MainScene");
    }

    preload(){
        this.load.image('background', "assets/bg.png");
        this.load.image('btnStart', 'assets/btn-start.png');
      //  this.load.image('btnRestart', 'assets/btn-restart.png');
        this.load.image('logo', 'assets/logo.png');
       // this.load.image('btnTryagain', 'assets/btn-tryagain.png');
    }

    create(){
        let width:number = this.scale.width
        let height:number = this.scale.height

        //添加背景图
        let tilingSprite = this.add.tileSprite(0,0,width,height,'background')
        tilingSprite.setOrigin(0) //如果不加会把tilingSprite的中电放到0,0
       // tilingSprite.setTileScale(1, 1)
       // tilingSprite.setTilePosition(0, 0)
        //添加logo
        let logo = this.add.image(0,0,'logo').setOrigin(0)
        logo.setPosition((width- logo.width) / 2, (height - logo.height) / 2 - 50)

        //添加开始按钮
        let startBtn = this.add.image(0,0,'btnStart').setOrigin(0);
        startBtn.setPosition((width-startBtn.width)/2,(height-startBtn.height)/2+100)
        startBtn.setInteractive();
        startBtn.on('pointerdown',()=>{
        //    console.log("game start")
            this.scene.start('PlayScene');//切换sence
        })


    }

}
interface SquareObj {value:number,container:Phaser.GameObjects.Container}
class PlayScene extends Phaser.Scene{

    colors:{ [index: number]: number }  = {
        2: 0x49B4B4,
        4: 0x4DB574,
        8: 0x78B450,
        16: 0xC4C362,
        32: 0xCEA346,
        64: 0xDD8758,
        128: 0xBF71B3,
        256: 0x9F71BF,
        512: 0x7183BF,
        1024: 0x71BFAF,
        2048: 0xFF7C80
    };
    gameAreaBack?:Phaser.GameObjects.Graphics

    squareArray:SquareObj[][]=[]

    moveTimes:number = 0
    keyup:boolean = true

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys


    constructor() {
        super("PlayScene"); //Scene名称
    }

    preload(){
        console.log("this is PlaySence")
        this.load.image('background', "assets/bg.png");
        this.load.image('btnRestart', 'assets/btn-restart.png');
        this.load.image('btnTryagain', 'assets/btn-tryagain.png');

    }
    create(){
        let width:number = this.scale.width
        let height:number = this.scale.height

        //添加背景图
        let tilingSprite = this.add.tileSprite(0,0,width,height,'background')
        tilingSprite.setOrigin(0) //如果不加会把tilingSprite的中电放到0,0
        //添加分数
        let scoreTitle = this.add.text(0,5,"SCORE",{font: "bold 16px Arial", color: "#FFFFFF", align: "center"})
        //绘制区域
        this.gameAreaBack = this.add.graphics({x:10,y:100});
        this.gameAreaBack.beginPath()
        this.gameAreaBack.fillStyle(0xffffff,0.5)
        this.gameAreaBack.fillRoundedRect(0,0,220,220,10)
        this.gameAreaBack.closePath()
        // square
        for (let i = 0; i < 4; i++) {
            let tempArray:SquareObj[] = []
            for (let j = 0; j < 4; j++) {
                let g = this.add.container(this.transX(i),this.transY(j))
                let graph = this.add.graphics()
                graph.beginPath()
                graph.fillStyle(this.colors[2])
                graph.fillRoundedRect(0,0,45,45,5)
                graph.closePath()
                g.add(graph)
                let txtValue = this.add.text(22.5,22.5,'2',{ font: "bold 20px Arial", color: "#FFFFFF"}).setOrigin(0.5)
                g.add(txtValue)
                g.visible =false;
                tempArray.push({value :0,container:g})
            }
            this.squareArray.push(tempArray)
        }
        this.genSquare()

        //添加监听事件
      //  this.cursors = this.input.keyboard?.createCursorKeys();
        // upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        // downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        // leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        // rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        this.input.keyboard?.on("keydown",this.keydown,this)

    }
    keydown(e:any){
        console.log(e)
        switch (e.code){
            case "ArrowUp":
//                this.moveSquare(0,1)
               this.moveSquareX(1)
                break;
            case "ArrowDown":
 //               this.moveSquare(0,-1)
               this.moveSquareX(-1)
                break;
            // case "ArrowLeft":
            //     this.moveSquare(1,1)
            //     break;
            // case "ArrowRight":
            //     this.moveSquare(1,-1)
            //     break;
        }
    }
    isNotOutIndex(col:number,row:number){
        return (col>=0) && (row>=0) && (col<4) && (row<4)
    }
    moveSquareX(step:number){
        for (let i = 0; i < 4; i++) {
            let moveIndex:number = step == 1? 0 : 3
            for (let j = 0; j < 4; j++) {
                let relRow = step == 1? j : (4-1)-j
                let currenSquare = this.squareArray[i][moveIndex]
                do{
                    relRow += step
                }
                while (this.isNotOutIndex(i,relRow) && this.squareArray[i][relRow].value ==0)
                if (!this.isNotOutIndex(i,relRow)) break;

                let nextSquare = this.squareArray[i][relRow]
                let value = nextSquare.value
                nextSquare.value = 0
                console.log({curr:currenSquare})
                console.log({next:nextSquare,value:value})
                if(currenSquare.value ==0){
                    this.moveTween(nextSquare,currenSquare,value)
                }else if(currenSquare.value == nextSquare.value){ //
                //    currenSquare.value *=2
                    this.moveTween(nextSquare,currenSquare,value*2)
                    moveIndex += step
//                    this.genTween(currenSquare)
                } else{// 不等
                    currenSquare = this.squareArray[i][moveIndex+1]
                    this.moveTween(nextSquare,currenSquare,value)
                    moveIndex += step
                }

            }
        }


    }
    moveSquare(dirc:number,step:number){
        let isMove =false;
        for (let i = 0; i < 4; i++) {
            let moveIndex:number = step == 1? 0 : 3
            for (let j = 0; j < 4; j++) {
                let relCol , relRow, currenSquare
                if(dirc == 1){
                    relRow = step == 1? i : (4-1)-i
                    relCol = step == 1? j : (4-1)-j
                    currenSquare = this.squareArray[moveIndex][relRow]
                }else {
                    relCol = step == 1? i : (4-1)-i
                    relRow = step == 1? j : (4-1)-j
                    currenSquare = this.squareArray[relCol][moveIndex]
                }
                //合并
              //  let currenSquare = this.squareArray[relCol][relRow]
              //  console.log({i:relCol,j:relRow})
                do{
                    dirc == 1? relCol +=step :relRow += step
                }
                while (this.isNotOutIndex(relCol,relRow) && this.squareArray[relCol][relRow].value ==0)
       //         console.log({i:relCol,j:relRow})
        //        console.log(this.squareArray)
                if (!this.isNotOutIndex(relCol,relRow)) break;
         //       console.log({i:relCol,j:relRow})
         //       console.log(this.squareArray)
                let nextSquare = this.squareArray[relCol][relRow]
                isMove = true

                //移动
                if(currenSquare.value ==0){
                    this.moveTween(nextSquare,currenSquare,nextSquare.value)
                }else
                //合并
                if(currenSquare.value == nextSquare.value){ //
                    currenSquare.value *=2
                    this.updateContainerFace(currenSquare)
                    nextSquare.value = 0
                    nextSquare.container.visible =false
                    isMove = true
                } else{// 不等
                    currenSquare = dirc == 1?this.squareArray[moveIndex+step][relRow]:this.squareArray[relCol][moveIndex+step]
                    this.moveTween(nextSquare,currenSquare,nextSquare.value)
                }
                moveIndex += step

            }
        }
      //  if(isMove) this.genSquare()
    }
    moveTween(from:SquareObj,to:SquareObj,value:number){
        this.moveTimes ++
        this.tweens.add({
            targets:from.container,
            duration:1000,
            x:to.container.x,
            y:to.container.y,
            ease:'Linear',
            onComplete:()=>{
                to.value = value
                this.updateContainerFace(to)
                from.container.visible =false
                this.moveTimes--
                if(this.moveTimes == 0){
                    this.genSquare()
                }
            }
        })

    }
    genTween(target:SquareObj){
        this.tweens.add({
            targets: target.container,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 200,
            yoyo: true,
            ease:'Quad.easeOut',
            repeat: 1
        })

    }
    updateContainerFace(s:SquareObj){
        let g = s.container.getAt<Phaser.GameObjects.Graphics>(0)
        g.clear()
        g.beginPath()
        g.fillStyle(this.colors[s.value])
        g.fillRoundedRect(0,0,45,45,5)
        g.closePath()
        s.container.getAt<Phaser.GameObjects.Text>(1).text = ''+s.value
        s.container.visible =true
    }
    isFullSquare():boolean{
        for (const sa of this.squareArray) {
            for (const s of sa) {
                if (s.value == 0)
                    return false
            }
        }
        return true
    }
    private genSquare(){
        let x=0,y=0
        if(this.isFullSquare()) return
        do{
            x = Math.floor(Math.random()*4)
            y = Math.floor(Math.random()*4)

        }while (this.squareArray[x][y].value !=0 )

        // console.log(this.squareArray[x][y].value)
        // console.log(this.squareArray[x])
        // console.log({x:x,y:y})
        // console.log(this.squareArray)
        let value = 2;
        if(Math.random() > 0.5) {
            value = 4;
        }
        this.squareArray[x][y].value= value
        this.updateContainerFace(this.squareArray[x][y])
        this.genTween(this.squareArray[x][y])
    }
    private transX(x:number){
        // return 10+8*(1+x)+45*x+45/2;
        return 10+8*(1+x)+45*x;
    }

    private transY(y:number){
        // return 100+8*(1+y)+45*y+45/2;
        return 100+8*(1+y)+45*y;
    }
    update(time: number, delta: number) {
        super.update(time, delta);
        //console.log(this.cursors)


    }
}


const config:Phaser.Types.Core.GameConfig = {
    width:240,
    height:400,
    type:Phaser.AUTO,
    scene:PlayScene
}

export const game = new Phaser.Game(config)


