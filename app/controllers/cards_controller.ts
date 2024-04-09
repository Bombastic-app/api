// import type { HttpContext } from '@adonisjs/core/http'

import { firebaseService } from "#start/kernel";
import { CollectionReference } from "firebase-admin/firestore";


export default class CardsController {
  private ref: string = 'cards';
  private collection: CollectionReference;

  constructor() {
    this.collection = firebaseService.db().collection(this.ref);
  }

  async index() {
    const cards = await this.collection.get()
    return cards.docs.map((card) => card.data())
  }
}