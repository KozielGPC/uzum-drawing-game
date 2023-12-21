k8s_yaml("./infra/backend-deployment.yaml")
k8s_resource("backend", port_forwards=8000, resource_deps=["deploy"])
docker_build("udg-backend", "./backend")

k8s_yaml("./infra/frontend-deployment.yaml")
k8s_resource("frontend", port_forwards=3000, resource_deps=["deploy"])
docker_build("udg-frontend", "./frontend")
