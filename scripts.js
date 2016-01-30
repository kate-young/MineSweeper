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

board = new Board(10, 10, 10);

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

   this.on_top = function() {
       if(row == 0) {
            return;
       }
       return board.get_field(row - 1 + " " + column);
   }
   
   this.bottom = function() {
        if(row == board.rows - 1) {
            return;
        }
        return board.get_field(row + 1 + " " + column);
   }   
   
   this.left = function() {
       if(column == 0) {
           return;
       }
       return board.get_field(row + " " + (column - 1));
   }
   this.right = function() {
       if(column == board.columns - 1) {
           return;
       }
       return board.get_field(row + " " + (column + 1));
   }
}

$(document).ready(function() {
    board.initialize().appendTo("body");
    $(".btn").on("click", function() {
        var field = board.get_field($(this).attr("id"));
        field.reveal();
        console.log(field);
    });
});
