from app.database import SessionLocal
from app.models import Building, Floor, Space, Asset


db = SessionLocal()

try:
    # -------------------------
    # Building
    # -------------------------
    building = Building(
        name="H Block",
        code="H",
        description="H Block academic building",
    )
    db.add(building)
    db.flush()

    # -------------------------
    # Floors
    # -------------------------
    floors = []

    floor_data = [
        (1, "Ground Floor"),
        (2, "First Floor"),
        (3, "Second Floor"),
        (4, "Third Floor"),
        (5, "Fourth Floor"),
    ]

    for floor_number, name in floor_data:
        floor = Floor(
            building_id=building.id,
            floor_number=floor_number,
            name=name,
        )
        db.add(floor)
        db.flush()
        floors.append(floor)

    # -------------------------
    # Spaces / Rooms
    # -------------------------
    spaces = [
        Space(
            floor_id=floors[0].id,
            space_code="H-101",
            name="II Year CSE-B Classroom",
            space_type="Classroom",
            description="Academic classroom for II Year CSE-B",
        ),
        Space(
            floor_id=floors[0].id,
            space_code="H-101",
            name="II Year IT Classroom",
            space_type="Classroom",
            description="Academic classroom for II Year IT",
        ),
        Space(
            floor_id=floors[1].id,
            space_code="H-201",
            name="IT Laboratory",
            space_type="Laboratory",
            description="Information Technology practical laboratory",
        ),
        Space(
            floor_id=floors[2].id,
            space_code="H-301",
            name="IV Year IT Classroom",
            space_type="Classroom",
            description="Academic classroom for IV Year IT",
        ),
        Space(
            floor_id=floors[3].id,
            space_code="H-401",
            name="Seminar Hall",
            space_type="Seminar Hall",
            description="Seminar and presentation hall",
        ),
        Space(
            floor_id=floors[4].id,
            space_code="H-501",
            name="Faculty Room",
            space_type="Office",
            description="Faculty workspace",
        ),
    ]

    for space in spaces:
        db.add(space)

    db.flush()

    # -------------------------
    # Assets
    # -------------------------
    assets = [
        Asset(
            space_id=spaces[0].id,
            asset_code="AST-H101-001",
            name="Projector",
            asset_type="Electronic Equipment",
            quantity=1,
            condition="Good",
            description="Classroom projector",
        ),
        Asset(
            space_id=spaces[0].id,
            asset_code="AST-H101-002",
            name="Desktop Computers",
            asset_type="Computer Equipment",
            quantity=30,
            condition="Good",
            description="Student desktop computers",
        ),
        Asset(
            space_id=spaces[0].id,
            asset_code="AST-H101-003",
            name="Ceiling Fan",
            asset_type="Electrical Equipment",
            quantity=4,
            condition="Good",
            description="Classroom ceiling fans",
        ),
        Asset(
            space_id=spaces[1].id,
            asset_code="AST-H101-004",
            name="Projector",
            asset_type="Electronic Equipment",
            quantity=1,
            condition="Good",
            description="Classroom projector",
        ),
        Asset(
            space_id=spaces[2].id,
            asset_code="AST-H201-001",
            name="Computer Systems",
            asset_type="Computer Equipment",
            quantity=30,
            condition="Good",
            description="Laboratory computer systems",
        ),
        Asset(
            space_id=spaces[2].id,
            asset_code="AST-H201-002",
            name="Projector",
            asset_type="Electronic Equipment",
            quantity=1,
            condition="Good",
            description="Laboratory projector",
        ),
        Asset(
            space_id=spaces[3].id,
            asset_code="AST-H301-001",
            name="Projector",
            asset_type="Electronic Equipment",
            quantity=1,
            condition="Good",
            description="Classroom projector",
        ),
        Asset(
            space_id=spaces[4].id,
            asset_code="AST-H401-001",
            name="Projector",
            asset_type="Electronic Equipment",
            quantity=1,
            condition="Good",
            description="Seminar hall projector",
        ),
        Asset(
            space_id=spaces[4].id,
            asset_code="AST-H401-002",
            name="Speaker System",
            asset_type="Audio Equipment",
            quantity=2,
            condition="Good",
            description="Seminar hall speakers",
        ),
        Asset(
            space_id=spaces[5].id,
            asset_code="AST-H501-001",
            name="Desktop Computer",
            asset_type="Computer Equipment",
            quantity=2,
            condition="Good",
            description="Faculty room computers",
        ),
    ]

    for asset in assets:
        db.add(asset)

    db.commit()

    print("H Block seed data inserted successfully.")
    print(f"Building ID: {building.id}")
    print(f"Floors created: {len(floors)}")
    print(f"Rooms created: {len(spaces)}")
    print(f"Assets created: {len(assets)}")

except Exception as error:
    db.rollback()
    print("Seed failed:")
    print(error)

finally:
    db.close()