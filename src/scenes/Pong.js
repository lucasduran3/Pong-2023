import Phaser from "phaser";
import Racket  from "../components/Racket";
import Ball from "../components/Ball";
import events from "./EventCenter";

export default class Pong extends Phaser.Scene{
    constructor(){
        super("pong");
        this.level = 1;
        this.score = 0;
        this.obstacles = [];
        this.racket = null;
        this.velocityRacket = 0;
        this.velocityBall = 0;
    }

    init(data){
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.velocityRacket = data.velocityRacket || 300;
        this.velocityBall  = data.velocityBall || 200;
    }

    create(){
        this.scene.launch("ui",{
            level : this.level,
            score : this.score
        });

        this.racket = new Racket(
            this,
            400,
            550,
            100,
            20,
            0xffffff,
            this.velocityRacket
        );

        this.ball = new Ball(
            this,
            400,
            300,
            10,
            0xffffff,
            this.velocityBall
        );

        this.physics.add.collider(this.racket, this.ball, this.hit, null, this);

        this.obstacles.forEach((obstacle) =>{
            const o  = this.add.rectangle(
            obstacle.x,
            obstacle.y,
            obstacle.w,
            obstacle.h,
            0xffffff
            );
            this.physics.add.existing(o);
            o.body.setImmovable(true);
            this.physics.add.collider(this.ball, o)
        });
    }

    update(){
        this.racket.update();
    }

    hit(){
        this.score += 1;
        events.emit("update",{
            level : this.level,
            score : this.score,
        });

        if(this.score === 3){
            this.nextLevel();
        }

        this.ball.setColor();
    }

    nextLevel(){
        this.addObstacle();

        this.scene.start("pong",{
            level : this.level + 1,
            score : 0,
            velocityBall : this.velocityBall * 1.1,
            velocityRacket : this.velocityRacket + 50,
            obstacles : this.obstacles,
        });
    }

    addObstacle(){
        let overlapping = true;
        let obstacleToAdd;

        while(overlapping){
            const newObstacle = {
                x : Phaser.Math.Between(100,700),
                y : Phaser.Math.Between(0,400),
                w: Phaser.Math.Between(50,100),
                h: Phaser.Math.Between(20,40),
            };
        

        overlapping = this.obstacles.some((obstacle) => (
            newObstacle.x < obstacle.x + obstacle.w &&
            newObstacle.x + newObstacle.w > obstacle.x &&
            newObstacle.y < obstacle.y + obstacle.h &&
            newObstacle.y + newObstacle.h > obstacle.y
          ));
        if (!overlapping) obstacleToAdd = newObstacle;
        }
        console.log("obstacleToAdd", obstacleToAdd);
        this.obstacles.push(obstacleToAdd);
        console.table(this.obstacles);
    }
}