const db = require('../connection_db');

module.exports = function orderEdit(updateList){
    let result = {}
    return new Promise(async (resolve, reject) => {
        const existData = await checkOrderData(updateList.orderID, updateList.memberID, updateList.productID);
        const completeOrder = await checkOrderComplete(updateList.orderID, updateList.memberID, updateList.productID);
        
        if (existData === false) {
            result.status = "更新訂單資料失敗。"
            result.err = "沒有該筆資料！"
            reject(result);
        } else if (completeOrder === false){
            result.status = "更新訂單資料失敗。"
            result.err = "該筆資料已完成。"
            reject(result);
        } else if ( existData === true && completeOrder === true){
            const price = await getProductPrice(updateList.productID);
            const updateTotalPrice = price * updateList.quantity;

            await db.query('UPDATE order_list SET order_quantity = ? , order_price = ?, update_date = ? WHERE order_id = ? AND member_id = ? AND product_id = ?', 
            [updateList.quantity, updateTotalPrice, updateList.updateDate, updateList.orderID, updateList.memberID, updateList.productID], 
            function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "更新訂單資料失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }

                result.status = "更新訂單資料成功。"
                result.updateList = updateList
                resolve(result)
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
const checkOrderComplete = function (orderID, memberID, productID){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ? AND is_complete = 0', [orderID, memberID, productID],
        function(err,rows){
            if (rows[0] === undefined){
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
