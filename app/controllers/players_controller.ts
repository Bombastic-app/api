// import type { HttpContext } from '@adonisjs/core/http'

import { firebaseService } from "#start/kernel";
import { HttpContext } from "@adonisjs/core/http";

export default class PlayersController {
  
  // /**
  //  * @add
  //  * @description Add a player to a game
  //  * @responseHeader 200 {string} content-type application/json 
  //  */
  // add({ request }: HttpContext) {
  //   const body = request.body()

  //   firebaseService.db().collection(`games/${body.gameId}/players`).doc(body.playerId).set({
  //     pseudo: body.pseudo,
  //     uid: body.playerId,
  //     current: false,
  //     main: false
  //   }).then(() => {
  //     return 'success'
  //   }).catch((error) => {
  //     console.log(error);
  //   }) 
  // }

  /**
   * @generateId
   * @method POST
   * @description Generate a new player id
   */
  generateId({ request, response }: HttpContext) {
    const body = request.body()
    
    return response.json({ playerId: firebaseService.db().collection(`games/${body.gameCode}/players`).doc().id})
  }
}