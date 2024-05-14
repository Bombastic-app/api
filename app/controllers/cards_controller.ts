import { HttpContext } from "@adonisjs/core/http";
import { CollectionReference } from "firebase-admin/firestore";
import app from '@adonisjs/core/services/app'

export default class CardsController {
  private ref: string = 'cards';
  private collection?: CollectionReference;

  constructor() {
    app.container.make('firebaseService').then((firebaseService) => {
      this.collection = firebaseService.db().collection(this.ref)
    })
  }

  /**
   * @index
   * @method GET
   * @summary Get all cards
   */
  async index() {
    return this.collection?.get().then((cards) => {
      return cards.docs.map((card) => card.data())
    })
  }

  /**
   * @show
   * @method GET
   * @summary Get a card by id
   */
  async get({ params }: HttpContext) {
    return this.collection?.doc(params.id).get().then((card) => {
      return card.data();
    })
  }
}