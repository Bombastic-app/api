import { firebaseService } from '#start/kernel'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async add({ request, response }: HttpContext) {
    const body = request.body()

    firebaseService.db().collection(`games/${body.gameId}/posts`).add({
      type: body.type,
      content: body.content,
      playerId: body.playerId
    }).then(() => {
      return response.status(200).json({ status: 200, message: 'Post ajouté !' })
    })
  }
}