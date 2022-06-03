class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
    this.items.forEach((item) => {
      if (item.name === "Sulfuras" && item.quality !== 80) {
        throw Error("Sulfuras quality has to be 80");
      }
    });
  }

  updateQuality() {
    this.items.forEach((item) => {
      if (item.name === "Sulfuras") return;
      if (item.name === "Aged Brie") {
        this.updateItem(item, 1);
        return;
      }
      if (item.name === "Backstage passes") {
        if (item.sellIn <= 10 && item.sellIn > 5) {
          this.updateItem(item, 2);
          return;
        }
        if (item.sellIn <= 5 && item.sellIn > 1) {
          this.updateItem(item, 3);
          return;
        }
        if (item.sellIn <= 1) {
          item.quality = 0;
          item.sellIn--;
          return;
        }
      }
      if (item.name === "Conjured") {
        this.updateItem(item, -2);
        return;
      }
      //default
      if (item.sellIn <= 0) {
        this.updateItem(item, -2);
      } else {
        this.updateItem(item, -1);
      }
    });

    return this.items;
  }

  updateItem(item, qualityChange) {
    const sum = item.quality + qualityChange;

    if (sum > 50) {
      item.quality = 50;
    }
    if (sum <= 50) {
      item.quality = sum;
    }
    if (sum < 0) {
      item.quality = 0;
    }

    item.sellIn--;
  }
}

module.exports = {
  Item,
  Shop,
};
