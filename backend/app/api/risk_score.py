from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Building, Floor, Space, Asset
from app.services.risk_score import calculate_risk_score

class ProjectedRiskRequest(BaseModel):
    planned_change: str
    details: str = ""

router = APIRouter(
    prefix="/risk-score",
    tags=["Risk Score"],
)


@router.get("/{building_id}")
def get_building_risk_score(
    building_id: int,
    db: Session = Depends(get_db),
):
    
    building = (
        db.query(Building)
        .filter(Building.id == building_id)
        .first()
    )

    if not building:
        raise HTTPException(
            status_code=404,
            detail="Building not found",
        )

    floors = (
        db.query(Floor)
        .filter(Floor.building_id == building.id)
        .all()
    )

    floor_ids = [floor.id for floor in floors]

    spaces = []

    if floor_ids:
        spaces = (
            db.query(Space)
            .filter(Space.floor_id.in_(floor_ids))
            .all()
        )

    space_ids = [space.id for space in spaces]

    assets = []

    if space_ids:
        assets = (
            db.query(Asset)
            .filter(Asset.space_id.in_(space_ids))
            .all()
        )

    return calculate_risk_score(
        building=building,
        floors=floors,
        spaces=spaces,
        assets=assets,
    )

@router.post("/{building_id}/project")
def get_projected_risk_score(
    building_id: int,
    request: ProjectedRiskRequest,
    db: Session = Depends(get_db),
):
    building = (
        db.query(Building)
        .filter(Building.id == building_id)
        .first()
    )

    if not building:
        raise HTTPException(
            status_code=404,
            detail="Building not found",
        )

    floors = (
        db.query(Floor)
        .filter(Floor.building_id == building.id)
        .all()
    )

    floor_ids = [floor.id for floor in floors]

    spaces = []

    if floor_ids:
        spaces = (
            db.query(Space)
            .filter(Space.floor_id.in_(floor_ids))
            .all()
        )

    space_ids = [space.id for space in spaces]

    assets = []

    if space_ids:
        assets = (
            db.query(Asset)
            .filter(Asset.space_id.in_(space_ids))
            .all()
        )

    current_result = calculate_risk_score(
        building=building,
        floors=floors,
        spaces=spaces,
        assets=assets,
    )

    from app.services.risk_score import calculate_projected_risk_score

    projected_result = calculate_projected_risk_score(
        current_result=current_result,
        planned_change=request.planned_change,
        details=request.details,
    )

    return projected_result