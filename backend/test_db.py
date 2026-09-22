from sqlalchemy import inspect, text

from database import engine, create_tables


try:
    # 1. Test connection
    with engine.connect() as connection:
        result = connection.execute(text("SELECT current_database();"))
        database_name = result.scalar()

        print(f"Database connection successful: {database_name}")

    # 2. Create tables
    create_tables()

    print("Database tables created successfully.")

    # 3. Inspect tables
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print("\nTables found in database:")

    for table in tables:
        print(f" - {table}")

except Exception as e:
    print("\nDatabase setup failed.")
    print(e)