import { firebaseService, gameServices } from '#start/kernel'
import type { HttpContext } from '@adonisjs/core/http'
import { Timestamp } from 'firebase-admin/firestore'

export default class PostsController {
  async add(context: HttpContext) {
    const body = context.request.body()
    console.log(gameServices);
    const gameService = gameServices.get(body.gameCode)

    firebaseService.db().collection(`games/${body.gameCode}/turns/${gameService?.game?.currentTurn}/posts`).doc(body.playerId).set({
      type: body.type,
      content: body.content,
      playerId: body.playerId,
      pseudo: body.pseudo,
      timestamp: Timestamp.fromMillis(Date.now())
    }).then(() => {
      const gameService = gameServices.get(body.gameCode)

      gameService?.nextPlayer(context)
      // return response.status(200).json({ status: 200, message: 'Post ajouté !' })
    })
  }
}