import FirebaseService from '#services/firebase_service'
import type { ApplicationService } from '@adonisjs/core/types'

export default class FirebaseProvider {
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
    this.app.container.singleton('firebaseService', () => {
      return new FirebaseService()
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