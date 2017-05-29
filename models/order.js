// ORDER MODEL CLASS

class Order {
    constructor (db) {
        this.db = db;
    }

    selectOrder () {
        return this.db.any("SELECT * FROM orders");
    }

    selectOneOrder (id) {
        return this.db.oneOrNone("SELECT * FROM orders WHERE orders_id = $1", id);
    }

    selectDetail (id) {
        return this.db.any("SELECT * FROM detailed_orders WHERE orders_id = $1", id);
    }

    updateOrderStatus (id) {
        return this.db.none("UPDATE orders SET status = 'confirmed' WHERE orders_id = $1", id);
    }

}

module.exports = Order;
