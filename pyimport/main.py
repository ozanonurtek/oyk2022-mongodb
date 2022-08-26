from pymongo import MongoClient
from pandas import read_csv
import json

client = MongoClient("mongodb://localhost:27017")
db = client.oyk2022


def import_csv(filename, collection_name):
    data = read_csv(filename)
    payload = json.loads(data.to_json(orient='records'))
    db[collection_name].insert_many(payload)


if __name__ == '__main__':
    import_csv('Crime.csv', 'crime')
