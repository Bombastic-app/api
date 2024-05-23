import { HttpContext } from "@adonisjs/core/http";
import app from '@adonisjs/core/services/app';

export default class PlayersController {
  // /**
  //  * @add
  //  * @summary Add a player to a game
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
   * @summary Generate a new player id
   */
  async generateId({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const body = request.body()
    
    return response.json({ playerId: firebaseService.db().collection(`games/${body.gameCode}/players`).doc().id})
  }

  async getPlayers({ params }: HttpContext) {
    const gamesService = await app.container.make('gamesService')
    const gameCode = params.gameCode

    return gamesService.games.get(gameCode)?.players
  } 

  async updateStatistics({ request, response }: HttpContext) {
    const body = request.body()
    const firebaseService = await app.container.make('firebaseService')

    const path = firebaseService.db().collection(`games/${body.gameCode}/players`).doc(body.playerId);
    firebaseService.db()
      .runTransaction((transaction) => {
        return transaction.get(path).then((doc) => {
          const newReputation = doc.data()?.reputation + body.reputation;
          const newFollowers = doc.data()?.followers + body.followers;
          const newMoney = doc.data()?.money + body.money;
          transaction.update(path, { reputation: newReputation, followers: newFollowers, money: newMoney });
        });
      })
      .then(() => {
        console.log("Player statistics updated !");
        return response.status(200).json({ status: 200, message: 'Player statistics updated !' })
      })
      .catch((error) => {
        console.log("Transaction failed: ", error);
      });
  }
}