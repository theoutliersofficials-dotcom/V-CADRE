from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(Text)

    floors = relationship(
        "Floor",
        back_populates="building",
        cascade="all, delete-orphan",
    )


class Floor(Base):
    __tablename__ = "floors"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(
        Integer,
        ForeignKey("buildings.id"),
        nullable=False,
    )
    floor_number = Column(Integer, nullable=False)
    name = Column(String(100), nullable=False)

    building = relationship(
        "Building",
        back_populates="floors",
    )

    spaces = relationship(
        "Space",
        back_populates="floor",
        cascade="all, delete-orphan",
    )


class Space(Base):
    __tablename__ = "spaces"

    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(
        Integer,
        ForeignKey("floors.id"),
        nullable=False,
    )
    space_code = Column(String(50))
    name = Column(String(150), nullable=False)
    space_type = Column(String(50))
    description = Column(Text)

    floor = relationship(
        "Floor",
        back_populates="spaces",
    )