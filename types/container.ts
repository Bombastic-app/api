import FirebaseService from "#services/firebase_service";
import GamesService from "#services/games_service";

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    firebaseService: FirebaseService,
    gamesService: GamesService
  }
}