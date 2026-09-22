from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Building, Floor, Space, Asset
from app.services.topology_validation import validate_topology


router = APIRouter(
    prefix="/topology",
    tags=["Topology Validation"],
)


@router.get("/validate")
def validate_database_topology(
    db: Session = Depends(get_db),
):
    buildings = db.query(Building).all()
    floors = db.query(Floor).all()
    spaces = db.query(Space).all()
    assets = db.query(Asset).all()

    return validate_topology(
        buildings=buildings,
        floors=floors,
        spaces=spaces,
        assets=assets,
    )