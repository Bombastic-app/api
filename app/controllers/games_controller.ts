// import type { HttpContext } from '@adonisjs/core/http'

import { gameService } from "#start/kernel";

export default class GamesController {
  /**
   * @index
   */
  async index() {
    return gameService.getPlayers()
  }
}