// import type { HttpContext } from '@adonisjs/core/http'

import Player from "#models/player";
import GameService from "#services/game_service";
import { firebaseService, gameServices } from "#start/kernel";
import { HttpContext } from "@adonisjs/core/http";
import { Timestamp } from "firebase-admin/firestore";

export default class GamesController {
  /**
   * @create
   * @description Create a new game in database
   * @method POST
   * @responseHeader 200 {string} content-type application/json 
   */
  async create({ request, response }: HttpContext) {
    const body = request.body()
    const gameRef = firebaseService.db().collection("games").doc(body.gameCode)
    const currentGameRef = firebaseService.db().collection('currentGames')

    return gameRef.get()
      .then((game) => {
        if (!game.exists) {
          // Create game with gameCode generated
          return gameRef.set({
            timestamp: Timestamp.fromMillis(Date.now()),
            ready: false
          }).then(() => gameRef.collection('players').doc(body.playerId).set({
            pseudo: body.pseudo,
            uid: body.playerId,
            current: true,
            main: true,
            index: 0
          }).then(() => {
            currentGameRef.doc(body.gameCode).set({})
            gameServices.set(body.gameCode, new GameService(body.gameCode))
            response.status(200).json({ status: 200, message: 'Partie créée !' })
          }).then(() => {
            gameRef.collection('turns').doc('1').set({
              miniGameReady: false
            })
          })
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
          current: false,
          main: false,
          index: gameServices.get(body.gameCode)?.players.length
        }).then((player) => {
          player.update({ uid: player.id })
          gameServices.get(body.gameCode)?.players.push(new Player(player.id, body.pseudo, false, gameServices.get(body.gameCode)!.players.length))
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

  async reset({ params }: HttpContext) {
    gameServices.set(params.gameCode, new GameService(params.gameCode))
    setTimeout(() => {
      gameServices.get(params.gameCode)!.game!.currentPlayer = gameServices.get(params.gameCode)!.players[3]
      gameServices.get(params.gameCode)!.game!.currentPlayerIndex = 3
    }, 4000)
    // gameServices[0].init()
  }
}