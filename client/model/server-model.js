const config = require('../../app.config')
const creatDb = require('../../server/db/db')

const db = creatDb(config.db.appId, config.db.appKey)

export default {
   getAllTodos () {
    // console.log(db.getAllTodos());
    return db.getAllTodos()
  }
}
