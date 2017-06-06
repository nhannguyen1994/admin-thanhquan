const { db, } = require('../pgp');
const Order = require('../models/order.js');
const PriceConverter = require('../models/priceConvert');
const shortid = require('shortid');

const order = new Order(db);

module.exports = function (express) {
    const router = express.Router();

    // display list of orders
    router.get('/', (req, res) => {
        order.selectOrder()
            .then(data => {
                //console.log(data);

                data.forEach(order => {
                    order.total = PriceConverter(order.total);
                })
                res.render('don-hang.html', {
                    orders: data
                });

            })
    });

    // display a detailed order
    router.get('/edit/:id', (req, res) => {
        let id = req.params.id;
        db.task(t => {
            return t.batch([
                order.selectOneOrder(id),
                order.selectDetail(id)
            ]);
        })
            .then(data => {
                res.render('edit-don-hang.html', {
                    order: data[0],
                    detailed_orders: data[1]
                });
            });
    });

    // change and save order - update order status
    router.post('/confirm', (req, res) => {
        order.updateOrderStatus(req.body.orders_id)
         .then(data => {
             let bill_id = shortid.generate();
            order.createBill(bill_id, data.user_id, data.quantity, data.status, data.total, data.method);
                res.redirect('/don-hang');
            })
    });

    // delete order


    // hoa-don
    router.get('/hoa-don', (req, res) => {
        order.selectBill()
            .then(data => {
               // db.query("INSERT INTO bill (bill_id, user_id, method, quantity, status, founded_date, total_revenue) VALUES(${bill_id}, ${user_id}, ${quantity}, ${status}, ${founded_date}, ${total_revenue}",);
                res.render('hoa-don.html', {
                    bills: data
                });
            })
    })
    return router;
}