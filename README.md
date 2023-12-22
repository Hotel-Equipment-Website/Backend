
# Public Routes
#### Login
```
POST http://localhost:3001/login

{
    "username": "admin",
    "password": "Aww@3#44lk"
}

```
#### Get All Categories
```
GET http://localhost:3001/categories
```
#### Get CategorY By Id
```
GET http://localhost:3001/category/:id
```
#### Get All Items
```
GET http://localhost:3001/items
```
#### Get Item By Id
```
GET http://localhost:3001/item/:id
```
#### Get Items By Category Id
```
GET http://localhost:3001/category/:id/items
```
#### Get Image
```
GET http://localhost:3001/images/:name
```

# Privet Routes
- All Privet Routes Need Authorization Header
- Example:
```
const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}

const data = {
    "name": "Category Name"
}

axios.post('/uri, data, config)
.then(res => {
    console.log(res)
})
.catch(err => {
    console.log(err)
})
```

#### Create Category (User Form Data)
```
POST http://localhost:3001/category

{
    "name": "Category Name",
    "images": "image.jpg"
}
```

#### Update Category (User Form Data)
```
PATCH http://localhost:3001/category

{
    "category_id": 1,
    "category_name": "catrgory 005"
    "images": "image.jpg"
}
```

#### Delete Category
```
DELETE http://localhost:3001/category/:id
```

#### Create Item
```
POST http://localhost:3001/item (add content type: multipart/form-data)

{
    item_name:      Item 001
    category_id:    9
    model_number:   55415
    brand:          Singer
    description:    This is ample description
}
```
#### Update Item
```
PATCH http://localhost:3001/item/:id (add content type: multipart/form-data)

{
    item_id:        1
    item_name:      Item 0011
    category_id:    94
    model_number:   55415
    brand:          Singer 2
    description:    This is ample description 2
}
```
#### Delete Item
```
DELETE http://localhost:3001/item/:id
```


# Database
### Database Name: his

```
CREATE TABLE category(
	category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name varchar(50) not null,
    image varchar(100)
);

CREATE TABLE item(
	item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name varchar(50) NOT null,
    category_id INT NOT null,
    image varchar(225),
    model_number varchar(25) not null,
    brand varchar(50) not null,
    description varchar(200),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);


CREATE TABLE admin(
    user_id VARCHAR(50) PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
    password VARCHAR(50) not null
);

insert into admin(user_id, username, password) VALUES ('admin001', 'admin', "Aww@3#44lk");

```