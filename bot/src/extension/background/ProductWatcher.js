import request from 'browser-request';


export default class ProductWatcher {
  constructor() {
    this.products = {};
    this.lastUpdate = new Date();
  }

  async start() {
    const products = await this.getProducts();
    console.log(products);
  }

  fetchProducts() {
    return new Promise((resolve, reject) => {
      request({ url: 'http://www.supremenewyork.com/mobile_stock.json'}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(JSON.parse(body).products_and_categories);
        } else {
          reject({ error });
        }
      });
    });
  }

  async getProducts(force = false) {
    const now = new Date();
    const diff = (now.getTime() - this.lastUpdate.getTime()) / 1000;

    if (diff >= 10 || !Object.keys(this.products).length || force) {
      this.lastUpdate = now;
      try {
        this.products = await this.fetchProducts();
      } catch (e) {
        return e;
      }
    }
    return this.products;
  }
}
