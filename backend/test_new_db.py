from sqlalchemy import inspect

from app.database import create_tables, engine


try:
    create_tables()

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print("New database architecture working.")
    print("\nTables found:")

    for table in tables:
        print(f" - {table}")

except Exception as e:
    print("Database test failed.")
    print(e)