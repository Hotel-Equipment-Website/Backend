const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const {
  CreateCategory,
  GetCategories,
  GetCategoryByID,
  UpdateCategory,
  GetItemsByID,
  GetItemByCategory,
  GetItems,
  CreateItem,
  UpdateItem,
  GetImage,
  Login,
  Authenticate,
  DeleteItem,
  DeleteCategory,
} = require("./Controller.js");

const { PORT } = require("./config/index.js");

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.post("/login", Login);

// Public route
app.get("/items", GetItems);
app.get("/item/:id", GetItemsByID);
app.get("/categories", GetCategories);
app.get("/category/:id/items", GetItemByCategory);
app.get("/category/:id", GetCategoryByID);
app.get("/image/:name", GetImage);

app.use(Authenticate);

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);



// Private route
app.options("*", (req, res) => res.sendStatus(200));
app.post("/item", images, CreateItem);
app.patch("/items/:id", images, UpdateItem);
app.delete("/item/:id", DeleteItem);
app.post("/category", images, CreateCategory);
app.patch("/category/:id", images, UpdateCategory);
app.delete("/category/:id", DeleteCategory);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
