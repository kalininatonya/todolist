const jsonServer = require('json-server');
const PORT = 5000;

const server = jsonServer.create();
const middlewares = jsonServer.defaults([{noCors: true}]);
const router = jsonServer.router('db.json');
server.use(middlewares);

server.db = router.db;
server.use('/api', router);

server.listen(PORT, () => {
    console.log(`Mock api server listening at localhost:${PORT}`)
});