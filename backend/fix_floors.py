from app.database import SessionLocal
from app.models import Floor


db = SessionLocal()

try:
    floors = (
        db.query(Floor)
        .filter(Floor.building_id == 1)
        .order_by(Floor.id)
        .all()
    )

    print("Existing floors:")

    for floor in floors:
        print(
            f"ID={floor.id} | "
            f"number={floor.floor_number} | "
            f"name={floor.name}"
        )

    # Keep the first two existing records as ground-floor records.
    # Convert the next five records into Floors 1-5.

    floor_numbers = [1, 2, 3, 4, 5]
    floor_names = [
        "Floor 1",
        "Floor 2",
        "Floor 3",
        "Floor 4",
        "Floor 5",
    ]

    usable_floors = floors[2:7]

    for floor, number, name in zip(
        usable_floors,
        floor_numbers,
        floor_names,
    ):
        floor.floor_number = number
        floor.name = name

    db.commit()

    print("\nFloors fixed successfully.")

    for floor in floors:
        print(
            f"ID={floor.id} | "
            f"number={floor.floor_number} | "
            f"name={floor.name}"
        )

finally:
    db.close()