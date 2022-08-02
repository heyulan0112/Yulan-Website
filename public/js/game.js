 (function(){

   var that = null;

   // Add level
   function Game(map,score,level){
     this.food = new Food();
     this.snake = new Snake();
     this.map = map;
     this.score = score;
     this.level = level;
     that = this;
   }

   Game.prototype.init = function(){
     this.food.init(this.map);
     this.snake.init(this.map);
     // Add level
     this.runSnake(this.food,this.map,this.score,this.level);
     this.bindKey();
   };

   // Add level
   Game.prototype.runSnake = function(food,map,score,level){
     var timeId=setInterval(function(){
       this.snake.move(food,map,score);
       this.snake.init(map);
       var map_x = map.offsetWidth / this.snake.width;
       var map_y = map.offsetHeight / this.snake.height;
       var head_x = this.snake.body[0].x;
       var head_y = this.snake.body[0].y;
       if(head_x < 0 || head_x >= map_x){
         clearInterval(timeId);
         alert("Game over! Your Score is " + score.innerHTML + ". You can press start button below to restart the game.");
       }
       if(head_y < 0 || head_y >= map_y){
         clearInterval(timeId);
         alert("Game over! Your Score is " + score.innerHTML + ". You can press start button below to restart the game.");
       }
       for(var i=1; i<this.snake.body.length; i++){
         if(this.snake.body[i].x == head_x && this.snake.body[i].y == head_y){
           clearInterval(timeId);
           alert("Game over! Your Score is " + score.innerHTML + ". You can press start button below to restart the game.");
           break;
         }
       }
     }.bind(that),level);
   };

   Game.prototype.bindKey = function(){
     document.addEventListener("keydown",function(e){
       if(e.keyCode == 37 && this.snake.direction != "right"){
         this.snake.direction = "left";
       }
       else if(e.keyCode == 38 && this.snake.direction != "down"){
         this.snake.direction = "up";
       }
       else if(e.keyCode == 39 && this.snake.direction != "left"){
         this.snake.direction = "right";
       }
       else if(e.keyCode == 40 && this.snake.direction != "up"){
         this.snake.direction = "down";
       }
     }.bind(that),false);
   };

   window.Game = Game;

 }());
