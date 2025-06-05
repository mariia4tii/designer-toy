import { makeAutoObservable } from "mobx";
import { $authHost } from "../http/index"; // Импортируем авторизованный хост

 class BasketStore {
    constructor() {
        this._basketProducts = []; // Список товаров в корзине
        this._basketId = null; // ID текущей корзины (если используется серверная корзина)
        this._totalItems = 0; // Общее количество товаров в корзине
        this._totalPrice = 0; // Общая сумма корзины
        makeAutoObservable(this); // Автоматическая настройка MobX реактивности
    }

    // === Actions ===
    setBasketProducts(products) {
        this._basketProducts = products;
        this.updateTotals();
    }
    setTotalQuantity(total_quantity) {
        this._totalItems = total_quantity
    }
    setTotalSum(total_sum) {
        this._totalPrice = total_sum
    }
    setBasketId(id) {
        this._basketId = id;
    }

    addProduct(product) {
        const existingProduct = this._basketProducts.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this._basketProducts.push({ ...product, quantity: 1 });
        }
        this.updateTotals();
    }

    updateProductQuantity(productId, quantity) {
        const product = this._basketProducts.find(p => p.id === productId);
        if (product) {
            product.quantity = quantity;
            if (product.quantity <= 0) {
                this.removeProduct(productId);
            } else {
                this.updateTotals();
            }
        }
    }

    removeProduct(productId) {
        this._basketProducts = this._basketProducts.filter(p => p.id !== productId);
        this.updateTotals();
    }

    clearBasket() {
        this._basketProducts = [];
        this._basketId = null;
        this.updateTotals();
    }

    updateTotals() {
        this._totalItems = this._basketProducts.reduce((sum, p) => sum + p.ct, 0);
        this._totalPrice = this._basketProducts.reduce((sum, p) => sum + p.ct * p.product_price, 0);
    }
    

    // Метод для получения корзины
    async fetchBasket() {
        try {
            const userId = localStorage.getItem('id')
            const { data } = await $authHost.get(`api/basket/${userId}`); // Используем авторизованный запрос
            this.setBasketProducts(data.products.map(p => ({
                ...p,
                ct: Number(p.ct),
                product_price: Number(p.product_price)
            })));
            
            this.setTotalQuantity(data.total_quantity);
            this.setTotalSum(data.total_sum);
            this.setBasketId(data.userId); // Устанавливаем ID корзины
        } catch (error) {
            console.error("Failed to fetch basket:", error);
        }
    }

    // === Getters ===
    get basketProducts() {
        return this._basketProducts;
    }

    get basketId() {
        return this._basketId;
    }

    get totalItems() {
        return this._totalItems;
    }

    get totalPrice() {
        return this._totalPrice;
    }
}

const basketStore = new BasketStore();
export default basketStore;
