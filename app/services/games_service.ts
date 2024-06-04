import Game from "#models/game"
import app from '@adonisjs/core/services/app';

export default class GamesService {
  games: Map<string, Game> = new Map<string, Game>();
  
  constructor() {
    app.container.make('firebaseService').then((firebaseService) => {
      firebaseService.db().collection('currentGames').get().then((currentGames) => {
        currentGames.forEach((currentGame) => {
          this.games.set(currentGame.id, new Game(currentGame.id, firebaseService))
        })
      })
    })
  }
}