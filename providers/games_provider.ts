import GamesService from '#services/games_service'
import type { ApplicationService } from '@adonisjs/core/types'

export default class GamesProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    this.app.container.singleton('gamesService', () => {
      return new GamesService()
    })
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}