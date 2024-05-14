yarn docs
node ace build
cp gobelins-bombastic-manager-firebase-adminsdk-5135t-6cc7f48ecd.json build/
cp swagger.yml build/swagger.yaml
cd build
yarn install --production
