from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

app = FastAPI()
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["oyk2022"]


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class CrimeModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    dispatch_date: Optional[datetime] = Field()
    crime_tags: Optional[List[str]] = Field()
    offense_type: Optional[str] = Field()
    crime_type: Optional[str] = Field()
    crime_location: object = Field()

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


@app.get(
    "/", response_description="List all crimes", response_model=List[CrimeModel]
)
async def list_crimes():
    students = await db.crime_modified.find().to_list(1000)
    return students


@app.get(
    "/avg_case_close_time", response_description="Find avg case close time by field"
)
async def find_avg(avg_by: str):
    pipeline = [
        {
            '$match': {
                'case_elapsed_minutes': {
                    '$ne': None
                }
            }
        }, {
            '$group': {
                '_id': '${}'.format(avg_by),
                'avg': {
                    '$avg': '$case_elapsed_minutes'
                }
            }
        }]
    result = await db.crime_modified.aggregate(pipeline).to_list(None)
    return result


@app.get(
    "/total_victim_count", response_description="Find total victim count by field"
)
async def find_avg(count_by: str):
    pipeline = [
        {
            '$group': {
                '_id': '${}'.format(count_by),
                'victim_sum': {
                    '$sum': 1
                }
            }
        }]
    result = await db.crime_modified.aggregate(pipeline).to_list(None)
    return result


@app.get(
    '/find_crime_count_by_tag', response_description='Find crime count by tag', response_model=List[CrimeModel]
)
async def find_crime_count_by_tag(tag: str):
    result = await db.crime_modified.find({'crime_tags': {'$in': [tag]}}).to_list(1000)
    return result


@app.get(
    '/search_crime_by_street_name', response_description='Find crime by street name', response_model=List[CrimeModel]
)
async def search_crime_by_street_name(street_name: str):
    result = await db.crime_modified.find({"crime_location.street.name": {"$regex": street_name}}).to_list(None)
    return result
