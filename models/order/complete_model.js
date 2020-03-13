const db = require('../connection_db');
const config = require('../../config/development_config');
const transporter = require('../connection_mail');

module.exports = function orderComplete(orderID, memberID) {
    let result = {}
    return new Promise(async (resolve, reject) => {
        const existData = await checkOrderData(orderID, memberID);
        const completeOrder = await checkOrderComplete(orderID);
        
        if (existData === false) {
            result.status = "訂單完成失敗。"
            result.err =  "找不到該訂單資料。"
            reject(result)
        } else if (completeOrder === false) {
            result.status = "訂單完成失敗。"
            result.err =  "該筆訂單已完成。"
            reject(result)
        } else if (existData === true && completeOrder === true) {
            const orderData = await getOrderData(orderID, memberID);

            for (let key in orderData) {
                const checkStock = await checkOrderStock(orderData[key].product_id, orderData[key].order_quantity);
                if( checkStock === false) {
                    result.status = "訂單完成失敗"
                    result.err = checkStock
                    reject(result);
                    return;
                }
            }
            
            // Eliminate from product stock database.
            await db.query('UPDATE product, order_list SET product.quantity = product.quantity - order_list.order_quantity WHERE order_list.product_id = product.id AND order_list.order_id = ? ', orderID,
            function (err,rows) {
                if (err){
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後再試!"
                    reject(result);
                    return;
                }
            })

            // Update the status of the order
            await db.query('UPDATE order_list SET is_complete = 1 WHERE order_id = ?', orderID, function (err,rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗"
                    result.err = "伺服器錯誤，請稍後再試"
                    reject(result);
                    return;
                }
            })
            
            // Send mail
            const memberData = await getMemberData(memberID);


            let message = (
                `<p>Hi, ${memberData.name} </p>` + `<br>` + `<br>` + 
                '<table rules="all" style="border: 1px solid #333; font-size:16pt; ">  <col width="250"><col width="80">' + 
                '<thead>' +
                '<th> Product Name </th>' +
                '<th> Quantity </th>'  +
                '</thead>'
            );

            for(let key in orderData) {
                const productInfo = await getProductName(orderData[key].product_id);
                
                message += (
                '<tr>' +
                '<td>' + productInfo.name + '</td>' +
                '<td>' + orderData[key].order_quantity + '</td>' +
                '</tr>' 
                );
            }
            message += '</table><br><br><br>';
            message += '<span>感謝您訂購<b>PonPonChiao購物網</b>的商品，歡迎下次再來！</span>'; 



            const mailOptions = {
                from: `"PonPonChiao購物網" <${config.senderMail.user}>`, 
                to: memberData.email, 
                subject: memberData.name + '您好，您所購買的訂單已經完成。',  
                html: message
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return console.log(err);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            })

            result.status = "訂單編號 " + orderID + " 付款已完成， 謝謝您使用此服務， 詳細訂單資訊已寄送至 " + memberData.email;
            resolve(result);
        }

    })
}

//Get product name 
const getProductName = (productID) => {
    let productInfo ={}
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product WHERE id = ?', productID, function(err, rows) {
            productInfo.name = rows[0].name;
            productInfo.price = rows[0].price;

            resolve(productInfo);
        })
    })
}


// Get member info
const getMemberData = (memberID) => {
    let memberData = {}
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM member WHERE id = ?', memberID, function (err, rows) {
            memberData.email = rows[0].email
            memberData.name = rows[0].name

            resolve(memberData);
        })
    })
}


// Get the order
const getOrderData = (orderID, memberID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID],
        function(err, rows) {
            resolve(rows);
        })
    })
}

// check the stock
const checkOrderStock = (orderProductID, orderQuantity) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product WHERE id = ?', orderProductID, function(err, rows) {
            if(rows[0].quantity >= orderQuantity && rows[0].quantity !== 0){
                resolve(true);
            } else {
                resolve(rows[0].name + "庫存不足");
            }
        })
    })
}



// check the existence of the order
const checkOrderData = (orderID, memberID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? ', [orderID, memberID], function (err, rows) {
            if (rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

// check the status of order
const checkOrderComplete = (orderID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT is_complete FROM order_list WHERE order_id = ?', orderID, function (err, rows) {
            if (rows[0].is_complete === 1) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}