# uzum-drawing-game
Uzum Drawing Game is a draw and guess game to play with your friends

# Backend
### Used technologies
- Typescript
- Nest.JS
- Prisma.JS
- PostgreSQL
- Websockets

## Steps to run

```
yarn install
```

```
yarn prisma migrate deploy
```

```
yarn prisma generate
```

```
yarn start:dev
```

## To do
- Add authentication
- Add swagger
- Add error handling
- Add multiple rooms websocket handling
- Add unit tests

# Frontend

## Used Technologies
- TypeScript
- React.JS
- Socket.io
- React Canvas Draw

## ScreenShots
![image](https://github.com/KozielGPC/frontend-uzumdrawinggame/assets/37910437/fd6d69bc-9fcb-4c9c-bffb-3d8c51c7fc29)

![image](https://github.com/KozielGPC/frontend-uzumdrawinggame/assets/37910437/2fd58aeb-edf5-40eb-a20b-754b3e8f322f)

![image](https://github.com/KozielGPC/frontend-uzumdrawinggame/assets/37910437/ea118007-8c4a-4697-bf6c-2b0e9d2208aa)

![image](https://github.com/KozielGPC/frontend-uzumdrawinggame/assets/37910437/9a480441-0262-436f-a21a-674e2467de55)

![image](https://github.com/KozielGPC/frontend-uzumdrawinggame/assets/37910437/bc9a6b20-c63d-4de1-9506-311ade015748)

![image](https://github.com/KozielGPC/frontend-uzumdrawinggame/assets/37910437/549d7a59-810c-4854-bc58-cd97fed48891)

![image](https://github.com/KozielGPC/frontend-uzumdrawinggame/assets/37910437/9bf7ec57-3206-4344-99e4-bdfb523dd4d6)

## Steps to run

```
yarn install
```

```
yarn start
```

## Run with Tilt
* There must be a kubernetes cluster running
If you are using minikube:

```
minikube start
```

Then run in the root folder:
```
tilt up
```

## To Do
- Migrate to Ant Design
- Update text inputs to use antd
- Add auth wrapper provider
- Update canvas drawing component to use another package
- Update cards componentes to use colors from the previous layout
- Add Light/Dark Theme
- Add token auth handler
- Add ptBR/enUS translation

# Infra
## Used Technologies
- Docker
- Kubernetes
- Tilt
- Docker Compose

## To Do
- Update backend dockerfile to run with tilt
- Add postgres into a kubernetes file
- Run everything with tilt
- Deploy application
- Buy a domain 