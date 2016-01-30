var Board = function(rows, columns, mines) {
    this.rows = rows;

    this.columns = columns;

    this.mines = mines;

    this.fields = new Map();

    this.generate_mine_field = function() {
        var rands = new Array();
        for(var i = 0; i < this.mines; i++) {
            rands.push(Math.floor(Math.random() * this.mines));
        }
        return rands;
    }

    this.initialize = function() {
        var counter = 0;
        var $board = $("#main");
        var mine_field = this.generate_mine_field();

        for(var r = 0; r < this.rows; r++) {
            var $row = $("<div class='row'></div>");
            for(var c = 0; c < this.columns; c++) {
                var $button = $("<button class='btn btn-default field'> </button>");
                var field = new Field(r, c, mine_field.indexOf(counter) > -1);
                $button.attr("id", r + " " + c);
                $button.appendTo($row);
                this.fields.set(r + " " + c, field);
                counter++;
            }
            $row.appendTo($board);
        }
        return $board;
    }

    this.get_field = function(coords) {
        return this.fields.get(coords);
    }
}

var Field = function(row, column, mine) {
   this.row = row;

   this.column = column;

   this.mine = mine;

   this.revealed = false;

   this.marked = false;

   this.reveal = function() {
       this.revealed = true;
   }

   this.mark = function() {
       this.marked = true;
   }
}

$(document).ready(function() {
    board = new Board(10, 10, 50);
    board.initialize().appendTo("body");
    $(".btn").on("click", function() {
        var field = board.get_field($(this).attr("id"));
        field.reveal();
        console.log(field);
    });
});
