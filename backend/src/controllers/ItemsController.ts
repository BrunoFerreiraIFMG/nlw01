import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController {
 
    async index (request :Request, response :Response) {
        const items = await knex('items').select('*');

//`http://localhost:3333/uploads/${item.image}`, url para rodar na web.

        const serializedItems = items.map(item => {
                  return {
                          id: item.id,
                          title: item.title,
                          image_url: `http://192.168.1.5:3333/uploads/${item.image}`,
                         }
        });
    
        return response.json(serializedItems);

 }

}

export default ItemsController;