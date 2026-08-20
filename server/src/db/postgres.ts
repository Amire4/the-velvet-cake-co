import pg from 'pg';
import { getSeedData, PRODUCT_SPECIFIC_REVIEWS } from '../config/seedData.ts';

const { Pool } = pg;

export const DEFAULT_POSTGRES_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:Amir123@localhost:5432/velvet_bakery_db';

let pool: pg.Pool | null = null;
let isConnected = false;
let initPromise: Promise<boolean> | null = null;

export function getPostgresPool(): pg.Pool {
  if (!pool) {
    const connectionString = DEFAULT_POSTGRES_URL;
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') || connectionString.includes('supabase')
        ? { rejectUnauthorized: false }
        : false,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 10,
    });

    pool.on('error', (err) => {
      console.warn('⚠️ PostgreSQL Pool Warning:', err.message);
    });
  }
  return pool;
}

export async function initPostgresDatabase(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const p = getPostgresPool();
      // Test connection
      const client = await p.connect();
      
      console.log('🐘 Connected successfully to PostgreSQL database: velvet_bakery_db');

      // Create Tables
      await client.query(`
        -- Users Table
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

        -- Products Table
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

        -- Cake Flavors Table
        CREATE TABLE IF NOT EXISTS cake_flavors (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          available BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Product Reviews Table
        CREATE TABLE IF NOT EXISTS product_reviews (
          id VARCHAR(64) PRIMARY KEY,
          product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
          user_name VARCHAR(255) NOT NULL,
          user_email VARCHAR(255),
          rating INT NOT NULL,
          comment TEXT NOT NULL,
          verified_purchase BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Orders Table
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

        -- Order Items Table
        CREATE TABLE IF NOT EXISTS order_items (
          id VARCHAR(64) PRIMARY KEY,
          order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
          product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
          quantity INT NOT NULL,
          unit_price NUMERIC(10, 2) NOT NULL,
          customization TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Custom Cake Requests Table
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

        -- Contact Messages Table
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

        -- Newsletter Subscribers Table
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          subscribed BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Chat Conversations Table
        CREATE TABLE IF NOT EXISTS chat_conversations (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64),
          session_id VARCHAR(128) UNIQUE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- Chat Messages Table
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(64) PRIMARY KEY,
          conversation_id VARCHAR(64) REFERENCES chat_conversations(id) ON DELETE CASCADE,
          role VARCHAR(32) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Check if products need seeding
      const prodCountRes = await client.query('SELECT COUNT(*) FROM products');
      const prodCount = parseInt(prodCountRes.rows[0].count, 10);

      if (prodCount === 0) {
        console.log('🌱 Seeding initial PostgreSQL data into velvet_bakery_db...');
        const seed = await getSeedData();

        // Seed Users
        const usersToSeed = [seed.ownerUser, seed.adminUser, seed.demoCustomer];
        for (const u of usersToSeed) {
          await client.query(
            `INSERT INTO users (id, name, email, password_hash, phone, role, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (email) DO NOTHING`,
            [u.id, u.name, u.email, u.passwordHash, u.phone || null, u.role, u.createdAt, u.updatedAt]
          );
        }

        // Seed Flavors
        for (let i = 0; i < seed.flavors.length; i++) {
          const f = seed.flavors[i];
          const flvId = `flv-${String(i + 1).padStart(3, '0')}`;
          await client.query(
            `INSERT INTO cake_flavors (id, name, description, available)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO NOTHING`,
            [flvId, f.name, f.description, true]
          );
        }

        // Seed Products & Product Reviews
        for (let i = 0; i < seed.products.length; i++) {
          const p = seed.products[i];
          const prodId = `prod-${String(i + 1).padStart(3, '0')}`;
          const specificReviews = PRODUCT_SPECIFIC_REVIEWS[p.slug] || [];
          const reviewCount = specificReviews.length || (24 + ((i * 11) % 45));
          let rating = 4.9;
          if (specificReviews.length > 0) {
            const sum = specificReviews.reduce((acc, r) => acc + r.rating, 0);
            rating = Number((sum / specificReviews.length).toFixed(1));
          }

          await client.query(
            `INSERT INTO products (id, name, slug, description, category, price, image_url, featured, available, rating, review_count)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (slug) DO NOTHING`,
            [prodId, p.name, p.slug, p.description, p.category, p.price, p.imageUrl, p.featured, p.available, rating, reviewCount]
          );

          // Reviews
          const reviewsToAdd = specificReviews.length > 0 ? specificReviews : [
            {
              userName: `Patron #${i + 1}`,
              userEmail: `patron${i + 1}@manhattanpatisserie.com`,
              rating: 5,
              comment: `Exquisite flavor and presentation for ${p.name}!`,
              verifiedPurchase: true
            }
          ];

          for (let rIdx = 0; rIdx < reviewsToAdd.length; rIdx++) {
            const rev = reviewsToAdd[rIdx];
            const revId = `rev-${prodId}-${rIdx + 1}`;
            await client.query(
              `INSERT INTO product_reviews (id, product_id, user_name, user_email, rating, comment, verified_purchase)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT (id) DO NOTHING`,
              [revId, prodId, rev.userName, rev.userEmail || null, rev.rating, rev.comment, rev.verifiedPurchase ?? true]
            );
          }
        }

        console.log('✅ PostgreSQL seed complete.');
      }

      client.release();
      isConnected = true;
      return true;
    } catch (err: any) {
      console.warn('⚠️ PostgreSQL connection could not be established:', err.message);
      console.log('💡 Using in-memory fallback layer for active requests.');
      isConnected = false;
      return false;
    }
  })();

  return initPromise;
}

export function isPostgresConnected(): boolean {
  return isConnected;
}
