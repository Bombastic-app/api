import { firebaseService, gameService } from '#start/kernel'
import type { HttpContext } from '@adonisjs/core/http'
import { time } from 'console'
import { Timestamp } from 'firebase-admin/firestore'

export default class PostsController {
  async add(context: HttpContext) {
    const body = context.request.body()

    firebaseService.db().collection(`games/${body.gameId}/turns/${gameService.game?.currentTurn}/posts`).doc(body.playerId).set({
      type: body.type,
      content: body.content,
      playerId: body.playerId,
      timestamp: Timestamp.fromMillis(Date.now())
    }).then(() => {
      gameService.nextPlayer(context)
      // return response.status(200).json({ status: 200, message: 'Post ajouté !' })
    })
  }
}