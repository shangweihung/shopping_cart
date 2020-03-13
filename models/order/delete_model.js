
const db = require('../../models/connection_db');

module.exports = function orderDelete(deleteList){
    let result = {}
    return new Promise(async (resolve, reject) => {
        for (let key in deleteList){
            const existData = await checkOrderData(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
            const completeOrder = await checkOrderComplete(deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID);
        
            if ( existData === false) {
                result.status = "刪除訂單資料失敗。"
                result.err =  "找不到該筆資料。"
                reject(err)
            } else if ( completeOrder === false) {
                result.status = "刪除訂單資料失敗。"
                result.err =  "該筆資料已完成。"
                reject(err)
            } else if ( existData === true && completeOrder === true) {
                db.query('DELETE FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', 
                [deleteList[key].orderID, deleteList[key].memberID, deleteList[key].productID], function (err, rows) {
                    if (err) {
                        console.log(err);
                        result.err = "伺服器錯誤，請稍後再試!"
                        reject(result)
                    } 

                    result.status = "刪除訂單資料成功。";
                    result.deleteList = deleteList; 
                    resolve(result);
                });
            }
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
