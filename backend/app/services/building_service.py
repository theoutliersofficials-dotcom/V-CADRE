from sqlalchemy.orm import Session

from app.models import Building, Floor
from app.schemas import BuildingCreate, FloorCreate

from app.models import Asset, Building, Floor, Space
from app.schemas import (
    AssetCreate,
    BuildingCreate,
    FloorCreate,
    SpaceCreate,
)
def create_asset(
    db: Session,
    space_id: int,
    asset_data: AssetCreate,
) -> Asset | None:

    space = (
        db.query(Space)
        .filter(Space.id == space_id)
        .first()
    )

    if space is None:
        return None

    asset = Asset(
        space_id=space_id,
        asset_code=asset_data.asset_code,
        name=asset_data.name,
        asset_type=asset_data.asset_type,
        quantity=asset_data.quantity,
        condition=asset_data.condition,
        description=asset_data.description,
    )

    db.add(asset)
    db.commit()
    db.refresh(asset)

    return asset


def get_assets(
    db: Session,
    space_id: int,
) -> list[Asset]:

    return (
        db.query(Asset)
        .filter(Asset.space_id == space_id)
        .all()
    )
def create_building(
    db: Session,
    building_data: BuildingCreate,
) -> Building:
    building = Building(
        name=building_data.name,
        code=building_data.code,
        description=building_data.description,
    )

    db.add(building)
    db.commit()
    db.refresh(building)

    return building


def get_buildings(db: Session) -> list[Building]:
    return db.query(Building).all()


def get_building(
    db: Session,
    building_id: int,
) -> Building | None:
    return (
        db.query(Building)
        .filter(Building.id == building_id)
        .first()
    )


def create_floor(
    db: Session,
    building_id: int,
    floor_data: FloorCreate,
) -> Floor | None:

    building = (
        db.query(Building)
        .filter(Building.id == building_id)
        .first()
    )

    if building is None:
        return None

    floor = Floor(
        building_id=building_id,
        floor_number=floor_data.floor_number,
        name=floor_data.name,
    )

    db.add(floor)
    db.commit()
    db.refresh(floor)

    return floor


def get_floors(
    db: Session,
    building_id: int,
) -> list[Floor]:

    return (
        db.query(Floor)
        .filter(Floor.building_id == building_id)
        .all()
    )
def create_space(
    db: Session,
    floor_id: int,
    space_data: SpaceCreate,
) -> Space | None:

    floor = (
        db.query(Floor)
        .filter(Floor.id == floor_id)
        .first()
    )

    if floor is None:
        return None

    space = Space(
        floor_id=floor_id,
        space_code=space_data.space_code,
        name=space_data.name,
        space_type=space_data.space_type,
        description=space_data.description,
    )

    db.add(space)
    db.commit()
    db.refresh(space)

    return space


def get_spaces(
    db: Session,
    floor_id: int,
) -> list[Space]:

    return (
        db.query(Space)
        .filter(Space.floor_id == floor_id)
        .all()
    )