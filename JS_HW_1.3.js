class Good {
    constructor (name, description, sizes, price) {
        this.name = name; //Наименование
        this.description = description; //Описание
        this.sizes = sizes; //массив возможных размеров
        this.price = price; //цена товара
        this.available = this.available; //Признак доступности для продажи
    }

    setId(id) {
        this.id = id;
    }

    setAvailable(attribute) {//изменение признака доступности для продажи
        this.available = attribute;
    }
}

class GoodsList {
    #goods = [];
    #goods_number = {};
    constructor () {
        this.filter = new RegExp("","i");
        this.sortPrice = true;
        this.sortDir = false;
    }

    add (...items) {
        for (let item of items) {
            this.index = this.#goods.length;
            item.setId(this.index);
            item.setAvailable(true);
            this.#goods.push(item);
            this.#goods_number[item.id] = this.index;
        }
    }

    remove(id) {
        delete this.#goods[this.#goods_number[id]];
        delete this.#goods_number[id];
    }

    get list() {
        this.temp = this.#goods.filter(good => this.filter.test(good.name))
        if (this.sortPrice) {
            if (this.sortDir) {
                this.temp.sort((item1, item2) => item1.price - item2.price)
            } else {
                this.temp.sort((item1, item2) => item2.price - item1.price)
            }
        }
        return this.temp
    }
}

class BasketGood extends Good {
    constructor (good) {
        super(good.name, good.description, good.sizes, good.price);
        this.id = good.id
        this.amount = 0;
    }

}

class Basket {
    constructor () {
        this.goods = [];
        this.basket_number = {};
    }

    //возвращает общую стоимость товаров в корзине
    get totalAmount() {
        let sum = 0;
        this.goods.forEach(good => {sum += good.amount});
        return sum
    }
     
    //возвращает общее количество товаров в корзине
    get totalSum() {
        return this.goods.reduce((sum, good) => {sum += good.price*good.amount; return sum}, 0)
    }
    
    //Добавляет товар в корзину, если товар уже есть увеличивает количество
    add (good, amount) {
        if (this.basket_number[good.id]) {
            this.goods[this.basket_number[good.id]].amount += amount
        } else {
            good.amount = amount
            let index = this.goods.length;
            this.goods.push(good);
            this.basket_number[good.id] = index;
        }
    }

    //Уменьшает количество товара в корзине, если количество становится равным нулю, товар удаляется
    remove(good, amount) {
        if (this.goods[this.basket_number[good.id]].amount > amount) {
            this.goods[this.basket_number[good.id]].amount -= amount
        } else {
            delete this.goods[this.basket_number[good.id]];
            delete this.basket_numbert[good.id];
        }
    }

    //Очищает содержимое корзины
    clear() {
        this.goods.length = 0;
        this.basket_number = {};
    }

    //Удаляет из корзины товары, имеющие признак available === false
    removeUnavailable() {
        this.goods.forEach((good) => {
            if (good.available === false) {
                delete this.goods[this.basket_number[good.id]];
                delete this.basket_number[good.id];
            }
        });
    }

}

let catalog = new GoodsList();

let sample1 = new Good("Рубашка", 'Одежда', [42, 46, 48], 1500);
let sample2 = new Good("Брюки", 'Одежда', [30, 32, 36], 2500);
let sample3 = new Good("Кроссовки", 'Обувь', [39, 41, 42], 3500);
let sample4 = new Good("Джемпер", 'Одежда', [42, 46, 48], 3600);
let sample5 = new Good("Джинсы", 'Одежда', [29, 32, 34], 5500);


catalog.add(sample5, sample4, sample3, sample2, sample1);

console.log(catalog.list);

let basket_new = new Basket()

basket_new.add(sample2, 3)
basket_new.add(sample3, 7)

console.log(`В корзине: количество товаров - ${basket_new.totalAmount}шт., итоговая сумма - ${basket_new.totalSum}руб.`)

basket_new.remove(sample3, 2)

console.log(`В корзине после редактирования: количество товаров - ${basket_new.totalAmount}шт., итоговая сумма - ${basket_new.totalSum}руб.`)

basket_new.clear()

console.log(`Очистка корзины: количество товаров - ${basket_new.totalAmount}шт., итоговая сумма - ${basket_new.totalSum}руб.`)