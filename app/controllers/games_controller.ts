import Player from "#models/player";
import Game from "#models/game";
import { HttpContext } from "@adonisjs/core/http";
import { Timestamp } from "firebase-admin/firestore";
import app from '@adonisjs/core/services/app';

export default class GamesController {
  /**
   * @create
   * @summary Create a new game in database
   * @method Post
   * @requestBody {"gameCode": "123456", "playerId": "2pUYxkCWhjXuygSnq7wD", "pseudo": "Bombastic"}
   * @responseBody 200 - {"status": 200, "message": "Partie créée !"}
   * @responseBody 500 - {"status": 500, "message": "Ce code de partie est déjà utilisé...", "action": "regenerate"}
   */
  async create({ request, response }: HttpContext) {
    const body = request.body()
    const firebaseService = await app.container.make('firebaseService')
    const gamesService = await app.container.make('gamesService')

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
            index: 0,
            reputation: 10,
            followers: 10,
            money: 10,
            biography: '',
            score: 0,
          }).then(() => {
            currentGameRef.doc(body.gameCode).set({})
            gamesService.games.set(body.gameCode, new Game(body.gameCode, firebaseService))
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
   * @summary Join a game
   * @method POST
   * @requestBody {"gameCode": "123456", "pseudo": "Bombastic"}
   * @responseBody 200 - { "status": 200, "message": "Joueur ajouté à la partie !", "playerId": "2pUYxkCWhjXuygSnq7wD" } 
   * @responseBody 404 - { "status": 404, "message": "Cette partie n'existe pas..." }
   * @responseBody 500 - { "status": 500, "message": "Veuillez renseigner un code de partie et un pseudo" }
   */
  async join({ request, response }: HttpContext) {
    const body = request.body()
    const firebaseService = await app.container.make('firebaseService')
    const gamesService = await app.container.make('gamesService')

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
          index: gamesService.games.get(body.gameCode)?.players.length,
          reputation: 10,
          followers: 10,
          money: 10,
          biography: '',
          score: 0,
        }).then((player) => {
          player.update({ uid: player.id })
          gamesService.games.get(body.gameCode)?.players.push(new Player(player.id, body.pseudo, false, gamesService.games.get(body.gameCode)!.players.length))
          response.status(200).json({ status: 200, message: 'Joueur ajouté à la partie !', playerId: player.id })
        })
      })
  }

  /**
   * @start
   * @summary Start a game
   * @method POST
   * @responseBody 200 - { "status": 200, "message": "Partie démarrée !" } 
   */
  async start({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const body = request.body()

    return firebaseService.db().collection('games').doc(body.gameCode).update({
      ready: true
    }).then(() => {
      return response.status(200).json({ status: 200, message: 'Partie démarrée !' })
    })
  }

  /**
   * @reset
   * @summary Reset a game
   * @method GET
   * @paramPath gameCode - Game code to reset
   */
  async reset({ params }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService')
    const gamesService = await app.container.make('gamesService')

    gamesService.games.set(params.gameCode, new Game(params.gameCode, firebaseService))
    setTimeout(() => {
      gamesService.games.get(params.gameCode)!.currentPlayer = gamesService.games.get(params.gameCode)!.players[3]
      gamesService.games.get(params.gameCode)!.currentPlayerIndex = 3
    }, 4000)
  }

  /**
   * 
   * @setTitles
   * @summary Set players with the more of each statistics for the current turn
   * @method POST
   */
  async setTitles({ request, response }: HttpContext) {
    const body = request.body()
    const firebaseService = await app.container.make('firebaseService')
    const gamesService = await app.container.make('gamesService')

    const gameService = gamesService.games.get(body.gameCode)
    
    const currentTurnTitles: any = {
      reputation: '',
      followers: '',
      money: ''
    }

    return firebaseService.db().collection(`games/${body.gameCode}/players`).get().then((players) => {
      let maxReputation = 0
      let maxFollowers = 0
      let maxMoney = 0

      players.docs.forEach((player) => {
        if (player.data().reputation > maxReputation) {
          maxReputation = player.data().reputation
          currentTurnTitles['reputation'] = player.data().uid
        }
        if (player.data().followers > maxFollowers) {
          maxFollowers = player.data().followers
          currentTurnTitles['followers'] = player.data().uid
        }
        if (player.data().money > maxMoney) {
          maxMoney = player.data().money
          currentTurnTitles['money'] = player.data().uid
        }
      })
    }).then(() => {
      firebaseService.db().collection(`games/${body.gameCode}/turns`).doc(`1`).update({
        reputation: currentTurnTitles['reputation'],
        followers: currentTurnTitles['followers'],
        money: currentTurnTitles['money']
      })
      return response.status(200).json({ message: 'Gagnant des statistiques OK' })
    }).catch((error) => {
      return response.status(500).json({ message: 'Erreur lors de la désignation des gagnants des statistiques', error: error })
    })

    // Get players and compare their statistics (reputation, followers, money)
    // Set the player with the most of each statistics as the winner of the turn


  }
}