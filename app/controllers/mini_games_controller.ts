import { HttpContext } from "@adonisjs/core/http";
import app from '@adonisjs/core/services/app';

export default class MiniGamesController {
  constructor() {}

  /**
   * @start
   * @summary Start the mini game
   * @method POST
   * @responseBody 200 - { "status": 200, "message": "réponse validée pour 2pUYxkCWhjXuygSnq7wD !"" }
   */
  async start({ request, response }: HttpContext) {
    // Start the mini game
    const body = request.body()
    const gamesServices = await app.container.make('gamesService')
    const firebaseService = await app.container.make('firebaseService')

    const gameService = gamesServices.games.get(body.gameCode)

    return firebaseService.db().collection(`games/${body.gameCode}/turns/${gameService?.currentTurn}/miniGame`).doc(body.playerId).set({
      ready: true
    }).then(() => {
      return response.status(200).json({ status: 200, message: `Réponse validée pour ${body.playerId} !` })
    })
  }

  async vote({ request, response }: HttpContext) {
    const firebaseService = await app.container.make('firebaseService');
    const body = request.body()

    return firebaseService.db()
      .collection(`games/${body.gameCode}/turns/${body.currentTurn}/miniGameVotes`).doc(body.playerId).set({
        for: body.vote
      })
      .then(() => {
        this.checkVotes(body.gameCode, body.currentTurn);
        return response.status(200).json({ status: 200, message: 'Vote du mini-jeu ajouté !' })
      })
      .catch((error) => {
        console.log("Erreur lors de l'ajout du vote du mini-jeu : ", error);
      });
  }

  async checkVotes(gameCode: number, currentTurn: number) {
    const firebaseService = await app.container.make('firebaseService');

    interface Occurrences {
      [id: string]: number;
    }
    
    firebaseService.db()
      .collection(`games/${gameCode}/turns/${currentTurn}/miniGameVotes`)
      .get()
      .then((docs) => {
        if (docs.size === 2) {
          const occurrences: Occurrences = {};
          let maxOccurrence = 0;
          const mostFrequentIds: string[] = [];
  
          for (const doc of docs.docs) {
            const id = doc.data().for;
            occurrences[id] = (occurrences[id] || 0) + 1;
  
            if (occurrences[id] > maxOccurrence) {
              maxOccurrence = occurrences[id];
              mostFrequentIds.length = 0;
              mostFrequentIds.push(id);
            } else if (occurrences[id] === maxOccurrence) {
              mostFrequentIds.push(id);
            }
          }
  
          firebaseService.db()
            .collection(`games/${gameCode}/turns`)
            .doc(`${currentTurn}`)
            .update({
              miniGameWinner: mostFrequentIds[0]
            })
            .then(() => {
              console.log("Vainqueur désigné !");
            })
            .catch((error) => {
              console.log("Erreur lors de l'ajout du vainqueur : ", error);
            });
        }
      })
      .catch((error) => {
        console.log("Erreur lors de la comptabilisation des votes : ", error);
      });
  }
}