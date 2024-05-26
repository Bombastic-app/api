import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';
import { Timestamp } from 'firebase-admin/firestore'

export default class PostsController {
  constructor() {}

  async add(context: HttpContext) {
    const body = context.request.body()
    const firebaseService = await app.container.make('firebaseService')
    const gamesService = await app.container.make('gamesService')
    const gameService = gamesService.games.get(body.gameCode)

    firebaseService.db().collection(`games/${body.gameCode}/turns/${gameService?.currentTurn}/posts`).doc(body.playerId).set({
      type: body.type,
      content: body.content,
      playerId: body.playerId,
      pseudo: body.pseudo,
      timestamp: Timestamp.fromMillis(Date.now())
    }).then(() => {
      const gameService = gamesService.games.get(body.gameCode)

      gameService?.nextPlayer(context)
      // return response.status(200).json({ status: 200, message: 'Post ajouté !' })
    })
  }

  /**
   * @addComment
   * @method POST
   * @summary Add comment to post
   */
  async addComment({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const body = request.body()

    return firebaseService.db()
      .collection(`games/${body.gameCode}/turns/${body.currentTurn}/posts/${body.author}/comments`)
      .add({
        content: body.content,
        playerId: body.playerId,
        pseudo: body.pseudo,
        timestamp: Timestamp.fromMillis(Date.now()),
      })
      .then(() => {
        return response.status(200).json({ status: 200, message: 'Commentaire ajouté !' })
      })
      .catch((error) => {
        console.log("Erreur lors de l'ajout du commentaire : ", error);
      });
  }

  /**
   * @addComment
   * @method POST
   * @summary Delete comment from post
   */
  async deleteComment({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const body = request.body()

    return firebaseService.db()
      .collection(`games/${body.gameCode}/turns/${body.currentTurn}/posts/${body.author}/comments`)
      .doc(body.id)
      .delete()
      .then(() => {
        return response.status(200).json({ status: 200, message: 'Commentaire supprimé !' })
      })
      .catch((error) => {
        console.log("Erreur lors de la suppression du commentaire : ", error);
      });
  }
}