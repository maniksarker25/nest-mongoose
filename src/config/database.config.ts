export default () => ({
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nest_app',
    dbName: process.env.MONGO_DB || 'nestDB',
  },
});
