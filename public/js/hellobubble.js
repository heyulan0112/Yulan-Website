(function(){

  var that = null;
  // var curBubble = new Bubble(80,7,4);

  // Add level
  function Game(map){
    // this.bubble = new Bubble();
    this.bubbles = [];
    this.map = map;
    this.curBubble = new Bubble(80,7,4);
    // killed bubble numbers
    // this.score = score;
    // bubble goes down time interval
    // this.level = level;
    that = this;
  }

  Game.prototype.init = function(){
    this.curBubble.init(this.map);
    for(var i=0;i<8;i++){
      this.bubbles[i] = new Array(10,null);
    }
    for(var i=0;i<3;i++){
      for(var j=0;j<10;j++){
        if(i%2 != 0 && j==9){
          this.bubbles[i][j] = null;
          continue;
        }
        var b = new Bubble(80,i,j);
        b.init(this.map);
        this.bubbles[i][j] = b;
      }
    }
    // Add level
    // this.runSnake(this.food,this.map,this.score,this.level);
    this.runBubble(this.map,this.curBubble,this.bubbles);
    // this.bindKey();
  };

  Game.prototype.runBubble = function(map,curBubble,bubbles){
    var map_col = map.offsetWidth / this.curBubble.width;
    document.addEventListener("mouseup",function(e){
      // mouseup and emit bubble
      var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      var mouse_x = e.pageX || e.clientX + scrollX;
      var mouse_y = e.pageY || e.clientY + scrollY;
      mouse_x = parseInt(mouse_x);
      mouse_y = parseInt(mouse_y);
      var curr_row = (Math.sqrt(3)*2*(mouse_y-80)/(3*80)).toFixed(0);
      curr_row = curr_row - 1;
      var curr_col = 0;
      if(curr_row%2 == 0){
        // even line
        curr_col = ((mouse_x-280)/80).toFixed(0);
        curr_col = curr_col-1;
        if(curr_col<0){
          curr_col = 0;
        }
        if(curr_col>=map_col){
          curr_col = map_col-1;
        }
      }
      else{
        curr_col = ((mouse_x-280)/80 - 0.5).toFixed(0);
        if(curr_col<0){
          curr_col = 0;
        }
        if(curr_col>=map_col){
          curr_col = map_col-1;
        }
      }
      curr_row = parseInt(curr_row);
      curr_col = parseInt(curr_col);
      var radian = Math.atan((7-curr_row)/(curr_col - 4));
      var angle = 180 / Math.PI * radian;
      if(curr_col<4){
        angle = angle + 180;
      }
      // alert(angle);
      // var timeId = setInterval(function(){
      var f = true;
      while(f){
        var i = bubbles.length - 1;
        for(;i>=0;i--){
          for(var j=0; j<bubbles[i].length; j++){
            if(bubbles[i][j] == null){
              continue;
            }
            var len = Math.sqrt(Math.pow(parseFloat(bubbles[i][j].x) - parseFloat(curBubble.x),2) + Math.pow(parseFloat(bubbles[i][j].y) - parseFloat(curBubble.y),2));
            if(len <= 80){
              // clearInterval(timeId);
              // var r = (Math.sqrt(3)*2*(curBubble.y)/(3*80)).toFixed(0) - 1;
              // curBubble.row = r;
              // curBubble.y = r * (Math.sqrt(3)/2)*curBubble.diameter;
              // var c = 0;
              // if(r%2 == 0){
              //   c = ((curBubble.x)/80).toFixed(0) - 1;
              //   curBubble.column = c;
              //   curBubble.x = curBubble.diameter + (c-1)*curBubble.diameter;
              // }
              // else{
              //   c = ((curBubble.x)/80 - 0.5).toFixed(0);
              //   curBubble.column = c;
              //   curBubble.x = (3*curBubble.diameter)/2 + (c-1)*curBubble.diameter;
              // }
              // console.log(r + "+" + c + "+" + len);
              f = false;
              break;
            }
          }
          if(f == false){
            break;
          }
        }
        if(f==false){
          break;
        }
        if(angle<90 && angle>0){
          //右边
          curBubble.x += 80;
          curBubble.y = curBubble.y - 80 * (parseFloat(Math.abs(7 - curr_row)/Math.abs(curr_col - 4)));
          curBubble.ele.style.left = curBubble.x + "px";
          curBubble.ele.style.top = curBubble.y + "px";
        }
        else if(angle>90 && angle < 180){
          //左边
          curBubble.x -= 80;
          curBubble.y = curBubble.y - 80 * (parseFloat(Math.abs(7 - curr_row)/Math.abs(curr_col - 4)));
          curBubble.ele.style.left = curBubble.x + "px";
          curBubble.ele.style.top =curBubble.y + "px";
        }
        if(angle == 90){
          curBubble.y = curBubble.y - 80;
          curBubble.ele.style.top = curBubble.y + "px";
        }
      }
      // }.bind(that),100);
      curBubble = new Bubble(80,7,4);
      curBubble.init(map);
      console.log(this.curBubble);
    },false);
  };

  window.Game = Game;

}());
