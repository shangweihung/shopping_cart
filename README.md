# shopping_cart
Extend member system I built before, and use Node.js to build up shopping cart backend.

## Build Setup
```bash
npm install
```
## Development Environment
* Backend: Node.js  
* Backend-framework: Express  
* Database: MySQL  

## Database Schema
#### Member
| Field Name | Null | Key |
| --- | --- | --- |
| id | No | Primary |
| name | No | |
| email | No | |
| password | No | |
| img | Yes | |
| img_name | Yes | |
| update_date | Yes | |
| create_date | No | |

#### Product
| Field Name | Null | Key |
| --- | --- | --- |
| id | No | Primary |
| name | No | |
| price | No | |
| quantity | No | |
| img | Yes | |
| img_name | Yes | |
| remark | Yes | |
| update_date | Yes | |
| create_date | No | |

#### Order List
| Field Name | Null | Key |
| --- | --- | --- |
| order_id | No | Primary |
| member_id | No | Foreign |
| product_id | No | Foreign |
| order_quantity | No | |
| order_price | No | |
| is_complete | No | |
| update_date | Yes | |
| create_date | No | |

## Testing
Use [Postman](https://www.postman.com/)

## Functions
* Member System
  * MemberShip Register
  * Member Login 
  * Update Member Infomation
  * Upload Member Profile Image
* Order List
* Make Order
* Edit Order  
  * Add One Order
  * Edit Order Content
  * Delete Order
* Confirm Order (with confirmation email service)

## Reference
[[link]](https://ithelp.ithome.com.tw/articles/10196334)
