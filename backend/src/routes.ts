import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';


import PointsControler from './controllers/PointsController';
import ItemsControler from './controllers/ItemsController';

//componente para tratar as rotas de forma isolada.
const routes = express.Router();

const upload = multer(multerConfig);


//separando os endpoints de forma separada para organizar o código.
const pointsController = new PointsControler();
const itemsController = new ItemsControler();

routes.get('/', (request, response) => {
    return response.json({mensagem: 'Hello world.'});
 });

 routes.get('/items', itemsController.index);


 routes.post('/points', upload.single('image'), pointsController.create);



 routes.get('/points/:id', pointsController.show);
 routes.get('/points', pointsController.index);


 export default routes;