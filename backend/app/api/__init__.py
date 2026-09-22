from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import BuildingCreate, BuildingResponse
from app.services.building_service import (
    create_building,
    get_building,
    get_buildings,
)


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