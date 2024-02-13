## About
This is the backend of the UzumDrawingGame, that is a game developed by Uzum Team. In this game, each player will type a sentence then send it to some random player. The next player will receive this sentence and will have to draw it. He will send the draw to another random player, and keep doing this until every player have participated in this sequence. At the end, the room Admin will show all the sequence for the players and see what was in the begin and what have become in the end.

## Used Technologies
- TypeScript
- Nest.JS
- Socket.io
- Prisma.JS
- PostgreSQL

## Steps to Run

- docker-compose up -d
- yarn install
- yarn prisma generate
- yarn prisma migrate deploy

## License

Nest is [MIT licensed](LICENSE).
