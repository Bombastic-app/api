enum CardTypes {
  PHOTO = 'photo',
  TWEET = 'tweet',
  NEWS = 'news',
  ACTION = 'action'
}


export default class Card {
  uid: string;
  nfcId: string; 
  title: string;
  type: CardTypes;

  constructor(uid: string, nfcId: string, title: string, type: CardTypes) {
    this.uid = uid;
    this.nfcId = nfcId;
    this.title = title;
    this.type = type;
  }
}