const { Shop, Item } = require("../src/gilded_rose");
const fixtures = require("./texttest_fixture.js");

describe("Normally", () => {
  it("Once the sell by date has passed, Quality degrades twice as fast", () => {
    const shop = new Shop([new Item("almostexpired", 0, 10)]);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(8);
    expect(shop.items[0].sellIn).toBe(-1);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(6);
    expect(shop.items[0].sellIn).toBe(-2);
  });

  it("The Quality of an item is never negative", () => {
    const shop = new Shop([new Item("notsonegative", 10, 0)]);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(0);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(0);
  });

  it("At the end of each day our system lowers both values for every item", () => {
    const shop = new Shop([new Item("generic item", 10, 10)]);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(9);
    expect(shop.items[0].sellIn).toBe(9);
  });
  describe("The Quality of an item is never more than 50 and never negative (except Sulfuras)", () => {
    let table = [];
    fixtures.specificItemNames.forEach((item) => {
      if (item === "Sulfuras") return;
      table.push([item, 0, 50]);
      table.push([item, 0, 0]);
    });

    table.push(["Some generic item", 0, 50]);
    table.push(["Some generic item", 0, 0]);

    test.each(table)(
      "item %s, sellIn %i, quality %i",
      (name, sellIn, quality) => {
        const shop = new Shop([new Item(name, sellIn, quality)]);
        shop.updateQuality();
        expect(shop.items[0].quality > 50).toBe(false);
        expect(shop.items[0].quality < 0).toBe(false);
      }
    );
  });
});

describe("Aged Brie", () => {
  it("actually increases in Quality the older it gets", () => {
    const shop = new Shop([new Item("Aged Brie", 10, 0)]);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(1);
  });
});

describe("Sulfuras", () => {
  it("Is a legendary item and as such its Quality is 80 and it never alters", () => {
    const notSoLegendaryItem = [new Item("Sulfuras", 999, 79)];
    expect(() => new Shop(notSoLegendaryItem)).toThrow(Error);
  });

  it("being a legendary item, never has to be sold or decreases in Quality", () => {
    const shop = new Shop([new Item("Sulfuras", 999, 80)]);
    shop.updateQuality();
    expect(shop.items[0].sellIn).toBe(999);
    expect(shop.items[0].quality).toBe(80);
  });
});

describe('"Backstage passes", like aged brie, increases in Quality as its SellIn value approaches:', () => {
  let shop = new Shop([new Item("Backstage passes", 10, 2)]);
  it("Quality increases by 2 when there are 10 days", () => {
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(4);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(6);
  });
  it("and by 3 when there are 5 days or less", () => {
    shop = new Shop([new Item("Backstage passes", 5, 2)]);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(5);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(8);
  });
  it("but Quality drops to 0 after the concert", () => {
    shop = new Shop([new Item("Backstage passes", 1, 10)]);
    expect(shop.items[0].quality).toBe(10);
    expect(shop.items[0].sellIn).toBe(1);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(0);
    expect(shop.items[0].sellIn).toBe(0);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(0);
    expect(shop.items[0].sellIn).toBe(-1);
  });
});

describe("Conjured", () => {
  it("items degrade in Quality twice as fast as normal items", () => {
    const shop = new Shop([new Item("Conjured", 10, 10)]);
    shop.updateQuality();
    expect(shop.items[0].quality).toBe(8);
  });
});
