import { firebaseService } from '#start/kernel';
import FirebaseService from '#services/firebase_service';
import GamesService from '#services/games_service';
import { inject } from '@adonisjs/core';
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
}