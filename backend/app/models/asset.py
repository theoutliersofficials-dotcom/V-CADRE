from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.models.building import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)

    space_id = Column(
        Integer,
        ForeignKey("spaces.id"),
        nullable=False,
    )

    asset_code = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    asset_type = Column(String(100))
    quantity = Column(Integer, default=1)
    condition = Column(String(50))
    description = Column(Text)

    space = relationship(
        "Space",
        back_populates="assets",
    )