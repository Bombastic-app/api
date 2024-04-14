/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const CardsController = () => import('#controllers/cards_controller')
const PlayersController = () => import('#controllers/players_controller')
const GamesController = () => import('#controllers/games_controller')
import router from '@adonisjs/core/services/router'
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";

// returns swagger in YAML
router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
  // return AutoSwagger.default.scalar("/swagger", swagger); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", swagger); to use RapiDoc instead
});

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/** Cards */
router.get('cards', [CardsController, 'index'])
router.get('card/:id', [CardsController, 'get'])

/** Players */
router.post('players/add', [PlayersController, 'add'])

/** Games */
router.get('games', [GamesController, 'index'])