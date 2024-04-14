import { Timestamp } from "firebase-admin/firestore";

export default class Post {
  uid: string;
  cardId: string;
  playerId: string;
  content: string; 
  timestamp: Timestamp;
  image: any;
  reputation: any;
  money: any;
  followers: any;
  gameId: string;
  turn: number;

  constructor(uid: string, cardId: string, playerId: string, content: string, timestamp: Timestamp, image: any, reputation: any, money: any, followers: any, gameId: string, turn: number) {
    this.uid = uid;
    this.cardId = cardId;
    this.playerId = playerId;
    this.content = content;
    this.timestamp = timestamp;
    this.image = image;
    this.reputation = reputation;
    this.money = money;
    this.followers = followers;
    this.gameId = gameId;
    this.turn = turn;
  }
}