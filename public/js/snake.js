 (function(){
   var elements=[];

   function Snake(width,height,direction){
     this.width=width||20;
     this.height=height||20;
     this.body=[
       {x:3,y:2,color:"#363062"},
       {x:2,y:2,color:"#827397"},
       {x:1,y:2,color:"#827397"}
     ];
     this.direction=direction||"right";
   }

   Snake.prototype.init=function(map){
     remove();
     for(var i=0;i<this.body.length;i++){
       var obj=this.body[i];
       var div=document.createElement("div");
       map.appendChild(div);
       div.style.position="absolute";
       div.style.width=this.width+"px";
       div.style.height=this.height+"px";
       div.style.left=obj.x*this.width+"px";
       div.style.top=obj.y*this.height+"px";
       div.style.backgroundColor=obj.color;
       elements.push(div);
     }
   };

   Snake.prototype.move=function(food,map) {
     var i=this.body.length-1;
     for(;i>0;i--){
       this.body[i].x=this.body[i-1].x
       this.body[i].y=this.body[i-1].y;
     }
     if(this.direction == "right"){
       this.body[0].x += 1;
     }
     else if(this.direction == "left"){
       this.body[0].x -= 1;
     }
     else if(this.direction == "up"){
       this.body[0].y -= 1;
     }
     else if(this.direction == "down"){
       this.body[0].y += 1;
     }
     var head_x = this.body[0].x * this.width;
     var head_y = this.body[0].y * this.height;
     if(head_x == food.x && head_y == food.y){
       var last = this.body[this.body.length-1];
       this.body.push({
         x:last.x,
         y:last.y,
         color:last.color
       });
       food.init(map);
     }
   };
   function remove(){
     var i = elements.length-1;
     for(;i>=0;i--){
       var e = elements[i];
       e.parentNode.removeChild(e);
       elements.splice(i,1);
     }
   }
   window.Snake=Snake;
 }());
