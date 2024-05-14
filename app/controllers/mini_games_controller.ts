import { HttpContext } from "@adonisjs/core/http";
import app from '@adonisjs/core/services/app';

export default class MiniGamesController {
  constructor() {}

  /**
   * @start
   * @summary Start the mini game
   * @method POST
   * @responseBody 200 - { "status": 200, "message": "réponse validée pour 2pUYxkCWhjXuygSnq7wD !"" }
   */
  async start({ request, response }: HttpContext) {
    // Start the mini game
    const body = request.body()
    const gamesServices = await app.container.make('gamesService')
    const firebaseService = await app.container.make('firebaseService')

    const gameService = gamesServices.games.get(body.gameCode)

    firebaseService.db().collection(`games/${body.gameCode}/turns/${gameService?.currentTurn}/miniGame`).doc(body.playerId).set({
      ready: true
    }).then(() => {
      return response.status(200).json({ status: 200, message: `réponse validée pour ${body.playerId} !` })
    })
  }
}