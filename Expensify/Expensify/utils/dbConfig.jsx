import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon('postgresql://neondb_owner:blvD4XTYV0FW@ep-patient-mode-a5gw41hr.us-east-2.aws.neon.tech/Expenses-Tracker?sslmode=require');

const db = drizzle(sql, { schema });

export { db };
