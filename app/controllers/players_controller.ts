import { HttpContext } from "@adonisjs/core/http";
import app from '@adonisjs/core/services/app';

export default class PlayersController {

  /**
   * @generateId
   * @method POST
   * @summary Generate a new player id
   */
  async generateId({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const body = request.body()
    
    // TODO: add error handling
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

    const calculateValueWithLimits = (value: number) => {
      return value > 0 ? (value > 100 ? 100 : value) : 1;
    };

    const path = firebaseService.db().collection(`games/${body.gameCode}/players`).doc(body.playerId);
    return firebaseService.db()
      .runTransaction((transaction) => {
        return transaction.get(path).then((doc) => {
          const sumReputation = doc.data()?.reputation + body.reputation;
          const reputation = calculateValueWithLimits(sumReputation);

          const sumFollowers = doc.data()?.followers + body.followers;
          const followers = calculateValueWithLimits(sumFollowers);

          const sumMoney = doc.data()?.money + body.money;
          const money = calculateValueWithLimits(sumMoney);

          return transaction.update(path, { reputation, followers, money });
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

  /**
   * @setScore
   * @method POST
   * @summary Set score of a specific player
   */
  async setScore({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const body = request.body()

    return firebaseService.db()
      .collection(`games/${body.gameCode}/players`).doc(body.playerId)
      .update({
        score: body.score
      })
      .then(() => {
        return response.status(200).json({ status: 200, message: 'Score mis à jour' })
      })
  }

  /**
   * @getScore
   * @method GET
   * @summary Get score of a specific player
   */
  async getScore({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')

    return firebaseService.db()
      .collection(`games/${request.param('gameCode')}/players`).doc(request.param('playerId'))
      .get()
      .then((doc) => {
        return response.status(200).json({ status: 200, score: doc.data()?.score })
      })
  }
}