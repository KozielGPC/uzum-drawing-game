docker_build(
  'backend-udg',
  context='./backend',
  live_update=[
    sync('./backend', '/app'),
  ]
)

docker_build(
  'frontend-udg',
  context='./frontend',
  live_update=[
    sync('./frontend', '/app'),
  ]
)

k8s_yaml(
    [
      'infra/dev/backend-secret.yml',
      'infra/dev/frontend-secret.yml', 
      'infra/dev/backend-deployment.yml', 
    #   'infra/dev/services.yml', 
      'infra/dev/frontend-deployment.yml'
    ]
)


k8s_resource(
  'backend-deployment',
  port_forwards=['4000:3000'],
  labels=["application"]
)

k8s_resource(
  'frontend-deployment',
  port_forwards=['3000:3000'],
  labels=["application"]
)