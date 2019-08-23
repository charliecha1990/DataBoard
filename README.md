#  Practitioner Data Tracking https://github.com/charliecha1990/DataBoard

## Getting Started

First, install [Meteor](https://www.meteor.com/install) and [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)

#### Install NPM packages

`meteor npm install`

#### Set up environment

Create `.env.meteor` from `.env.meteor.example`.

*Note:* We use two `.env` files, one for building (Docker) and one for running
the actual Meteor instance. Docker is pickier about the name of this file, so
`.env` is for Docker, and `.env.meteor` is for Meteor.

#### Run meteor

```
meteor
# or, to debug:
meteor run --inspect
```

#### Create a user

While meteor is running:
```
meteor shell
> Accounts.createUser({ email: 'user', password: 'mypassword' })
'2efa737faf3'
> import User from '/imports/api/users/User'
> user = User.findOne('2efa737faf3')
> user.set({ roles: ['user', 'admin'] })
> user.set({ profile: {firstName: '', lastName: ''} })
> user.save()
> .exit
Shell exiting...
```
##  admin:  admin@admin.ca  123 (for personal reference)

You can now log in at `localhost:3000` and start using the app!

## Build/Publish

### First time setup

Create `.env` using `.env.example` for reference



## Deploy

#### Ensure image is on DockerHub

**Build and push for both dev and production**

#### Configure stack

Every time the compose configuration changes:

```
docker-compose -f docker-compose.yml [-f docker-compose.prod.yml] config > docker-compose.stack.<stage>.yml
```

**WARNING: `docker-compose.stack.yml` will contain plaintext versions of
passwords and other environment information. Do not check it into source
control or otherwise share it in an insecure way.**

#### Ensure secrets are created

We need to create Docker secrets for the runtime environment. Make sure you run
this in the appropriate Docker Machine environment (see Set Docker Machine environment below).

```
cat | docker secret create METEOR_DOTENV -
PRODUCTS_MONGO_URL=mongodb://user:pass@another_server/db
```

Paste the entirety of `.env.meteor` into this secret.

Press ctrl-D to end input.

**Note:** If you're using Docker Machine, you need to create a secret in
every machine environment you run in. So your `METEOR_DOTENV` will be
different locally than in production, etc.

### Local deploy

```
eval $(docker-machine env -u)
docker-compose -f docker-compose.yml config > docker-compose.stack.dev.yml
docker stack deploy --with-registry-auth --compose-file=docker-compose.stack.dev.yml sibyl
```

### Production deploy

#### Set Docker Machine environment

Preview Docker Machine environment:
  ```
  docker-machine env sibyl
  ```

Enter environment:
  ```
  eval $(docker-machine env sibyl)
  ```

#### 🚀
  ```
  docker stack deploy --with-registry-auth --compose-file=docker-compose.stack.prod.yml sibyl
  ```
