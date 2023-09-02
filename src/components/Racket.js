import Phaser from "phaser";

export default class Racket extends Phaser.GameObjects.Rectangle{
    constructor(scene, x, y, w, h, color, velocity){
        super(scene, x, y, w, h, color);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.velocity = velocity;
        this.cursor = scene.input.keyboard.createCursorKeys();
    }

    update(){
        if (this.cursor.left.isDown) {
            this.body.setVelocityX(-this.velocity);
          } else if (this.cursor.right.isDown) {
            this.body.setVelocityX(this.velocity);
          } else {
            this.body.setVelocityX(0);
          }
    }
}