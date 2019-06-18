const request = require('request-promise-native');

let Service, Characteristic;

const BASE_URL = 'https://api.nature.global';

module.exports = homebridge => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory(
    'homebridge-nature-remo-lights',
    'NatureRemoLightDevice',
    NatureRemoLightDevice
  );
};

class NatureRemoLightDevice {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;

    if (api) {
      this.api = api;
      this.api.on('didFinishLaunching', () => {
        this.log('DidFinishLaunching');
      });
    }
  }

  getServices() {
    const informationService = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Manufacturer, 'Nature, Inc.')
      .setCharacteristic(Characteristic.Model, 'NatureRemo')
      .setCharacteristic(Characteristic.SerialNumber, 'nature-remo');

    const lightBulb = new Service.Lightbulb(this.config.name);
    lightBulb
      .getCharacteristic(Characteristic.On)
      .on('get', this.getOnCharacteristicHandler.bind(this))
      .on('set', this.setOnCharacteristicHandler.bind(this));

    return [informationService, lightBulb];
  }

  async getOnCharacteristicHandler(callback) {
    const options = {
      url: `${BASE_URL}/1/appliances`,
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
    };
    let state = false;
    try {
      const responses = await request(options);
      const device = JSON.parse(responses).filter(
        res => res.id === this.config.id
      )[0];
      state = device.light.state.power === 'on';
    } catch (e) {
      this.log(e);
    }
    callback(null, state);
  }

  async setOnCharacteristicHandler(value, callback) {
    const options = {
      method: 'POST',
      url: `${BASE_URL}/1/appliances/${this.config.id}/light`,
      form: {
        button: value ? 'on' : 'off',
      },
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
    };
    await request(options);
    callback(null);
  }
}
