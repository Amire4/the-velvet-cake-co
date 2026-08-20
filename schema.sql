-- ============================================================================
-- THE VELVET CAKE CO. - POSTGRESQL DATABASE SCHEMA & SEED SCRIPT
-- Database: velvet_bakery_db
-- Target: PostgreSQL 14+ / pgAdmin 4
-- Connection: postgresql://postgres:Amir123@localhost:5432/velvet_bakery_db
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(64),
  role VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE (Artisanal Cakes & Pastries)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(64) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. CAKE FLAVORS TABLE
CREATE TABLE IF NOT EXISTS cake_flavors (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCT REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS product_reviews (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  order_number VARCHAR(64) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(64) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  delivery_method VARCHAR(64) NOT NULL,
  delivery_address TEXT,
  preferred_date TIMESTAMPTZ,
  customer_notes TEXT,
  payment_method VARCHAR(64) NOT NULL,
  payment_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  order_status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  customization TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. CUSTOM CAKE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS custom_cake_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(64) NOT NULL,
  cake_type VARCHAR(128) NOT NULL,
  size VARCHAR(128) NOT NULL,
  shape VARCHAR(64) NOT NULL,
  tiers INT NOT NULL DEFAULT 1,
  flavor VARCHAR(255) NOT NULL,
  filling VARCHAR(255) NOT NULL,
  frosting VARCHAR(255) NOT NULL,
  colors VARCHAR(255) NOT NULL,
  theme TEXT,
  message TEXT,
  dietary_requirement TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  reference_image_url TEXT,
  additional_notes TEXT,
  quoted_price NUMERIC(10, 2),
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. CHAT CONVERSATIONS & AI ASSISTANT HISTORY
CREATE TABLE IF NOT EXISTS chat_conversations (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  session_id VARCHAR(128) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(64) PRIMARY KEY,
  conversation_id VARCHAR(64) REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_custom_cake_user_id ON custom_cake_requests(user_id);
