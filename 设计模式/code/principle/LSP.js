/****
 * 里式替换原则(Liskov Substitution Principle):
 * 子类在设计的时候，要遵守父类的行为约定。父类定义了函数的行为约定，子类可以改变函数的内部实现逻辑，但不能改变函数原有的
 * 行为约定，其包括：函数声明要实现的功能；对输入、输出、异常的约定以及注释中所罗列的任何特殊说明
 */

// sprint1
class Game {
  start() {}

  shutdown() {}

  play() {}
}

const game = new Game();
game.play();

class MobileGame extends Game {
  tombStore() {}
}
