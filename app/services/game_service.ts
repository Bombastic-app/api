import Game from "#models/game"
import { firebaseService } from "#start/kernel";
import { HttpContext } from "@adonisjs/core/http";
import Player from "../models/player.js";

export default class GameService {
  game?: Game;
  gameCode: string;
  players: any[] = [];

  constructor(gameCode: string) {
    this.gameCode = gameCode;

    firebaseService.db().collection(`games/${this.gameCode}/players`).get()
      .then((players) => {
        players.docs.map((player) => {
          const data = player.data()
          this.players.push(new Player(player.id, data.pseudo, data.main, data.index))
        })

        // this.players = players.docs.map((player) => {
        //   const data = player.data()
        //   return new Player(player.id, data.pseudo, data.main)
        // })
        this.init()
      })
      .catch((error) => {
        return error
      })

  }

  public init() {
    const currentPlayer = this.players.find((player) => player.main)
    this.game = new Game(currentPlayer);
    firebaseService.db().collection('games').doc(`${this.gameCode}`).onSnapshot((game) => {
      if (game.data()?.ready) {
        console.log(`GAME-SERVICE ${this.gameCode}: Game is ready`);

        this.newTurn()
      }
    })
  }

  async newTurn() {
    if (this.game) {
      this.game.currentTurn += 1;

      firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.game.currentPlayer.uid).update({
        current: true
      }).then(() => {
        console.log(`GAME-SERVICE ${this.gameCode} : New turn ${this.game?.currentTurn} started by ${this.game?.currentPlayer.pseudo}`)

      })
      // firebaseService.db().collection(`games/${this.gameCode}/turns/${this.game.currentTurn}/posts`).doc(this.game.currentPlayer.uid).onSnapshot((post) => {
      //   // Card was scanned by the player
      //   // this.game?.currentTurnPosts.push()
      // })
    }
  }

  async nextPlayer({ response }: HttpContext) {
    if (this.game) {
      console.log(this.game.currentPlayerIndex, this.players.length);
      
      if (this.game.currentPlayerIndex === this.players.length - 1) {
        return firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.players[this.game.currentPlayerIndex].uid).update({
          current: false
        }).then(() => {
          return firebaseService.db().collection(`games/${this.gameCode}/turns`).doc(this.game!.currentTurn.toString()).update({
            miniGameReady: true
          })
        })

      } else {
        return firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.game.currentPlayer.uid).update({
          current: false
        }).then(async () => {
          this.game!.currentPlayerIndex += 1;
          
          return firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.players.find((player) => player.index === this.game?.currentPlayerIndex).uid).update({
            current: true
          }).then(() => {
            this.game!.currentPlayer = this.players[this.game!.currentPlayerIndex];

            console.log('GAME-SERVICE: Next player is ', this.game!.currentPlayer.pseudo);

            return response.status(200).json({ status: 200, message: "Joueur suivant !" })
          })
            .catch((error) => {
              console.log(error);

            })
        })
      }
    }
  }
}