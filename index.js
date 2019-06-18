const request = require('request-promise-native');

let Accessory, Service, Characteristic, UUIDGen;

const BASE_URL = 'https://api.nature.global';

module.exports = homebridge => {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

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

    this.addAccessories();

    if (api) {
      this.api = api;
      this.api.on('didFinishLaunching', () => {
        this.log('DidFinishLaunching');
      });
    }
  }

  async getLightDevices() {
    const options = {
      url: `${BASE_URL}/1/appliances`,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
    };
    const responses = await request(options);
    return responses.filter(response => response.type === 'LIGHT');
  }

  addAccessory(device) {
    const uuid = UUIDGen.generate(device.nickname);

    const newDevice = new Accessory(device.nickname, uuid);
    newDevice
      .addService(Service.Lightbulb, device.nickname)
      .getCharacteristic(Characteristic.On)
      .on('set', async value => {
        const options = {
          method: 'POST',
          url: `${BASE_URL}/1/appliances/${device.id}/light`,
          form: {
            button: value ? 'on' : 'off',
          },
        };
        await request(options);
      })
      .on('get', async () => {
        const devices = await this.getLightDevices();
        let state = false;
        devices
          .filter(d => d.id === device.id)
          .forEach(d => {
            state = d.light.state.power === 'on';
          });
        return state;
      });
    return newDevice;
  }

  addAccessories() {
    const lightDevices = [];
    this.getLightDevices().then(devices =>
      devices.forEach(device => lightDevices.push(device))
    );

    lightDevices.map(device => this.addAccessory(device));
  }
}
