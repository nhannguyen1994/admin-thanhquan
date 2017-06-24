const { db, } = require('../pgp');
const Order = require('../models/order.js');
const PriceConverter = require('../models/priceConvert');
const shortid = require('shortid');
const order = new Order(db);;
// const nodemailer = require('nodemailer')

module.exports = function (express) {
    const router = express.Router();

    // display list of orders 
    // lấy tất cả các giá trị trong đơn hàng rồi render trang đơn hàng
    router.get('/', (req, res) => {
        order.selectOrder() //lấy tất cả các giá trị trong bảng oders
            .then(data => {
                //console.log(data);
                data.forEach(order => {
                    order.total = PriceConverter(order.total);
                });
                res.render('don-hang.html', {
                    orders: data
                });

            })
    });

    // display a detailed order
    // chỉnh sửa từng sp có trong đơn hàng
    router.get('/edit/:id', (req, res) => {
        let id = req.params.id; // lấy mã sp muốn chọn
        db.task(t => {
            return t.batch([
                order.selectOneOrder(id),   // lấy id trong bảng order
                order.selectDetail(id)      // lấy id trong bảng detailed_order
            ]);
        })
            .then(data => {
                res.render('edit-don-hang.html', {
                    order: data[0],
                    detailed_orders: data[1]
                });
                // console.log data[0];
            });
    });

    // change and save order - update order status
    router.post('/confirm', (req, res) => {
        order.updateOrderStatus(req.body.orders_id) //update lai trạng thái bang order
         .then(data => {
             let bill_id = shortid.generate();
            order.createBill(bill_id, data.user_id, data.quantity, data.status, data.total, data.method);
                res.redirect('/don-hang');
            })
    });

    // delete order
    // router.get('/delete/:id', (req,res) => {
    //     delete order[item];
    //     let id = req.params.id;
    //     let order_insert = {
    //         session_user_id: idClient,
    //         product_id: item
    //     }
    //     db.none('DELETE FROM orders WHERE session_user_id=${session_user_id} AND product_id=${product_id}', order_insert)
    //     .then (() => {
    //         console.log('orders: Delete success');
    //     })
    //     .catch(error => {
    //         res.json ({
    //             success: false,
    //             error: error.message || error
    //         });
    //     });
        
    // })


    // hoa-don
    router.get('/hoa-don', (req, res) => {
        // // create reusable transporter object using the default SMTP transport
        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     authu: {
        //         user: 'nhank57tha@gmail.com',
        //         pass: 'nhannguyen1994'
        //     }
        // });
        // let mailOptions = {
        //     from: '"Nhan Nguyễn" <nhank57tha@gmail.com', // địa chỉ gửi
        //     to:'nhank57tha@gmail.com',
        //     subject: 'Thanh toán hóa đơn',
        //     html: 'aa'
        // };
        // transporter.sendMail(mailOptions, error, infor) => {
        //     if (error) {
        //         return console.log(error);
        //     }
        //     console.log('message %s sent: %s', infor.messageId, infor.respon);
        // });

            //
            order.selectBill() // lấy tất cả các giá trị trong hóa đơn
            .then(data => {
                data.forEach(bill => {
                    bill.total_revenue = PriceConverter(bill.total_revenue); // converter lại giá tổng doanh thu
                });
                res.render('hoa-don.html', {
                    bills: data
                });
            })
    });

    // display a detailed bill
     router.get('/edit/:id', (req, res) => {
         let id = req.params.id;
        db.task(t => {
             return t.batch([
                order.selectOneBill(id),
                order.selectDetail1(id)
             ]);
         })
             .then(data => {
                 res.render('edit-hoa-don.html', {
                    bill: data[0],
                 detailed_bill: data[1]
             });
            });
     });



    return router;
};