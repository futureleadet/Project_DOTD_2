import asyncio
import asyncpg
import os
import sys

# Add the current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.config.settings import settings

async def update_schema():
    print(f"Connecting to DB: {settings.DATABASE_URL}")
    try:
        conn = await asyncpg.connect(settings.DATABASE_URL)
        
        queries = [
            # User profile columns
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS face_shape VARCHAR(50);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS personal_color VARCHAR(50);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS height INTEGER;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10) DEFAULT 'Female';",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS body_type VARCHAR(50);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_images TEXT[];",
            
            # Creations expanded columns
            "ALTER TABLE creations ADD COLUMN IF NOT EXISTS height INTEGER;",
            "ALTER TABLE creations ADD COLUMN IF NOT EXISTS body_type VARCHAR(50);",
            "ALTER TABLE creations ADD COLUMN IF NOT EXISTS style VARCHAR(50);",
            "ALTER TABLE creations ADD COLUMN IF NOT EXISTS colors VARCHAR(255);"
        ]
        
        for q in queries:
            try:
                await conn.execute(q)
                print(f"Executed: {q}")
            except Exception as e:
                print(f"Error executing {q}: {e}")
                
        await conn.close()
        print("Schema update completed successfully.")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(update_schema())
