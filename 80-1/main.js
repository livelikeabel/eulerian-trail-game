const Block = class {
  // 객체지향 할 때, 클래스를 사용하는 경우에는 생성자를 봉인 한다. 무조건 팩토리 클래스를 얻어가게 한다.
  // 받아온 타입을 기억하는데만 관심이 있다.
  constructor(type) {
    this._type = type;
  }
  // get을 어떻게 쓰지...?
  get image(){return `url('img/${this._type}.png')`;}
  get type(){return this._type;}
}
// static 키워드를 사용해서 안에 넣어도 된다.
// 일관되게 모든 클래스에 똑같은 생성자를 대신하는 static함수를 만들기.
Block.GET = (type = parseInt(Math.random() * 5)) => new Block(type);


const b = Block.GET();
console.log(b);
console.log(b.image);
console.log(b.type);
