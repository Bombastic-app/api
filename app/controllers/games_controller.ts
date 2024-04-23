// import type { HttpContext } from '@adonisjs/core/http'

import { firebaseService, gameService } from "#start/kernel";
import { HttpContext } from "@adonisjs/core/http";
import { log } from "console";
import { Timestamp } from "firebase-admin/firestore";

export default class GamesController {
  /**
   * @index
   * @method GET
   */
  async index() {
    return gameService.getPlayers()
  }

  /**
   * @create
   * @description Create a new game in database
   * @method POST
   * @responseHeader 200 {string} content-type application/json 
   */
  async create({ request, response }: HttpContext) {
    const body = request.body()
    console.log(body.playerId);


    const gameRef = firebaseService.db().collection("games").doc(body.gameCode)

    return gameRef.get()
      .then((game) => {
        if (!game.exists) {
          // Create game with gameCode generated
          return gameRef.set({
            timestamp: Timestamp.fromMillis(Date.now())
          }).then(() => gameRef.collection('players').doc(body.playerId).set({
            pseudo: body.pseudo,
            screen: 'waiting'
          }).then(() => response.status(200).json({ status: 200, message: 'Partie créée !' }))
          )
        } else {
          // Regenerate a new gameCode since the first one already exists
          return response.status(500).json({ status: 500, message: 'Ce code de partie est déjà utilisé...', action: 'regenerate' })
        }
      });
  }

  /**
   * @join
   * @description Join a game
   * @method POST
   * @responseHeader 200 {string} content-type application/json 
   */
  async join({ request, response }: HttpContext) {
    const body = request.body()

    if (body.gameCode === undefined || body.gameCode === '' || body.pseudo === undefined || body.pseudo === '') {
      return response.status(500).json({ status: 500, message: 'Veuillez renseigner un code de partie et un pseudo' })
    }

    if (body.gameCode.length !== 6) return response.status(500).json({ status: 500, message: 'Le code de partie doit contenir 6 caractères' })

    const gameRef = firebaseService.db().collection('games').doc(body.gameCode)

    return gameRef.get()
      .then((game) => {
        if (!game.exists) return response.status(404).json({ status: 404, message: 'Cette partie n\'existe pas...' })

        return gameRef.collection('players').add({
          pseudo: body.pseudo,
          screen: 'waiting'
        }).then((player) => {
          console.log(player.id);
          
          response.status(200).json({ status: 200, message: 'Joueur ajouté à la partie !', playerId: player.id })
        })
      })
  }

  /**
   * @start
   * @description Start a game
   * @method POST
   * @responseHeader 200 {string} content-type application/json 
   */
  async start({ request, response }: HttpContext) {
    const body = request.body()

    return firebaseService.db().collection('games').doc(body.gameCode).update({
      ready: true
    }).then(() => {
      return response.status(200).json({ status: 200, message: 'Partie démarrée !' })
    })
  }
}