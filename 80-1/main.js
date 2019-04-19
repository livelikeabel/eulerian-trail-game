const Block = class {
  // 객체지향 할 때, 클래스를 사용하는 경우에는 생성자를 봉인 한다. 무조건 팩토리 클래스를 얻어가게 한다.
  // 받아온 타입을 기억하는데만 관심이 있다.
  constructor(type) {
    this._type = type;
  }
  get image(){return `url('img/${this._type}.png')`;}
  get type(){return this._type;}
}
// static 키워드를 사용해서 안에 넣어도 된다.
// 일관되게 모든 클래스에 똑같은 생성자를 대신하는 static함수를 만들기.
Block.GET = (type = parseInt(Math.random() * 5)) => new Block(type);


// 게임은 본체이므로 한 개만 있으면 되기 때문에 싱글톤 오브젝트로 생성
const Game = (_=> {
  const column = 8, row = 8, blockSize = 80;
  const data = [];
  let table;
  let startBlock, currBlock, selected = [], isDown;
  
  // 네이티브 객체의 값을 인메모리 객체로 바꾸어주는 변환기 이다.
  const getBlock = (x, y) =>{
    const {top: T, left:L} = table.getBoundingClientRect();
    if(x < L || x > (L + blockSize * column) || y < T || y > (T + blockSize * row)) return null;
    return data[parseInt((y - T) /blockSize)][parseInt((x - L) /blockSize)];
  };

  const init = tid => {
    table = document.querySelector(tid);
    for(let i = 0; i < row; i++) {
      const r = [];
      data.push(r);
      for(let j = 0; j < column; j++) r[j] = Block.GET();
    }
    // 테이블에 이벤트 걸기
    table.addEventListener('mousedown', down);
    table.addEventListener('mouseup', up);
    table.addEventListener('mouseleave', up);
    table.addEventListener('mousemove', move);
    render();
  };

  const el = tag=>document.createElement(tag)
  // 렌더 함수를 호출할 때마다 테이블을 다시 그려주면 비효율 적이다. init시에 row, column만큼 테이블을 미리 만들어 놓기! 렌더에서는 tr, td 안을 갱신한다.
  const render =_=>{
    table.innerHTML = '';
    data.forEach(row=>table.appendChild(
      row.reduce((tr, block)=>{
        tr.appendChild(el('td')).style.cssText = `
          ${blcok ? `background:${block.image};` : ''}
          width:${blockSize}px;
          height:${blockSize}px;
          cursor:pointer`;
        return tr;
      }, el('tr')))
    );
  };

  const down = ({pageX: x, pageY: y})=>{
    if(isDown) return;
    const curr = getBlock(x, y);
    if(!curr) return;
    isDown = true;
    selected.length = 0;
    selected[0] = startBlock = currBlock = curr;
    render();
  };

})();