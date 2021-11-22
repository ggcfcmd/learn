class Park {
  static LEVEL1_ALLOW_PARK_COUNT = 100;
  static LEVEL2_ALLOW_PARK_COUNT = 100;
  static LEVEL3_ALLOW_PARK_COUNT = 100;

  constructor(name) {
    this.name = name;
    this.parkInTime = null;
    this.parkOutTime = null;
  }

  changeLevelParkCount(level, action) {
    if (action === "in") {
      Park[`LEVEL${level}_ALLOW_PARK_COUNT`]--;
    } else if (action === "out") {
      Park[`LEVEL${level}_ALLOW_PARK_COUNT`]++;
    }
  }

  canPark() {
    if (Park.LEVEL1_ALLOW_PARK_COUNT) {
      return 1;
    } else if (Park.LEVEL2_ALLOW_PARK_COUNT) {
      return 2;
    } else if (Park.LEVEL3_ALLOW_PARK_COUNT) {
      return 3;
    }
    return -1;
  }

  parkIn() {
    const res = this.canPark();
    if (res < 0) {
      console.log("current park already full");
      return;
    }
    this.level = res;
    this.parkInTime = new Date();
    this.changeLevelParkCount(this.level, "in");
  }

  parkOut() {
    this.parkOutTime = new Date();
    this.changeLevelParkCount(this.level, "out");
    console.log(
      `leave car name: ${this.name}, park time: ${
        this.parkOutTime - this.parkInTime
      }s`
    );
  }
}

const instance = new Park("shenzn");
instance.parkIn();
setTimeout(() => {
  instance.parkOut();
}, 2000);
