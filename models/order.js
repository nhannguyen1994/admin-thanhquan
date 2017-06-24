// ORDER MODEL CLASS

class Order {
    constructor (db) {
        this.db = db;
    }
    // lấy tất cả các giá trị có trng bảng đơn hàng
    selectOrder () {
        return this.db.any("SELECT * FROM orders");
    }
    // lấy tất cả các giá trị có trng bảng hóa đơn
    selectBill () {
        return this.db.any("SELECT * FROM bill");
    }
    // lấy giá trị trong bảng đơn hàng với id đơn hàng
    selectOneOrder (id) {
        return this.db.oneOrNone("SELECT * FROM orders WHERE orders_id = $1", id);
    }
    // lấy giá trị trong bảng hóa đơn với id hóa đơn
    selectOneBill (id) {
        return this.db.oneOrNone("SELECT * FROM bill WHERE bill_id = $1", id);
    }
    // lấy giá trị trong bảng đơn hàng chi tiết với id đơn hàng
    selectDetail (id) {
        return this.db.any("SELECT * FROM detailed_orders WHERE orders_id = $1", id);
    }
    // lấy giá trị trong bảng hóa đơn chi tiết với id hóa đơn
    selectDetail1 (id) {
        return this.db.any("SELECT * FROM detailed_bill WHERE bill_id = $1", id);
    }
    // cập nhật lại trường trạng thái trong bảng đơn hàng với id hóa đơn, 
    updateOrderStatus (id) {
        return this.db.one("UPDATE orders SET status = 'confirmed' WHERE orders_id = $1 RETURNING user_id, status, quantity, total, method", id);
    }
    // insert các giá trị vào trong bảng hóa đơn với giá trị trả về lần lượt là id hóa đơn, id user, sl, trạng thái, tổng doanh thu và hình thức thanh toán 
    // chú ý: ngày lập hóa đơn sẽ dùng hàm select localtimestamp(0) để k lấy các gtri lẻ đằng sau(chỉ lấy giờ, phút, giây)
    createBill(bill_id, user_id, quantity, status, total_revenue, method) {
        return this.db.one(" INSERT INTO bill (bill_id, user_id, quantity, status, founded_date, total_revenue, method) VALUES($1, $2, $3, $4, (SELECT LOCALTIMESTAMP(0)), $5, $6)",[bill_id, user_id, quantity, status, total_revenue, method]);
    }
    // LẤY DỮ LIỆU TỪ BẢNG HÓA ĐƠN
    // total revenue from order table - tổng doanh thu bán hàng lấy từ bảng hoa don
    countTotalRevenue () {
        return this.db.any("SELECT SUM(total_revenue) FROM bill");
    }
    // count total revenue by month - tính doanh thu hàng tháng 
    //
    countMonthlyRevenue() {
        return this.db.any("SELECT SUM(total_revenue) AS month_revenue, EXTRACT(MONTH FROM founded_date) AS founded_month FROM bill GROUP BY founded_month ORDER BY founded_month");
    }
}

module.exports = Order;