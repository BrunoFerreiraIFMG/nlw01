import knex from 'knex';  //biblioteca de conexao
import path from 'path';  //lida com os camainhos dos diretorios e arquivos


const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname,'database.sqlite')
    }
});

export default connection;