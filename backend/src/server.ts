import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';

const app = express();

//habilita o uso de cors para acesso multiplataforma
app.use(cors());
//habilita o formato de dados via JSON.
app.use(express.json());
//habilita o nosso arquivo auxiliar de rotas.
app.use(routes);
//habilita o acesso a arquivos fixos no projeto, informando a rota e o arquivo.
app.use('/uploads', express.static( path.resolve(__dirname, '..', 'uploads')));


app.listen(3333);