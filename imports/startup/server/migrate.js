import './migrations';

if (process.env.RUN_MIGRATIONS) {
  Meteor.startup(() => Migrations.migrateTo('latest'));
}
