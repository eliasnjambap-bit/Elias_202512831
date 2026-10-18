CREATE TABLE IF NOT EXISTS products (
id INTEGER PRIMARY KEY AUTOINCREMENT,
product_name TEXT NOT NULL,
category TEXT NOT NULL,
brand TEXT NOT NULL,
price REAL NOT NULL,
stock_quantity INTEGER NOT NULL DEFAULT 0,
description TEXT,
created_at TEXT DEFAULT CURRENT_TIMESTAMP,
updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (
product_name,
category,
brand,
price,
stock_quantity,
description
)
SELECT
'Wireless Mouse',
'Accessories',
'Logitech',
250.00,
15,
'Wireless mouse for laptops and desktop computers'
WHERE NOT EXISTS (
SELECT 1 FROM products WHERE product_name = 'Wireless Mouse'
);

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'USB Keyboard', 'Accessories', 'HP', 350.00, 10, 'USB keyboard for everyday computer use'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'USB Keyboard');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'Laptop Charger', 'Accessories', 'Dell', 450.00, 8, 'Laptop power adapter'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Laptop Charger');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'Flash Drive 32GB', 'Storage', 'SanDisk', 150.00, 20, '32GB USB storage device'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Flash Drive 32GB');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'External Hard Drive', 'Storage', 'Seagate', 1200.00, 5, 'External storage drive for backups'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'External Hard Drive');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'Laptop Cooling Pad', 'Accessories', 'HAVIT', 400.00, 7, 'Cooling pad for laptops'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Laptop Cooling Pad');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'USB-C Hub', 'Accessories', 'UGREEN', 550.00, 6, 'USB-C hub with multiple ports'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'USB-C Hub');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'Wireless Headphones', 'Audio', 'JBL', 850.00, 9, 'Wireless headphones for music and calls'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Wireless Headphones');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'Webcam', 'Accessories', 'Logitech', 700.00, 4, 'Webcam for online meetings'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'Webcam');

INSERT INTO products (product_name, category, brand, price, stock_quantity, description)
SELECT 'HDMI Cable', 'Cables', 'UGREEN', 120.00, 25, 'HDMI cable for connecting displays'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_name = 'HDMI Cable');
