(function(){

  var that = null;

  // Add level
  function Game(map){
    // this.bubble = new Bubble();
    this.bubbles = [];
    this.map = map;
    // killed bubble numbers
    // this.score = score;
    // bubble goes down time interval
    // this.level = level;
    that = this;
  }

  Game.prototype.init = function(){
    for(var i=0;i<3;i++){
      for(var j=0;j<10;j++){
        if(i%2 != 0 && j==9){
          continue
        }
        var b = new Bubble(80,i,j);
        b.init(this.map);
        this.bubbles.push(b);
      }
    }
  };

  window.Game = Game;

}());
