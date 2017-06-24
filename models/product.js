// PRODUCT MODEL CLASS

class Product {
    constructor (db) {
        this.db = db;
    }
    // lấy id loại sp, đếm id loại sp trong bảng sp , đồng nhất od loai sp
    countProductType () {
        return this.db.many("SELECT product_type_id, COUNT (product_type_id) FROM product GROUP BY product_type_id");
    }
    // lấy id hãng sản xuất, đếm id hãng sx trong bảng sp  đồng nhất dl id hãng sx sắp xếp id tăng đân
    countManufacturer () {
        return this.db.many("SELECT manufacturer_id, COUNT (manufacturer_id) FROM product GROUP BY manufacturer_id ORDER BY manufacturer_id ASC");
    }
    // count sales volume by manufacturers
    // tính tổng sl bán ra của id hãng sản xuất trong bảng sp
    countSalesByManufacturer () {
        return this.db.many("SELECT manufacturer_id, SUM(sales_volume) FROM product GROUP BY manufacturer_id ORDER BY manufacturer_id ASC");
    }
    // top 10 best-selling products
    // lấy tên, sl bán ra trong bảng sp sawos xếp sl bán ra giảm dần, giới hạn là 10 sp
    selectBestSales () {
        return this.db.many("SELECT product_name, sales_volume FROM product ORDER BY sales_volume DESC LIMIT 10");
    }
    // top 10 products with highest quantity
    // lấy tên, sl trong bảng sp sắp xếp sl giảm dần, giới hạn là 10 sp
    selectMostInStock () {
        return this.db.many("SELECT product_name, quantity FROM product ORDER BY quantity DESC LIMIT 10");
    }
    //lấy id sp, tên, sl bán ra, sl, ngày lưu sắp xếp giảm dần, trong đó id sp trong bảng sp phải có sl lớn hơn hoặc =15 sắp xếp theo ngày lưu tăng gần,giới hạn là 10)
    selectOldestStock () {
        return this.db.many("SELECT product_id, product_type_id, product_name, sales_volume, quantity, store_day FROM product WHERE product_id IN (SELECT product_id FROM product where quantity >= 15 ORDER BY store_day ASC LIMIT 10) ORDER BY quantity DESC");
    }
    // total sales_volume
    countTotalSales () {
        return this.db.any("SELECT SUM (sales_volume) FROM product");
    }
    // show all products
    selectByPagination(n, pgfrom) {
        return this.db.many("SELECT * FROM product ORDER BY product_id DESC LIMIT $1 OFFSET $2", [n, pgfrom]);
    }
    // đếm tất cả trong bảng sp với id loại sp là điện thoại
    countAll() {
        return this.db.many("SELECT count(*) FROM product WHERE product_type_id = 'ptdt'");
    }
    //lấy tất cả gtri trong bảng sp với id sp dk trả về
    detail(id) {
        return this.db.oneOrNone("SELECT * FROM product WHERE product_id = $1", id);
    }
    // special function to get products in shopping cart (including phones and accessories)
    cartIDs(ids) {
        return this.db.any("SELECT product_id, product_type_id, product_name, price FROM product WHERE product_id IN (" + ids + ")");
    }
    findByName(name) {
        return this.db.any("SELECT * FROM product WHERE product_type_id = 'ptdt' AND product_name ILIKE '%$1#%'", name);
    }
    selectHot(max) {
        return this.db.many("SELECT * FROM product WHERE product_type_id = 'ptdt' ORDER BY sales_volume DESC LIMIT $1", max);
    }
    selectNew(max) {
        return this.db.many("SELECT * FROM product WHERE product_type_id = 'ptdt' ORDER BY store_day DESC LIMIT $1", max);
    }
    //
    selectByManufacturer(name, n, pgfrom) {
        return this.db.any("SELECT * FROM product WHERE product_type_id = 'ptdt' AND manufacturer_id ILIKE $1 LIMIT $2 OFFSET $3", [name, n, pgfrom]);
    }
    countAllByManufacturer(name) {
        return this.db.any("SELECT count(*) FROM product WHERE product_type_id = 'ptdt' AND manufacturer_id ILIKE $1", [name])
    }
    //
    selectByOtherManufacturer(name1, name2, name3, n, pgfrom) {
        return this.db.any("SELECT * FROM product WHERE product_type_id = 'ptdt' AND manufacturer_id NOT ILIKE $1 AND manufacturer_id NOT ILIKE $2 AND manufacturer_id NOT ILIKE $3 LIMIT $4 OFFSET $5", [name1, name2, name3, n, pgfrom]);
    }
    countAllByOtherManufacturer(name1, name2, name3) {
        return this.db.any("SELECT count(*) FROM product WHERE product_type_id = 'ptdt' AND manufacturer_id NOT ILIKE $1 AND manufacturer_id NOT ILIKE $2 AND manufacturer_id NOT ILIKE $3", [name1, name2, name3])
    }
    //
    selectByPriceRange(lowprice, highprice, n, pgfrom) {
        return this.db.any("SELECT * FROM product WHERE product_type_id = 'ptdt' AND price > $1 AND price <= $2 ORDER BY price DESC LIMIT $3 OFFSET $4", [lowprice, highprice, n, pgfrom]);
    }
    countAllByPriceRange(lowprice, highprice) {
        return this.db.any("SELECT count(*) FROM product WHERE product_type_id = 'ptdt' AND price > $1 AND price <= $2", [lowprice, highprice])
    }
    //
    selectByNewest(n, pgfrom) {
        return this.db.many("SELECT * FROM product WHERE product_type_id = 'ptdt' ORDER BY store_day DESC LIMIT $1 OFFSET $2", [n, pgfrom]);
    }
    //
    selectBySales(n, pgfrom) {
        return this.db.many("SELECT * FROM product WHERE product_type_id = 'ptdt' ORDER BY sales_volume DESC LIMIT $1 OFFSET $2", [n, pgfrom]);
    }
    //
    selectByPriceDesc(n, pgfrom) {
        return this.db.many("SELECT * FROM product WHERE product_type_id = 'ptdt' ORDER BY price DESC LIMIT $1 OFFSET $2", [n, pgfrom]);
    }
    selectByPriceAsc(n, pgfrom) {
        return this.db.many("SELECT * FROM product WHERE product_type_id = 'ptdt' ORDER BY price ASC LIMIT $1 OFFSET $2", [n, pgfrom]);
    }
    //
    selectName(id) {
        return this.db.oneOrNone("SELECT product_id, product_name FROM product WHERE product_id = $1", id);
    }

