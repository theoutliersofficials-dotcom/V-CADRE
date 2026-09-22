from app.database.session import engine
from app.models import Base


def create_tables():
    Base.metadata.create_all(bind=engine)