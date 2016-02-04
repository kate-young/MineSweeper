$(document).ready(function() {
    var rows = 20;
    var columns = 20;
    var mines = 50;
    board = new Board(rows, columns, mines);
    board.initialize();
    $(".btn").on("contextmenu", function() {
        return false;
    });
    $(".btn").on("mousedown", function(e) {
        e.preventDefault();
        var field = board.get_field($(this).attr("id"));
        if(field.revealed || board.complete) {
            return;
        }
        if(e.which == 3) {
            field.flag();
            return;
        }
        field.reveal();
        if(board.check_for_win()) {
            alert("You Won!");
        }
        if(field.mine) {
            setTimeout(function(){
                alert("You lost!");
            }, 200);
        }
    });
});
var Board = function(rows, columns, mines) {
    this.complete = false;

    this.rows = rows;

    this.columns = columns;

    this.mines = mines;

    this.fields = new Map();

    this.generate_mine_field = function() {
        var rands = new Array();
        while(rands.length < this.mines) {
            var num = Math.floor(Math.random() * this.rows * this.columns);
            if(rands.indexOf(num) === -1) {
                rands.push(num);
            }
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

    this.check_for_win = function() {
        for(var r = 0; r< this.rows; r++) {
            for(var c= 0; c < this.columns; c++) {
                var field = this.get_field(r + " " + c);
                if(!field.mine && !field.revealed){
                    return false;
                }
            }
        }
        this.end();
        return true;
    }

    this.end = function() {
        this.complete = true;
    }
}


var Field = function(row, column, mine) {
   this.row = row;

   this.column = column;

   this.mine = mine;

   this.revealed = false;

   var flagged = false;

   this.marked = false;

   this.surrounding = new Array();

   this.$dom_field = function() {
       return $(document.getElementById(this.row + " " + this.column));
    }

   this.flag = function() {
       if(flagged) {
           $(this.$dom_field()).removeClass("flag");
        } else {
           $(this.$dom_field()).addClass("flag");
       }
       flagged = true;
   }

   this.reveal = function() {
       if(this.revealed) {
           return;
       } 
       this.revealed = true;
       if(this.mine) {
           this.$dom_field().addClass("mine");
           board.end();
           return;
       }
       this.$dom_field().addClass("safe");
       this.$dom_field().text(this.mine_count() == 0? "" : this.mine_count());

       if(!this.mine && this.mine_count() == 0) {
           for(var i = 0; i < this.surrounding().length; i++) {
               var surround = this.surrounding()[i];
               surround.reveal();
           }
       }
   }
   
   this.mark = function() {
       this.marked = true;
   }

   this.surrounding = function() {
       var sur = new Array();
       if( row > 0 ) {
            //top
            sur.push(board.get_field((row - 1) + " " + column));
            // top left
            if( column > 0) {
                sur.push(board.get_field(row -1 + " " + (column - 1)));
            }
            // top right
            if(column < board.columns - 1) {
                sur.push(board.get_field(row - 1 + " " + (column + 1)));
            }
       }
       if( row < board.rows - 1 ) {
            // bottom
            sur.push(board.get_field(row + 1 + " " + column));
            // bottom left
            if( column > 0 ) {
                sur.push(board.get_field(row + 1 + " " + (column - 1)));
            }
            // bottom right
            if( column < board.columns - 1) {
                sur.push(board.get_field(row + 1 + " " + (column + 1)));
            }
       }
       // left
       if( column > 0 ) {
           sur.push(board.get_field(row + " " + (column - 1)));
       }
       // right
       if( column < board.columns - 1 ) {
           sur.push(board.get_field(row + " " + (column + 1)));
       }
       return sur;
   }

   this.mine_count = function() {
       var count = 0;
       for(var i = 0; i < this.surrounding().length; i++) {
           if(this.surrounding()[i].mine) {
               count++;
           }
       }
       return count;
    }
}

