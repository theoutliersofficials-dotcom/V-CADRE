from pydantic import BaseModel, ConfigDict


class BuildingCreate(BaseModel):
    name: str
    code: str
    description: str | None = None


class BuildingResponse(BaseModel):
    id: int
    name: str
    code: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class FloorCreate(BaseModel):
    floor_number: int
    name: str


class FloorResponse(BaseModel):
    id: int
    building_id: int
    floor_number: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class SpaceCreate(BaseModel):
    space_code: str | None = None
    name: str
    space_type: str | None = None
    description: str | None = None


class SpaceResponse(BaseModel):
    id: int
    floor_id: int
    space_code: str | None = None
    name: str
    space_type: str | None = None
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)

class AssetCreate(BaseModel):
    asset_code: str
    name: str
    asset_type: str | None = None
    quantity: int = 1
    condition: str | None = None
    description: str | None = None


class AssetResponse(BaseModel):
    id: int
    space_id: int
    asset_code: str
    name: str
    asset_type: str | None = None
    quantity: int
    condition: str | None = None
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)

