import FirebaseService from '#services/firebase_service';
import { HttpContext } from '@adonisjs/core/http';
import Player from "./player.js";
import Post from "./post.js";
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { inject } from '@adonisjs/core';

@inject()
export default class Game {
  currentTurn: number;
  currentPlayer?: Player;
  currentPlayerIndex: number = 0;
  currentTurnPosts: Array<Post>;
  reputationTitle?: Player;
  moneyTitle?: Player;
  followersTitle?: Player;
  gameCode: string;
  players: any[] = [];

  constructor(gameCode: string, protected firebaseService: FirebaseService) {
    this.currentTurn = 0;
    this.currentTurnPosts = [];
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
    this.currentPlayer = this.players.find((player) => player.main)
    this.firebaseService.db().collection('games').doc(`${this.gameCode}`).onSnapshot((game: DocumentSnapshot) => {
      if (game.data()?.ready) {
        console.log(`GAME-SERVICE ${this.gameCode}: Game is ready`);

        this.newTurn()
      }
    })
  }

  async newTurn() {
    this.currentTurn += 1;

    this.firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.currentPlayer!.uid).update({
      current: true
    }).then(() => {
      console.log(`GAME-SERVICE ${this.gameCode} : New turn ${this.currentTurn} started by ${this.currentPlayer!.pseudo}`)

    })
    // this.firebaseService.db().collection(`games/${this.gameCode}/turns/${this.game.currentTurn}/posts`).doc(this.game.currentPlayer.uid).onSnapshot((post) => {
    //   // Card was scanned by the player
    //   // this.game?.currentTurnPosts.push()
    // })
  }

  async nextPlayer({ response }: HttpContext) {
    console.log(this.currentPlayerIndex, this.players.length);

    if (this.currentPlayerIndex === this.players.length - 1) {
      return this.firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.players[this.currentPlayerIndex].uid).update({
        current: false
      }).then(() => {
        return this.firebaseService.db().collection(`games/${this.gameCode}/turns`).doc(this.currentTurn.toString()).update({
          miniGameReady: true
        })
      })

    } else {
      return this.firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.currentPlayer!.uid).update({
        current: false
      }).then(async () => {
        this.currentPlayerIndex += 1;

        return this.firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.players.find((player) => player.index === this.currentPlayerIndex).uid).update({
          current: true
        }).then(() => {
          this.currentPlayer = this.players[this.currentPlayerIndex];

          console.log('GAME-SERVICE: Next player is ', this.currentPlayer!.pseudo);

          return response.status(200).json({ status: 200, message: "Joueur suivant !" })
        })
          .catch((error: Error) => {
            console.log(error);
          })
      })
    }
  }
}