// context.arc(100, 100, 20, 0, 2*Math.PI);
// context.fillStyle = 'green';
// context.fill();
// context.fillStyle = 'skyblue';
// context.fillRect(225, 225, 100, 100);

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

class gameManager{

}



class player{
    constructor(x,y,radius,color)
    {
        this.pos_x = x;
        this.pos_y = y;
        this.radius = radius;
        this.color = color;
    }

    draw()
    {
        context.arc(this.pos_x,this.pos_y,this.radius,0,2*Math.PI)
        context.fillStyle = this.color;
        context.fill()
    }

}

class bullet{
    constructor(position_x,position_y,radius,color){
        this.position_x = position_x;
        this.position_y = position_y;
        this.radius = radius;
        this.color = color;
    }
    draw()
    {
        context.beginPath();
        context.arc(this.position_x, this.position_y, this.radius, 0, 2*Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}

var char_player = new player(300,300,20,'skyblue');
char_player.draw();

var bullets = [];

canvas.onclick = function(event){

    let clickpos_x = event.clientX -context.canvas.offsetLeft;
    let clickpos_y = event.clientY -context.canvas.offsetTop;

    let bullets = new bullet(clickpos_x,clickpos_y,5,5,'pink');
    bullets.draw();
};
