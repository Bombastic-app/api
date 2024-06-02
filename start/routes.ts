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
const PostsController = () => import('#controllers/posts_controller')
const MiniGamesController = () => import('#controllers/mini_games_controller')
import router from '@adonisjs/core/services/router'
import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";

// returns swagger in YAML
router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
  // return AutoSwagger.default.ui("/swagger", swagger);
  // return AutoSwagger.default.scalar("/swagger");
  return AutoSwagger.default.rapidoc("/swagger", 'read');
});

/** Cards */
router.get('cards', [CardsController, 'index'])
router.get('card/:id', [CardsController, 'get'])

/** Players */
router.post('player/generateId', [PlayersController, 'generateId'])
router.post('player/stats', [PlayersController, 'updateStatistics'])
router.post('player/bio', [PlayersController, 'addBio'])
router.get('player/:gameCode/bio/:playerId', [PlayersController, 'getBio'])
router.get('player/:gameCode/score/:playerId', [PlayersController, 'getScore'])
router.get('players/get/:gameCode', [PlayersController, 'getPlayers'])

/** Games */
router.post('game/create', [GamesController, 'create'])
router.post('game/join', [GamesController, 'join'])
router.post('game/start', [GamesController, 'start'])
router.get('/game/reset/:gameCode', [GamesController, 'reset'])

/** Posts */
router.post('post/add', [PostsController, 'add'])
router.post('post/comment/add', [PostsController, 'addComment'])
router.post('post/comment/delete', [PostsController, 'deleteComment'])
router.post('post/like', [PostsController, 'like'])
router.post('post/dislike', [PostsController, 'dislike'])

/** Mini-games */
router.post('mini-game/start', [MiniGamesController, 'start'])