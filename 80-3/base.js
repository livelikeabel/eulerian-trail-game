let debugMode = 'debug'; // debug, log, none
const err = msg => {
  switch (debugMode) {
    case 'log':
      console.log(msg);
      return false;
    case 'none': return false;
    default: throw mag;
  }
}
const Item = class {
  constructor(_game, _type, _x, _y) {
    if(!_game) return err(`invalid game:${game}`);
    prop(this, {
      _game, _type, _x, _y,
      _isSelected:null, _previousSelected:null,
      _isActionActivated: false
    })
  }

  get type() {}
  get x() {return this._x}
  get y() {}

  get isSelected() {}
  get previousSelected() {}

  get isActionActivated() {}

  isBorder(item) {
    const {x: ix, y: iy} = item, {x: tx, y: ty} = this;
    return this != item &&
      Math.abs(ix - tx) < 2 &&
      Math.abs(iy - ty) < 2
  }
  setPos(x, y) {
    this.x = x, this.y = y;
  }

  // 변수명 과제로.
  isSelectedList(item) {
    const {_previousSelected: prev} = this;
    if (!prev) return false;
    if (prev == item) return true;
    return prev.isSelectedList(item);
  }
  select(previousItem) {
    this._selected = true;
    this._previousSelected = previousItem;
  }
  unselect() {
    this._isSelected = false;
    this._previousSelected = null;
  }
  
  action(){return this._action();}
  queAction(){this._queAction();}
  _action(){return false;}
  _qeuAction(){throw 'override'}
}