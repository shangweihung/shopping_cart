const Check = require('../../service/member_check');
const verify = require('../../models/member/verification_model');
const orderProductListData = require('../../models/order/order_all_product_model');
const updateOrderData = require('../../models/order/update_model');

check =  new Check();

module.exports = class ModifyOrder {
    // Book All Order
    postOrderAllProduct(req, res, next){
        const token = req.headers['token'];
        
        if (check.checkNull(token) === true){
            res.json({
                err: "請輸入token！"
            })
        } else if (check.checkNull(token) === false){
            verify(token).then(tokenResult =>{
                if (tokenResult === false){
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })    
                } else {
                    const orderList = {
                        memberID: tokenResult,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        orderDate: onTime(),
                    }
                    orderProductListData(orderList).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }

    // Edit Order
    updateOrderProduct(req, res, next) {
        const token = req.headers['token'];
        
        if (check.checkNull(token) === true){
            res.json({
                err: "請輸入token！"
            })
        } else if (check.checkNull(token) === false){
            verify(token).then(tokenResult =>{
                if (tokenResult === false){
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })    
                } else {
                    const updateList = {
                        memberID: tokenResult,
                        productID: req.body.productID,
                        orderID: req.body.orderID,
                        quantity: req.body.quantity,
                        updateDate: onTime(),
                    }

                    updateOrderData(updateList).then(result =>{
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
}


const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}