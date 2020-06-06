import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
    async create(request :Request, response :Response) {
        const {name, 
            email, 
            whatsapp, 
            latitude,
            longitude,
            city,
            uf,
            items} = request.body;
        
        const trx = await knex.transaction();
    
       const point = {
        image: request.file.filename,
        name, 
        email, 
        whatsapp, 
        latitude,
        longitude,
        city,
        uf
      }

        const ids = await trx('points').insert(point);
    
        const pointsItems = items
                              .split(',')
                              .map((i :string) => Number(i.trim()))
                              .map( (item_id:number) => {
           return {
            item_id: item_id,
            point_id: ids[0]
           }
        });
    
        await trx('points_items').insert(pointsItems);
    
        await trx.commit();
        return response.json({
            id:ids[0],
            ...point});
     }

     async show(request :Request, response :Response) {
        
        const {id} = request.params;

        const point = await knex('points').where('id',id).first();        

       if (!point){
          return response.status(400).json({mensagem: 'Point not found.'})
       }

       const serializedPoint =  {
                 ...point,
                 image_url: `http://192.168.1.5:3333/uploads/${point.image}`,
                };

       const items = await knex('items')
          .join('points_items','item_id','=','items.id')//points_items.item_id
          .where('points_items.point_id',id)
          .distinct()
          .select('items.title'); 

        return response.json({point: serializedPoint, items});
     }

     async index (request :Request, response :Response) {

        const {city, uf, items} = request.query;
        
        const parserdItems = String(items)
                                    .split(',')
                                    .map(item => Number(item.trim()))
        
        const points = await knex('points')
                            .join('points_items','points.id','=', 'points_items.point_id')
                            .whereIn('points_items.item_id',parserdItems)
                            .where('city',String(city))
                            .where('uf',String(uf))
                            .distinct()
                            .select('points.*');
    
        const serializedPoints = points.map(point => {
               return {
                       ...point,
                       image_url: `http://192.168.1.5:3333/uploads/${point.image}`,
                      }
                    });

        return response.json(serializedPoints);
 }

}

export default PointsController;