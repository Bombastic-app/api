import Game from "#models/game"
import { firebaseService } from "#start/kernel";

export default class GameService {
  private game?: Game;
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
    this.game = new Game(this.players[0]);
    return 'sucess'
  }

  async getPlayers() {
  }
}