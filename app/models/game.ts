import Player from "./player.js";
import Post from "./post.js";

export default class Game {
  currentTurn: number;
  currentPlayer: Player;
  currentTurnPosts: Array<Post>;
  reputationTitle?: Player;
  moneyTitle?: Player;
  followersTitle?: Player;

  constructor(currentPlayer: Player) {
    this.currentTurn = 1;
    this.currentPlayer = currentPlayer;
    this.currentTurnPosts = [];
  }

  // public getCurrentTurn(): number {
  //   return this.currentTurn;
  // }

  // public getCurrentPlayer(): Player {
  //   return this.currentPlayer;
  // }

  // public getCurrentTurnPosts(): Array<Post> {
  //   return this.currentTurnPosts;
  // }

  // public getReputationTitle(): Player | undefined {
  //   return this.reputationTitle;
  // }

  // public getMoneyTitle(): Player | undefined {
  //   return this.moneyTitle;
  // }

  // public getFollowersTitle(): Player | undefined {
  //   return this.followersTitle;
  // }

  // public setCurrentTurn(currentTurn: number): void {
  //   this.currentTurn = currentTurn;
  // }

  // public setCurrentPlayer(currentPlayer: Player): void {
  //   this.currentPlayer = currentPlayer;
  // }

  // public setCurrentTurnPosts(currentTurnPosts: Array<Post>): void {
  //   this.currentTurnPosts = currentTurnPosts;
  // }

  // public setReputationTitle(reputationTitle: Player): void {
  //   this.reputationTitle = reputationTitle;
  // }

  // public setMoneyTitle(moneyTitle: Player): void {
  //   this.moneyTitle = moneyTitle;
  // }

  // public setFollowersTitle(followersTitle: Player): void {
  //   this.followersTitle = followersTitle;
  // }

  // public addPost(post: Post): void {
  //   this.currentTurnPosts.push(post);
  // }
}