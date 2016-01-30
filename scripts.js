var Board = function(rows, columns, mines) {
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.fields = new Array();
    this.initialize = function() {
        var counter = 0;
        var mines = mine_field();
        var mine;
        var board = "<div class='board'>";
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.columns; c++) {
                mine = mines.indexOf(counter) > -1; 
                this.fields.push(new Field(r, c, mine));              
                board += "<button class='btn btn-default field'> </button>";
                counter++;
            }
            board += "</br>";
        }
        board += "</div>";
        return board;
    }
    var mine_field = function() {
        var rands = new Array();
        for(var i = 0; i < this.mines; i++) {
            rands.push(Math.floor(Math.random() * this.mines));
        }
        return rands;
    }
}

var Field = function(row, column, mine) {
   this.row = row;
   this.column = column;
   this.mine = mine;
   this.revealed = false;
   this.marked = false;
   this.icon = function() {
       if(this.mine) {
           return "<span class='glyphicon glyphicon-alert'><span>";
       }
    }
}

$(document).ready(function() {
    board = new Board(10, 10, 2);
    $("#main").html(board.initialize());
    $(".field").on("click", function() {
    });
});
