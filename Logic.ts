class Logic {
  roomId: string;
  food: string;
  p1Pos: string;
  p2Pos: string;
  start: boolean;
  p1Score: number;
  p2Score: number;
  endGame: boolean;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.food = '15,15';
    this.p1Pos = '10,10';
    this.p2Pos = '10,20';
    this.start = false;
    this.p1Score = 0;
    this.p2Score = 0;
    this.endGame = false;
  }

  updateFood(pos:string)  {
    this.food = pos;
  }

  updateP1Pos(pos:string) {
    this.p1Pos = pos;
  }

  updateP2Pos(pos:string) {
    this.p2Pos = pos;
  }

  updateStart(start:boolean) {
    this.start = start;
  }

  updateP1Score(score:number) {
    this.p1Score = score;
  }

  updateP2Score(score:number) {
    this.p2Score = score;
  }

  updateEndgame(end:boolean) {
    this.endGame = end;
  }


}

export default Logic;