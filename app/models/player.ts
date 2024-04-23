export default class Player {
  uid: string;
  pseudo: string;
  main?: boolean;
  profilePicture?: any;
  biography?: string;
  contents?: Array<string>;
  reputation: any;
  money: any;
  followers: any;
  points: number;

  constructor(uid: string, pseudo: string, main: boolean = false, profilePicture: any = '', biography: string = '', contents: Array<string> = []) {
    this.uid = uid;
    this.pseudo = pseudo;
    this.profilePicture = profilePicture;
    this.biography = biography;
    this.contents = contents;
    this.main = main;
    this.reputation = 0;
    this.money = 0;
    this.followers = 0;
    this.points = 0;
  }
}