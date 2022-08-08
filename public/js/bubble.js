(function(){

  var bubble_colors = ["#F05454","#4FD3C4","#533E85","#D6D5A8","#FFAC41"];

  function Bubble(diameter,row,column){
    this.diameter = diameter || 80;
    this.color = parseInt(Math.random()*5,0);
    this.row = row || 0;
    this.column = column || 0;
  }

  Bubble.prototype.init = function(map) {
    // remove();
    var div = document.createElement("div");
    map.appendChild(div);
    div.style.borderRadius = 50 + "px";
    div.style.width = this.diameter + "px";
    div.style.height = this.diameter + "px";
    div.style.backgroundColor = bubble_colors[this.color];
    div.style.position = "absolute";
    div.style.zindex = "2";
    if(this.row % 2 == 0){
      // even
      this.x = this.diameter + (this.column-1)*this.diameter;
    }
    else{
      // odd
      this.x = (3*this.diameter)/2 + (this.column-1)*this.diameter;
    }
    this.y = this.row * (Math.sqrt(3)/2)*this.diameter;
    div.style.left = this.x + "px";
    div.style.top = this.y + "px";
    // elements.push(div);
  };

  window.Bubble = Bubble;

 }());
