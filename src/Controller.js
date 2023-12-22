const { db } = require("./config/DB.js");
const jwt = require("jsonwebtoken");
const path = require("path");
const { SEC_KEY } = require("./config/index.js");

const GenerateSignature = async (payload) => {
  return jwt.sign(payload, SEC_KEY, { expiresIn: "90d" });
};

const ValidateSignature = async (req) => {
  const signature = req.get("Authorization");
  if (signature) {
    try {
      const payload = await jwt.verify(signature.split(" ")[1], SEC_KEY);
      req.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
};

const Login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      message: "require username and password",
      field: ["username", "password"],
    });

  const sql = `SELECT * FROM admin where username='${username}' and password='${password}'`;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).send("Database error");
    }

    if (results.length > 0) {
      const payload = {
        user_id: results[0].admin_id,
        username: results[0].username,
        password: results[0].password,
      };
      const token = GenerateSignature(payload);
      token
        .then((token) => {
          return res.status(200).json({ message: "success", token });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "failed" });
        });
    }
    else {
      return res.status(400).json({ message: "failed" });
    }
  });
};

const Authenticate = async (req, res, next) => {
  const isValid = await ValidateSignature(req);
  if (isValid) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const CreateCategory = async (req, res, next) => {
  const { name } = req.body;
  const files = req.files;

  if (!name || !files) return res.status(400).json({ message: "require category name and image" });

  const image = files[0].filename;

  const sql = `insert into category (	category_name, image) values ('${name}', '${image}')`;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    if (results.affectedRows > 0)
      return res.status(201).json({ message: "success" });

    return res.status(400).json({ message: "failed" });
  });
};

const GetCategories = async (req, res, next) => {
  const sql = "SELECT * FROM category";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    return res.status(200).json(results);
  });
};

const GetCategoryByID = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "require id" });

  const sql = `SELECT * FROM category where category_id=${id}`;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    return res.status(200).json(results);
  });
};

const UpdateCategory = async (req, res, next) => {

  const { category_name } = req.body;

  const { id } = req.params
  console.log(id);
  const files = req.files;

  if (!id || !category_name || !files)
    return res.status(400).json({ message: "require category name and id" });

  const image = files[0].filename;

  const sql = `UPDATE category SET category_name='${category_name}', image='${image}' WHERE category_id=${id};`;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    if (results.affectedRows > 0)
      return res.status(201).json({ message: "success" });

    return res.status(400).json({ message: "failed" });
  });
};

const CreateItem = async (req, res, next) => {
  const files = req.files;
  const { item_name, category_id, model_number, brand, description } = req.body;

  if (!files) return res.status(400).json({ message: "require image" });

  if (
    !item_name ||
    !category_id ||
    !files ||
    !model_number ||
    !brand ||
    !description
  )
    return res.status(400).json({
      message: "require all field",
      field: [
        "name",
        "category_id",
        "image",
        "model_number",
        "brand",
        "description",
      ],
    });

  const image = files[0].filename;

  const sql = `insert into item (item_name, category_id, image, model_number, brand, description) values ('${item_name}', ${category_id}, '${image}', '${model_number}', '${brand}', '${description}')`;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    if (results.affectedRows > 0)
      return res.status(201).json({ message: "success" });

    return res.status(400).json({ message: "failed" });
  });
};

const GetItems = async (req, res, next) => {
  const sql = "SELECT * FROM item";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    return res.status(200).json(results);
  });
};

const GetItemsByID = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "require id" });

  const sql = `SELECT * FROM item where item_id=${id}`;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    return res.status(200).json(results[0]);
  });
};

const UpdateItem = async (req, res, next) => {
  const files = req.files;
  const { item_id } = req.params;

  const { item_name, category_id, model_number, brand, description } =
    req.body;

  console.log(
    item_id,
    item_name,
    category_id,
    model_number,
    brand,
    description
  );

  if (
    !item_id ||
    !item_name ||
    !category_id ||
    !model_number ||
    !files ||
    !brand ||
    !description
  )
    return res.status(400).json({
      message: "require all field",
      field: [
        "name",
        "category_id",
        "model_number",
        "brand",
        "description",
      ],
    });

  const image = files[0].filename;

  const sql = `UPDATE item SET 
    item_name='${item_name}',
    category_id=${category_id},
    image='${image}',
    model_number='${model_number}',
    brand='${brand}',
    description='${description}'
    
    WHERE item_id=${item_id};
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    if (results.affectedRows > 0)
      return res.status(201).json({ message: "success" });

    return res.status(400).json({ message: "failed" });
  });
};

const GetItemByCategory = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "require id" });

  const sql = `
    select item.*, category.category_id, category.category_name from category
    inner join item on category.category_id = item.category_id
    where category.category_id=${id}
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    return res.status(200).json(results);
  });
};

const DeleteItem = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "require id" });

  const sql = `delete from item where item_id=${id}`;

  try {
    db.query(sql, (error, results) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Database error");
        return;
      }

      return res.status(200).json(results);
    });
  } catch (err) {
    return res.status(400).json({ message: "failed", err });
  }
};

const DeleteCategory = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "require id" });

  // Check if category have item
  const check_sql = `select * from item where category_id=${id}`;
  db.query(check_sql, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).send("Database error");
      return;
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Category have item" });
    } else {
      // if not use category
      const sql = `delete from category where category_id=${id}`;

      db.query(sql, (error, results) => {
        if (error) {
          console.error("Error querying database:", error);
          res.status(500).send("Database error");
          return;
        }

        return res.status(200).json(results);
      });
    }
  });
};

const GetImage = async (req, res, next) => {
  const name = req.params.name;

  if (!name) return res.status(400).json({ message: "require name" });

  try {
    const filePath = path.join(__dirname, "../images", name);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);

        if (JSON.parse(JSON.stringify(err)).statusCode == 404) {
          return res.status(404).json({ message: "Image not found!" });
        }

        return res.status(500).send("Internal Server Error");
      }
    });
  } catch (err) {
    return res.status(404).json({ message: "Image not found!" });
  }
};

module.exports = {
  CreateCategory,
  GetCategories,
  GetCategoryByID,
  UpdateCategory,
  CreateItem,
  GetItems,
  GetItemsByID,
  UpdateItem,
  GetItemByCategory,
  GetImage,
  Login,
  Authenticate,
  DeleteItem,
  DeleteCategory,
};
