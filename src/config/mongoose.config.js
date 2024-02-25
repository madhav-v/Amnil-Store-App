// const mongoose = require("mongoose");

// mongoose
//   .connect(process.env.MONGODB_URL, {
//     autoCreate: true,
//     autoIndex: true,
//   })
//   .then((conn) => {
//     console.log("DB connected");
//   })
//   .catch((err) => {
//     console.log("Error connecting database");
//   });

const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const createTablesQueries = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    location_type VARCHAR(255),
    coordinates NUMERIC[]
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categories VARCHAR(255) NOT NULL,
    detail TEXT,
    price NUMERIC NOT NULL CHECK (price >= 1),
    stock INTEGER DEFAULT 0,
    images TEXT[],
    store_id INTEGER REFERENCES store(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    location_type VARCHAR(255),
    coordinates NUMERIC[],
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

  `,
  `
  CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    cart_items JSONB NOT NULL,
    total NUMERIC,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    order_items JSONB NOT NULL,
    total NUMERIC,
    status VARCHAR(255) DEFAULT 'payed',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS auction (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    bidder JSONB,
    auction_winner_id INTEGER REFERENCES users(id),
    auction_bid_final_amount NUMERIC,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  )
  `,
];

createTablesQueries.forEach(async (query) => {
  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating table:", error.stack);
  }
});

module.exports = pool;
