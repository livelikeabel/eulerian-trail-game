// Object assign : 첫번째 인자는 target, 두번째 인자부터는 객체가 들어와서 뒤에있는 객체들의 키들을 계속 타겟으로 옮겨줘서 타겟을 리턴하는 함수


// Util layer
const UTIL = {
  el:v=>document.querySelector(v),
  prop:(...arg)=>Object.assign(...arg)
}

// model
const Item = class{
  static GET(type, x, y){return new Item(type, x, y);}
  constructor(_type, _x, _y){
    UTIL.prop(this, {_type, _x, _y, _selected:false, _prev:null});
  }
  get type(){return this._type;}
  get x(){return this._x;}
  get y(){return this._y;}
  get selected(){return this._selected;}
  get prev(){return this._prev;}
  pos(x, y){
    this._x = x;
    this._y = y;
  }
  // single node linked list
  selected(item){
    this._selected = true;
    this._prev = item;
  }
  unselected(){
    this._selected = false;
    this._prev = null;
  }
}

// 게임은 본체이므로 한 개만 있으면 되기 때문에 싱글톤 오브젝트로 생성
const Game = (_=> {
  const column = 8, row = 8, blockSize = 85;
  const data = [];
  let table;
  let startBlock, currBlock, selected = [], isDown;
  
  // 네이티브 객체의 값을 인메모리 객체로 바꾸어주는 변환기 이다.
  const getBlock = (x, y) =>{
    console.log(x, y)
    const {top: T, left:L} = table.getBoundingClientRect();
    console.log('T, L', T,L)
    if(x < L || x > (L + blockSize * column) || y < T || y > (T + blockSize * row)) return null;
    return data[parseInt((y - T) /blockSize)][parseInt((x - L) /blockSize)];
  };

  const el = tag=>document.createElement(tag)
  // 렌더 함수를 호출할 때마다 테이블을 다시 그려주면 비효율 적이다. init시에 row, column만큼 테이블을 미리 만들어 놓기! 렌더에서는 tr, td 안을 갱신한다.

  // null일때 안그려지는 로직이 빠져있다. null일때, 흰 공백이 그려져야 한다.
  const render =_=>{
    table.innerHTML = '';
    data.forEach(row=>table.appendChild(
      row.reduce((tr, block)=>{
        tr.appendChild(el('td')).style.cssText = `
          ${block ? `background:${block.image};
            ${block.selected ? 'background-color: red;'
            : ''}`
          : ''}
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

  const move = ({pageX:x, pageY:y})=>{
    // down이 아니라면 이탈
    if(!isDown) return;
    // console.log('move')
    // x,y 위치의 블록을 얻음
    const curr = getBlock(x, y);
    // 이전블록과 타입이 같고, 인접되어 있는지 검사
    // console.log(startBlock, curr)
    if(!curr || curr.type != startBlock.type || !isNext(curr)) return;
    // 현재 블록이 선택 목록에 없으면 추가
    if(selected.indexOf(curr) == -1) selected.push(curr);
    // 있다면 전전 블록일 경우, 하나 삭제
    else if(selected[selected.length - 2] == curr) selected.pop();
    currBlock = curr;
    // console.log(selected)
    // console.log(currBlock)
    render();
  };

  const isNext = curr=>{
    let r0, c0, r1, c1, cnt = 0;
    //some. 하나라도 true를 반환하면, 루프를 돌지 않는다.
    data.some((row, i)=>{
      let j;
      if((j = row.indexOf(currBlock)) != -1) r0 = i, c0 = j, cnt++;
      if((j = row.indexOf(curr)) != -1) r1 = i, c1 = j, cnt ++;
      return cnt == 2;
    });
    return curr != currBlock && Math.abs(r0 - r1) == 1 || Math.abs(c0 - c1) == 1;
  }

  const up =_=>selected.length > 2 ? remove() : reset();

  const reset =_=>{
    startBlock = currBlock = null;
    selected.length = 0;
    isDown = false;
    // console.log('reset')
    render();
  };

  const remove =_=>{
    data.forEach(r=>{ //데이터삭제
      selected.forEach(v=>{
        let i;
        if((i = r.indexOf(v)) != -1) r[i] = null;
      });
    });
    render();
    setTimeout(drop, 300);
  };

  // 일단 넘어가고, 나중에 다시 보자...
  const drop =_=>{
    let isNext = false; // 머하는 앨까?
    for(let j = 0; j < column; j++){
      for(let i = row - 1; i < -1; i--){
        if(!data[i][j] && i){
          let k = i, isEmpty = true;
          while(k--) if(data[k][j]){
            isEmpty = false;
            break;
          }
          if(isEmpty) break;
          isNext = true;
          while(i--){
            data[i + 1][j] = data[i][j];
            data[i][j] = null;
          }
          break;
        }
      }
    }
    render();
    isNext ?
      setTimeout(drop, 300) :
      readyToFill();
  };
  
  const fills = [];
  let fillCnt = 0;
  const readyToFill =_=>{
    fills.length = 0;
    data.some(row=>{
      if(row.indexOf(null) == -1) return true;
      const r = [...row].fill(null);
      fills.push(r);
      row.forEach((v, i)=>!v && (r[i] = Block.GET()));
    });
    fillCnt = 0;
    setTimeout(fill, 300);
  };

  const fill =_=>{
    if(fillCnt > fills.length){
      isDown = false;
      return;
    }
    for(let i = 0; i < fillCnt; i++){
      fills[fills.length - i - 1].forEach((v, j)=>{
        if(v) data[fillCnt - i - 1][j] = v;
      });
    }
    fillCnt++;
    render();
    setTimeout(fill, 300);
  };

  return tid => {
    table = document.querySelector(tid);
    for(let i = 0; i < row; i++) {
      const r = [];
      data.push(r);
      for(let j = 0; j < column; j++) r[j] = Block.GET();
    }
    table.addEventListener('mousedown', down);
    table.addEventListener('mouseup', up);
    table.addEventListener('mouseleave', up);
    table.addEventListener('mousemove', move);
    // console.log(table)
    render();
  };
})();
Game('#stage');