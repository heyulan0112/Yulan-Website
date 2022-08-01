(function(){

  var elements = [];

  function Food(width,height,color,x,y){
    this.width = width || 20;
    this.height = height || 20;
    this.color = color || "#417D7A";
    this.x = x || 0;
    this.y = y || 0;
  }

  Food.prototype.init = function(map) {
    remove();
    var div = document.createElement("div");
    map.appendChild(div);
    div.style.width = this.width + "px";
    div.style.height = this.height + "px";
    div.style.backgroundColor = this.color;
    div.style.position = "absolute";
    this.x = parseInt(Math.random() * (map.offsetWidth/this.width)) * this.width;
    this.y = parseInt(Math.random() * (map.offsetHeight/this.height)) * this.height;
    div.style.left = this.x + "px";
    div.style.top = this.y + "px";
    elements.push(div);
  };

  function remove(){
    for(var i=0; i<elements.length; i++){
      var ele=elements[i];
      ele.parentNode.removeChild(ele);
      elements.splice(i,1);
    }
  }

  window.Food = Food;

 }());
