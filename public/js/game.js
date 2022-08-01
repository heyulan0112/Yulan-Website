 (function(){
   var that=null;
   function Game(map){
     this.food = new Food();
     this.snake = new Snake();
     this.map = map;
     that = this;
   }
   Game.prototype.init=function(){
     this.food.init(this.map);
     this.snake.init(this.map);
     this.runSnake(this.food,this.map);
     this.bindKey();
   };
   Game.prototype.runSnake=function(food,map){
     var timeId=setInterval(function(){
       this.snake.move(food,map);
       this.snake.init(map);
       var map_x=map.offsetWidth/this.snake.width;
       var map_y=map.offsetHeight/this.snake.height;
       var head_x=this.snake.body[0].x;
       var head_y=this.snake.body[0].y;
       if(head_x < 0 || head_x >= map_x){
         clearInterval(timeId);
         alert("Game over");
       }
       if(head_y < 0 || head_y >= map_y){
         clearInterval(timeId);
         alert("Game over");
       }
       if(head_x == snake.body[snake.body.length-1].x && head_y == snake.body[snake.body.length-1].y){
         clearInterval(timeId);
         alert("Game over");
       }
     }.bind(that),200);
   };

   Game.prototype.bindKey=function(){
     document.addEventListener("keydown",function(e){
       if(e.keyCode == 37){
         this.snake.direction = "left";
       }
       else if(e.keyCode == 38){
         this.snake.direction = "up";
       }
       else if(e.keyCode == 39){
         this.snake.direction = "right";
       }
       else if(e.keyCode == 40){
         this.snake.direction = "down";
       }
     }.bind(that),false);
   };

   window.Game=Game;

 }());
