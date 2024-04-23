import Game from "#models/game"
import { firebaseService } from "#start/kernel";
import Player from "../models/player.js";

export default class GameService {
  public game?: Game;
  private gameCode: string;
  private players: any[] = [];

  constructor(gameCode: string) {
    this.gameCode = gameCode;
    firebaseService.db().collection(`games/${this.gameCode}/players`).get()
    .then((players) => {
      this.players = players.docs.map((player) => player.data())
      this.init()
    })
    .catch((error) => {
      return error
    })
    
  }

  private init() {
    const player = new Player(this.players[0].uid, this.players[0].pseudo, null, '', [])
    this.game = new Game(player);
    // this.newTurn()
  }

  async newTurn() {
    if (this.game) {
      this.game.currentTurn += 1;
      
      firebaseService.db().collection(`games/${this.gameCode}/turns/${this.game.currentTurn}/posts`).doc(this.game.currentPlayer.uid).onSnapshot((post) => {
        // Card was scanned by the player
        // this.game?.currentTurnPosts.push()
      })
    }
  }

  async getPlayers() {
  }
}