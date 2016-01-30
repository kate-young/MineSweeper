var Board = function(rows, columns, mines) {
    this.rows = rows;

    this.columns = columns;

    this.mines = mines;

    this.fields = new Map();

    this.initialize = function() {
        var counter = 0;
        var mines = mine_field();
        var $board = $("#main");

        for(var r = 0; r < this.rows; r++) {
            var $row = $("<div class='row'></div>");
            for(var c = 0; c < this.columns; c++) {
                var field = new Field(r, c, mines.indexOf(counter) > -1);
                var $button = $("<button class='btn btn-default field'> </button>");
                $button.attr("id", counter);
                $button.appendTo($row);
                this.fields.set(field, $button);
                counter++;
            }
            $row.appendTo($board);
        }
        return $board;
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
}

$(document).ready(function() {
    board = new Board(10, 10, 2);
    board.initialize().appendTo("body");
});
