const db = require('../connection_db');

module.exports = function getOneOrderData(memberID){
    let result = {};
    return new Promise((resolve, reject) =>{
        db.query('SELECT * FROM order_list WHERE member_id=?', memberID, function(err,rows){
            if (err){
                console.log(err);
                result.status = "取得該會員訂單資料失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }

            resolve(rows);
        })
    })
}