// import type { HttpContext } from '@adonisjs/core/http'

import { firebaseService } from "#start/kernel";
import { HttpContext } from "@adonisjs/core/http";
import { CollectionReference } from "firebase-admin/firestore";


export default class CardsController {
  private ref: string = 'cards';
  private collection: CollectionReference;

  constructor() {
    this.collection = firebaseService.db().collection(this.ref);
  }

  /**
   * @index
   * @description Get all cards
   * @responseHeader 200 {string} content-type application/json 
   */
  async index() {
    return this.collection.get().then((cards) => {
      return cards.docs.map((card) => card.data())
    })
  }

  /**
   * @show
   * @description Get a card by id
   */
  async get({ params }: HttpContext) {
    console.log(params.id);
    return this.collection.doc(params.id).get().then((card) => {
      return card.data();
    })
  }
}