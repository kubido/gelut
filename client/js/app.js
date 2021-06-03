var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var player
var position = { x: 0, y: 0}

function preload() {
  this.load.image('char', '/assets/char.png');

}

function create() {
  player = this.physics.add.sprite(100, 450, 'char').setScale(0.4);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  // player.x = player.x + 400  
}

setInterval(() => {
  console.log(position)
}, 1000);

function update() {

  cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }




}