import BasePage from './BasePage';

class Monitor extends BasePage {
  monitorbtn = '[onclick="byCat(\'monitor\')"]';
  monitor1 = '.card-title a';
  m1price = '.card-block h5';
  monitor2 = '.card-title a';
  m2price = '.card-block h5';

  isMonitorDisplayed() {
    this.clickElement(this.monitorbtn);
    this.assertVisible(this.monitor1, 'Apple monitor 24');
    this.assertVisible(this.m1price, '$400');
    this.assertVisible(this.monitor2, 'ASUS Full HD');
    this.assertVisible(this.m2price, '$230');
  }

  ValidateMonitor1(data) {
    this.assertText(this.monitor1, data);
  }

  Validatemonitor1Price(data) {
    this.assertText(this.m1price, data);
  }

  ValidateMonitor2(data) {
    this.assertText(this.monitor2, data);
  }

  Validatemonitor2Price(data) {
    this.assertText(this.m2price, data);
  }
}

export default Monitor;