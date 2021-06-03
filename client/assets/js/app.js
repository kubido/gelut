var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
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
var position = { x: 1, y: 0 }
var jumCount = 0
var frameLength = {
  idle: 7,
  run: 9,
  jump: 2,
  attack1: 5,
  attack2: 5,
  attack3: 7,
}

function preload() {
  let basePath = '/assets/sprites/HeroKnight'
  this.load.image('char', '/assets/char.png');
  this.load.image('ground', '/assets/platform.png');
  this.load.image('background', '/assets/bg.png');

  loadAssets = loadAssets.bind(this)
  let assetsList = ["Idle", "Run", "Jump", "Attack1", "Attack2", "Attack3"]
  assetsList.forEach(asset => {
    loadAssets(`hero${asset}`, `${basePath}/${asset}/HeroKnight_${asset}`, frameLength[asset.toLowerCase()])
  })

}

function loadAssets(name, filepath, length) {
  for (let i = 0; i <= length; i++) {
    this.load.image(`${name}_${i}`, `${filepath}_${i}.png`)
  }
}

function generateFrame(name, length,) {
  let frames = []
  for (let i = 0; i <= length; i++) {
    let obj = { key: `${name}_${i}` }
    frames.push(obj)
  }
  return frames
}

function generateAnimationFrame(key, objectName, length, repeat = -1, frameRate = 1.5) {
  this.anims.create({
    key: key,
    frames: generateFrame(objectName, length),
    frameRate: length * frameRate,
    repeat: repeat
  });
}

function create() {
  var bg = this.add.image(0, 0, 'background').setOrigin(0).setScale(0.8);
  // bg.fixedToCamera = true;
  platforms = this.physics.add.staticGroup();
  platforms.create(200, 565, 'ground');
  platforms.create(600, 565, 'ground');
  platforms.setVisible(false)
  generateAnimationFrame = generateAnimationFrame.bind(this)
  generateAnimationFrame("animHeroIdle", "heroIdle", frameLength.idle)
  generateAnimationFrame("animHeroRun", "heroRun", frameLength.run)
  generateAnimationFrame("animHeroJump", "heroJump", frameLength.jump)
  generateAnimationFrame("animHeroAttack1", "heroAttack1", frameLength.attack1, 1)
  generateAnimationFrame("animHeroAttack2", "heroAttack2", frameLength.attack2, 1)
  generateAnimationFrame("animHeroAttack3", "heroAttack3", frameLength.attack3, 1, 3)


  player = this.physics.add.sprite(300, 450, 'heroIdle_0').play('animHeroIdle').setScale(2.5)
  // player = this.physics.add.sprite(100, 450, 'char').setScale(0.4);
  player
    .setBounce(0.2)
    .setCollideWorldBounds(true)
    .setBodySize(28, 52)

  this.physics.add.collider(player, platforms, () => {
    jumCount = 0
  })
  // this.camera.follow(player);

  socket.on('broadcastPost', (payload) => {
    player.x = payload.x
    player.y = payload.y
  })


}


function update() {

  cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown) {
    player.setVelocityX(-200);
    player.flipX = true
    player.anims.play('animHeroRun', true)
    // socket.emit('updatePos', position)
  } else if (cursors.space.isDown) {
    player.anims.play('animHeroAttack3', true)
  } else if (cursors.right.isDown) {
    player.flipX = false
    player.setVelocityX(200);
    // socket.emit('updatePos', position)
    player.anims.play('animHeroRun', true)
  } else {
    player.setVelocityX(0);
    player.anims.play('animHeroIdle', true)
  }


  // player.setVelocityY(200);
  if (cursors.up.isDown) {
    jumCount++
    // console.log('--------->', cursors.up.getDuration());
    if (cursors.up.getDuration() < 120 && jumCount <= 2) {
      player.setVelocityY(-430);
    }
    player.anims.play('animHeroJump', true)
  }



  position = { x: player.x, y: player.y }



}
