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

  /**
   * @updateStatistics
   * @method POST
   * @summary Update the statistics of a player
   */
  async updateStatistics({ request, response }: HttpContext) {
    const body = request.body()
    const firebaseService = await app.container.make('firebaseService')

    const path = firebaseService.db().collection(`games/${body.gameCode}/players`).doc(body.playerId);
    return firebaseService.db()
      .runTransaction((transaction) => {
        return transaction.get(path).then((doc) => {
          const newReputation = doc.data()?.reputation + body.reputation;
          const newFollowers = doc.data()?.followers + body.followers;
          const newMoney = doc.data()?.money + body.money;
          return transaction.update(path, { reputation: newReputation, followers: newFollowers, money: newMoney });
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

  /**
   * @addBio
   * @method POST
   * @summary Add biography to a specific player
   */
  async addBio({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const body = request.body()

    return firebaseService.db()
      .collection(`games/${body.gameCode}/players`).doc(body.playerId)
      .update({ biography: body.biography })
      .then(() => {
        return response.status(200).json({ status: 200, message: 'Biographie ajoutée !' })
      })
      .catch((error) => {
        console.log("Erreur lors de la modification de la biographie : ", error);
      });
  }

  /**
   * @getBio
   * @method GET
   * @summary Get biography of a specific player
   */
  async getBio({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')

    return firebaseService.db()
      .collection(`games/${request.param('gameCode')}/players`).doc(request.param('playerId'))
      .get()
      .then((doc) => {
        return response.status(200).json({ status: 200, biography: doc.data()?.biography })
      })
  }
}