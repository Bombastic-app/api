import Game from "#models/game"
import { firebaseService } from "#start/kernel";

export default class GameService {
  private game?: Game;
  private gameCode: string;
  private players: any[] = [];

  constructor(gameCode: string) {
    this.gameCode = gameCode;
    firebaseService.db().collection(`groups/123456/games/${this.gameCode}/players`).get()
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
    firebaseService.db().collection(`groups/123456/games/${this.gameCode}/players`).doc('Lmy34r3iRMJkUYBORz2Q').set({
      screen: 'Crocrotte joue'
    })
    return 'sucess'
  }

  async getPlayers() {
  }


}