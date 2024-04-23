import { firebaseService, gameService } from '#start/kernel'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async add({ request, response }: HttpContext) {
    const body = request.body()

    firebaseService.db().collection(`games/${body.gameId}/turns/${gameService.game?.currentTurn}/posts`).add({
      type: body.type,
      content: body.content,
      playerId: body.playerId
    }).then(() => {
      gameService.nextPlayer()
      console.log(`POSTS-CONTROLLER: Turn of ${gameService.game?.currentPlayer?.pseudo}`);
      
      return response.status(200).json({ status: 200, message: 'Post ajouté !' })
    })
  }
}