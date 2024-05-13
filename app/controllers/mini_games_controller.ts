// import type { HttpContext } from '@adonisjs/core/http'

import { firebaseService, gameServices } from "#start/kernel";
import { HttpContext } from "@adonisjs/core/http";

export default class MiniGamesController {
  /**
   * @start
   * @description Start the mini game
   * @method POST
   * @responseHeader 200 {string} content-type application/json
   */
  start({ request, response }: HttpContext) {
    // Start the mini game
    const body = request.body()
    const gameService = gameServices.get(body.gameCode)

    firebaseService.db().collection(`games/${body.gameCode}/turns/${gameService?.game?.currentTurn}/miniGame`).doc(body.playerId).set({
      ready: true
    }).then(() => {
      return response.status(200).json({ status: 200, message: `réponse validée pour ${body.playerId} !` })
    })
  }
}