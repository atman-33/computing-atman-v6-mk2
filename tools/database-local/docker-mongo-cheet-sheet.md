# Docker MongoDB Command cheet-sheet

## Generate volumes command

```sh
docker-compose -f tools/database-local/docker-compose-dev.yml up -d --no-recreate --remove-orphans
```

## Delete volumes command

```sh
docker-compose -f tools/database-local/docker-compose-dev.yml down --rmi all --volumes --remove-orphans
```

> Reference url : <https://qiita.com/suin/items/19d65e191b96a0079417>

## How to delete mongodb collection

## 1. move to mongodb container to operate db  

```sh
docker exec -it mongodb bash
```

## 2. connect to mongodb server

```sh
mongosh mongodb://localhost:27017
```

## 3. delete cllection

```sh
db.collection-name.drop()
```
