// ORDER MODEL CLASS

class Order {
    constructor (db) {
        this.db = db;
    }

    selectOrder () {
        return this.db.any("SELECT * FROM orders");
    }
    selectBill () {
        return this.db.any("SELECT * FROM bill");
    }

    selectOneOrder (id) {
        return this.db.oneOrNone("SELECT * FROM orders WHERE orders_id = $1", id);
    }

    selectDetail (id) {
        return this.db.any("SELECT * FROM detailed_orders WHERE orders_id = $1", id);
    }

    updateOrderStatus (id) {
        return this.db.one("UPDATE orders SET status = 'confirmed' WHERE orders_id = $1 RETURNING user_id, status, quantity, total, method", id);
    }
    createBill(bill_id, user_id, quantity, status, total_revenue, method) {
        return this.db.one(" INSERT INTO bill (bill_id, user_id, quantity, status, founded_date, total_revenue, method) VALUES($1, $2,  $3, $4, (SELECT LOCALTIMESTAMP(0)), $5, $6)",[bill_id, user_id, quantity, status, total_revenue, method]);
    }
    // LẤY DỮ LIỆU TỪ BẢNG HÓA ĐƠN
    // total revenue from order table - tổng doanh thu bán hàng lấy từ bảng hoa don
    countTotalRevenue () {
        return this.db.any("SELECT SUM(total_revenue) FROM bill");
    }
    // count total revenue by month - tính doanh thu hàng tháng 
    countMonthlyRevenue() {
        return this.db.any("SELECT SUM(total_revenue) AS month_revenue, EXTRACT(MONTH FROM founded_date) AS founded_month FROM bill GROUP BY founded_month ORDER BY founded_month");
    }
}

module.exports = Order;