    // main function to handle select products by price or order
    selectByPriceRange2(price, n, pgfrom) {
        switch (price) {
            case 'den5':
                return [
                    this.selectByPriceRange(0, 5000000, n, pgfrom),
                    this.countAllByPriceRange(0, 5000000)
                ];
                break;
            case '5den10':
                return [
                    this.selectByPriceRange(5000000, 10000000, n, pgfrom),
                    this.countAllByPriceRange(5000000, 10000000)
                ];
                break;
            case '10den15':
                return [
                    this.selectByPriceRange(10000000, 15000000, n, pgfrom),
                    this.countAllByPriceRange(10000000, 15000000)
                ];
                break;
            case 'tren15':
                return [
                    this.selectByPriceRange(15000000, 50000000, n, pgfrom),
                    this.countAllByPriceRange(15000000, 50000000)
                ];
        }
    }

    selectByOrder(order, n, pgfrom) {
        switch (order) {
            case 'newest':
                return [
                    this.selectByNewest(n, pgfrom),
                    this.countAll()
                ];
                break;
            case 'hotest':
                return [
                    this.selectBySales(n, pgfrom),
                    this.countAll()
                ];
                break;
            case 'hightolow':
                return [
                    this.selectByPriceDesc(n, pgfrom),
                    this.countAll()
                ];
                break;
            case 'lowtohigh':
                return [
                    this.selectByPriceAsc(n, pgfrom),
                    this.countAll()
                ];
        }
    }


}

module.exports = Product;