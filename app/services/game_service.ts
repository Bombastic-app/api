import Game from "#models/game"
import { firebaseService } from "#start/kernel";
import { HttpContext } from "@adonisjs/core/http";
import Player from "../models/player.js";
import { ServerResponse } from "http";

export default class GameService {
  game?: Game;
  gameCode: string;
  players: any[] = [];

  constructor(gameCode: string) {
    this.gameCode = gameCode;
    firebaseService.db().collection(`games/${this.gameCode}/players`).get()
    .then((players) => {
      this.players = players.docs.map((player) => {
        const data = player.data()
        return new Player(player.id, data.pseudo, data.main)
      })
      this.init()
      
    })
    .catch((error) => {
      return error
    })
    
  }

  private init() {
    const currentPlayer = this.players.find((player) => player.main)
    this.game = new Game(currentPlayer);
    firebaseService.db().collection('games').doc(`${this.gameCode}`).onSnapshot((game) => {
      if (game.data()?.ready) {
        console.log('GAME-SERVICE: Game is ready');
        
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
        console.log(`GAME-SERVICE: New turn ${this.game?.currentTurn} started by ${this.game?.currentPlayer.pseudo}`)
        
      })
      // firebaseService.db().collection(`games/${this.gameCode}/turns/${this.game.currentTurn}/posts`).doc(this.game.currentPlayer.uid).onSnapshot((post) => {
      //   // Card was scanned by the player
      //   // this.game?.currentTurnPosts.push()
      // })
    }
  }

  async nextPlayer({ response }: HttpContext) {
    if (this.game) {
      firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.game.currentPlayer.uid).update({
        current: false
      }).then(() => {
        firebaseService.db().collection(`games/${this.gameCode}/players`).doc(this.players[this.game!.currentPlayerIndex + 1].uid).update({
          current: true
        })
      })
  
      this.game.currentPlayerIndex += 1;
      this.game.currentPlayer = this.players[this.game.currentPlayerIndex];

      console.log('GAME-SERVICE: Next player is ', this.game.currentPlayer.pseudo);
      

      return response.status(200).json({ status: 200, message: "Joueur suivant !" })
    }
  }
}