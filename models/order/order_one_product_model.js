const db = require("../connection_db");

module.exports = function postOrderDate(orderOneList){
    let result = {}
    return new Promise( async (resolve, reject) => {
        const existData = await checkOrderData(orderOneList.orderID, orderOneList.memberID, orderOneList.productID);
        const completeOrder = await checkOrderComplete(orderOneList.orderID, orderOneList.memberID, orderOneList.productID);
        
        if ( existData === true) {
            result.status = "新增單筆訂單資料失敗。"
            result.err =  "該筆資料已經存在。"
            reject(err)
        } else if ( completeOrder === false) {
            result.status = "新增單筆訂單資料失敗。"
            result.err =  "該筆資料已完成。"
            reject(err)
        } else if (existData === false && completeOrder === true){
            const price = await getProductPrice(orderOneList.productID);
            const totalPrice = orderOneList.quantity * price;

            const orderList = {
                order_id: orderOneList.orderID,
                member_id: orderOneList.memberID,
                product_id: orderOneList.productID,
                order_quantity: orderOneList.quantity,
                order_price: totalPrice,
                is_complete: 0,
                order_date: orderOneList.createDate
            }

            db.query('INSERT INTO order_list SET ?', orderList, function(err, rows) {
                if (err){
                    console.log(err)
                    result.status = "新增單筆訂單資料失敗。"
                    result.err = "伺服器錯誤，請稍後再試!"
                    reject(result);
                    return;
                }

                result.status = "新增單筆訂單資料成功。"
                result.orderList = orderList;
                resolve(result);
            })
        }
    })
}





// check the existence of order
const checkOrderData = function (orderID, memberID, productID){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', [orderID, memberID, productID], 
        function(err, rows){
            if (rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

// check the status of order
const checkOrderComplete = function (orderID){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ?', orderID,
        function(err,rows){
            if (rows[0].is_complete === 1){
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

// get price of the product
const getProductPrice = (productId)=>{
    return new Promise((resolve, reject) => {
        db.query('SELECT price FROM product where id = ?', productId, function(err, rows, fields){
            if(err){
                console.log(err);
                reject(err);
                return;
            }

            resolve(rows[0].price);
        })
    })
}