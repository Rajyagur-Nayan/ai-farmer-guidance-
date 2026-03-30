import asyncio
import os
from sqlalchemy import text
from database import engine

async def fix_database():
    """
    Standalone migration script to add missing columns to the consultations table.
    This fixes the 'UndefinedColumnError' without data loss.
    """
    print("DATABASE REPAIR: Initializing connection...")
    
    # 1. Check for missing 'issue_description' in 'consultations'
    # 2. Add it if missing
    
    async with engine.begin() as conn:
        print("DATABASE REPAIR: Running schema audit on table 'consultations'...")
        try:
            # PostgreSQL syntax to add column if not exists (using a DO block for safety)
            await conn.execute(text("""
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name='consultations' AND column_name='issue_description'
                    ) THEN 
                        ALTER TABLE consultations ADD COLUMN issue_description TEXT;
                        RAISE NOTICE 'Column issue_description added to consultations.';
                    ELSE
                        RAISE NOTICE 'Column issue_description already exists.';
                    END IF;
                END $$;
            """))
            print("DATABASE REPAIR: Column 'issue_description' synchronized successfully.")
        except Exception as e:
            print(f"DATABASE REPAIR FAILURE: {e}")

    await engine.dispose()
    print("DATABASE REPAIR: Task complete.")

if __name__ == "__main__":
    asyncio.run(fix_database())
