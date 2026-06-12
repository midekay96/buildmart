import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // ── Supabase / Railway / Render style (connection string) ──────────────────
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    dialectOptions: {
      ssl: {
        require:            true,
        rejectUnauthorized: false   // needed for Supabase SSL
      }
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  });
} else {
  // ── Local development (individual credentials) ─────────────────────────────
  sequelize = new Sequelize(
    process.env.DB_NAME     || 'buildmart_db',
    process.env.DB_USER     || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host:    process.env.DB_HOST || 'localhost',
      port:    process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log,
      pool:    { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
  );
}

export default sequelize;
