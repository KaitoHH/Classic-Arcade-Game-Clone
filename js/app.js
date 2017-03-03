"use strict";
var NUM_ROWS = 6,
    NUM_COLS = 5;
var Entity = function(col, row, resource) {
    this.x = 0;
    this.y = 0;
    this.col = col;
    this.row = row;
    this.sprite = resource;
}

Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Entity.prototype.updateXY = function() {
    this.x = this.col * 101;
    this.y = this.row * 83 - 20;
}

// 这是我们的玩家要躲避的敌人
var Enemy = function(col, row, velocity) {
    Entity.call(this, col, row, 'images/enemy-bug.png');
    this.velocity = velocity;
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;
// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.col += this.velocity * dt;
    if (this.col > NUM_COLS)
        this.col = -1;
    this.updateXY();
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    // The initial position of player is at middle bottom of the ground.
    Entity.call(this, 2, 5, 'images/char-boy.png');
    this.score = 0;
}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

//when player is hit by an enemy, this function will be invoked
Player.prototype.resetPosition = function() {
    player.col = 2;
    player.row = 5;
}
Player.prototype.update = function() {
    this.updateXY();
}

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.col > 0)
                this.col--;
            break;
        case 'up':
            if (this.row > 0)
                this.row--;
            // player reached the top of the ground.
            if (this.row == 0) {
                this.score++;
                // reset the position
                this.row = NUM_ROWS - 1;
            }
            break;
        case 'right':
            if (this.col < NUM_COLS - 1)
                this.col++;
            break;
        case 'down':
            if (this.row < NUM_ROWS - 1)
                this.row++;
            break;
    }
}

var loadEnemies = function(enemyArray) {
    var enemiesInfo = [
        [-1, 1, 2],
        [-1, 2, 2.3],
        [-1, 3, 3.9],
        [2, 2, 2.6],
        [3, 3, 1.3],
        [1, 1, 4.1]
    ];
    enemiesInfo.forEach(function(parm) {
        enemyArray.push(new Enemy(parm[0], parm[1], parm[2]));
    });
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [];
loadEnemies(allEnemies);
var player = new Player();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
