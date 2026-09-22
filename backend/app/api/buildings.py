from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    BuildingCreate,
    BuildingResponse,
    FloorCreate,
    FloorResponse,
)
from app.services.building_service import (
    create_building,
    create_floor,
    get_building,
    get_buildings,
    get_floors,
)

from app.schemas import (
    AssetCreate,
    AssetResponse,
    BuildingCreate,
    BuildingResponse,
    FloorCreate,
    FloorResponse,
    SpaceCreate,
    SpaceResponse,
    
)

from app.services.building_service import (
    create_asset,
    get_assets,
    create_building,
    create_floor,
    create_space,
    get_building,
    get_buildings,
    get_floors,
    get_spaces,
)

from app.models import Floor, Space

router = APIRouter(
    prefix="/buildings",
    tags=["Buildings"],
)


@router.post(
    "",
    response_model=BuildingResponse,
    status_code=201,
)
def create_new_building(
    building_data: BuildingCreate,
    db: Session = Depends(get_db),
):
    return create_building(db, building_data)


@router.get(
    "",
    response_model=list[BuildingResponse],
)
def list_buildings(
    db: Session = Depends(get_db),
):
    return get_buildings(db)


@router.get(
    "/{building_id}",
    response_model=BuildingResponse,
)
def read_building(
    building_id: int,
    db: Session = Depends(get_db),
):
    building = get_building(db, building_id)

    if building is None:
        raise HTTPException(
            status_code=404,
            detail="Building not found",
        )

    return building


@router.post(
    "/{building_id}/floors",
    response_model=FloorResponse,
    status_code=201,
)
def create_new_floor(
    building_id: int,
    floor_data: FloorCreate,
    db: Session = Depends(get_db),
):
    floor = create_floor(
        db,
        building_id,
        floor_data,
    )

    if floor is None:
        raise HTTPException(
            status_code=404,
            detail="Building not found",
        )

    return floor


@router.get(
    "/{building_id}/floors",
    response_model=list[FloorResponse],
)
def list_building_floors(
    building_id: int,
    db: Session = Depends(get_db),
):
    building = get_building(db, building_id)

    if building is None:
        raise HTTPException(
            status_code=404,
            detail="Building not found",
        )

    return get_floors(db, building_id)
@router.post(
    "/floors/{floor_id}/spaces",
    response_model=SpaceResponse,
    status_code=201,
)
def create_new_space(
    floor_id: int,
    space_data: SpaceCreate,
    db: Session = Depends(get_db),
):
    space = create_space(
        db,
        floor_id,
        space_data,
    )

    if space is None:
        raise HTTPException(
            status_code=404,
            detail="Floor not found",
        )

    return space


@router.get(
    "/floors/{floor_id}/spaces",
    response_model=list[SpaceResponse],
)
def list_floor_spaces(
    floor_id: int,
    db: Session = Depends(get_db),
):
    floor = (
        db.query(Floor)
        .filter(Floor.id == floor_id)
        .first()
    )

    if floor is None:
        raise HTTPException(
            status_code=404,
            detail="Floor not found",
        )

    return get_spaces(db, floor_id)

@router.post(
    "/spaces/{space_id}/assets",
    response_model=AssetResponse,
    status_code=201,
)
def create_new_asset(
    space_id: int,
    asset_data: AssetCreate,
    db: Session = Depends(get_db),
):
    asset = create_asset(
        db,
        space_id,
        asset_data,
    )

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Space not found",
        )

    return asset


@router.get(
    "/spaces/{space_id}/assets",
    response_model=list[AssetResponse],
)
def list_space_assets(
    space_id: int,
    db: Session = Depends(get_db),
):
    space = (
        db.query(Space)
        .filter(Space.id == space_id)
        .first()
    )

    if space is None:
        raise HTTPException(
            status_code=404,
            detail="Space not found",
        )

    return get_assets(db, space_id)