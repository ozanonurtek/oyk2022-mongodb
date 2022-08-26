# MongoDB notes

- docker run -d  -p 27017:27017 --name mongo-courser -v data-vol:/data/db mongo:latest
- MongoDB Compass aggregation yazmak cok kolay.
- Aggregation is multi stage query like pipeline.
- Aggregation'da her asamanin ciktisi bir sonraki asamanin girdisi olarak calisir.
- Aggregation asamalarinda calisan kurallar validation ya da scheme'den etkilenmez, umursamaz.
- Surekli kullanilan aggregation'lar icin view tanimlanabilir, bunlar cache'lenen aggregation'lardir.
- DB Ref? Follow Ref?
- Aggregation uzerinden iki farkli db arasinda out operatoru ile veri transferi yapabiliriz.
- Indexleme sadece find gibi basit query'lerde degil, sizin attiginiz bir sort isleminde ya da aggregation'da de ise yarar. 
- MongoDB Atlas SSPL lisansli.
- Router, Config Server, Shard, Replicaset
- Klasik setup: 3 shard, her shard icin 3'lu RS, 2 config server, 2 router
- Index tipleri: ASC, DESC, 2DSphere, Text
- View tipleri: Standart ve On-Demand Materialized