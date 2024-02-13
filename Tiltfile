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

load('ext://uibutton', 'cmd_button', 'location')

load('ext://helm_remote', 'helm_remote')

# Add Bitnami helm charts for postgres, this is the artificact to deploy postgres on the cluster
helm_remote('postgresql', release_name='k8cher-db', repo_name='bitnami', repo_url='https://charts.bitnami.com/bitnami', 
set='postgresqlDatabase=k8cher,postgresqlUsername=postgres,postgresqlPassword=postgres')
# port forward for local development access
k8s_resource('k8cher-db-postgresql', port_forwards='5432:5432', labels=['database'])


def setup_buttons():
    # migrate button
    cmd_button(name='db migrate',
            resource='postgresql',
            text='Database Migrate',
            argv=['/bin/bash', '-c', 'cd ./backend && yarn prisma:migrate']
    )

    # seed button
    cmd_button(name='db seed',
            resource='postgresql',
            text='Database Seed',
            argv=['/bin/bash', '-c', 'cd ./backend && yarn prisma:seed']
    )

    # graphql playground button
    cmd_button(name='gql playground',
            resource='backend',
            text='Graphql Playground',
            argv=['/bin/bash', '-c', 'open http://localhost:3001/graphql']
    )

setup_buttons()