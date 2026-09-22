from database import SessionLocal, create_tables
from models import Building, Floor, Space


create_tables()

db = SessionLocal()

try:
    # Create Building
    building = Building(
        name="H Block",
        code="HBLOCK",
        description="H Block of the college",
    )

    db.add(building)
    db.commit()
    db.refresh(building)

    print(f"Building created: {building.name} (ID: {building.id})")

    # Create Floor
    floor = Floor(
        building_id=building.id,
        floor_number=0,
        name="Ground Floor",
    )

    db.add(floor)
    db.commit()
    db.refresh(floor)

    print(f"Floor created: {floor.name} (ID: {floor.id})")

    # Create Space
    space = Space(
        floor_id=floor.id,
        space_code="H-101",
        name="Classroom H-101",
        space_type="Classroom",
        description="First classroom in H Block",
    )

    db.add(space)
    db.commit()
    db.refresh(space)

    print(f"Space created: {space.name} (ID: {space.id})")

except Exception as e:
    db.rollback()
    print("CRUD test failed.")
    print(e)

finally:
    db.close()