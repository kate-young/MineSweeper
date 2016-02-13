$(document).ready(function() {
    var rows = 15;
    var columns = 15;
    var mines = 40;

    board = new Board(rows, columns, mines);
    board.initialize();

    $("#restart").on("click", function() {
        location.reload();
    });
    $(".field").on("contextmenu", function() {
        return false;
    });
    $(".field").on("mousedown", function(e) {
        e.preventDefault();
        var column = $(this).prevAll().length;
        var row  = $(this).parent().prevAll().length;
        var field = board.get_field(row, column);
        if(!field.revealed && !board.complete) {
            if(e.which == 3) {
                field.flag();
                return;
            }
            if(!field.flagged) {
                if(!board.mines_added) {
                  board.add_mines(parseInt(row), parseInt(column));
                }
                field.reveal();
                if(board.check_for_win()) {
                    setTimeout(function() {
                        alert("You Won!");
                    }, 200);
                }
                if(field.mine) {
                    setTimeout(function(){
                        alert("You lost!");
                    }, 200);
                }
            }
        }
    });
});

var Board = function(rows, columns, mines) {
    this.complete = false;

    this.rows = rows;

    this.columns = columns;

    this.mines = mines;

    this.fields = new Map();

    this.mines_added = false;

    this.generate_mine_field = function(row, column) {
        // get count of initial row/column
        var initial_position = row * (this.columns) + column;
        var rands = new Array();
        while(rands.length < this.mines) {
            var num = Math.floor(Math.random() * this.rows * this.columns);
            // add to random array if it is not already there and it does not match the initial position
            if(rands.indexOf(num) === -1 && num != initial_position) {
                rands.push(num);
            }
        }
        this.mines_added = true;
        return rands;
    }

    this.initialize = function() {
        var $board = $("#main");

        for(var r = 0; r < this.rows; r++) {
            var $row = $("<div class='row'></div>");
            for(var c = 0; c < this.columns; c++) {
                var $button = $("<button class='btn btn-default field'> </button>");
                $button.appendTo($row);
                this.fields[[r, c]] = new Field(r, c);
            }
            $row.appendTo($board);
        }
        return $board;
    }

    this.add_mines = function(row, column) {
        var mine_field = this.generate_mine_field(row, column);
        var counter = 0;
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.columns; c++) {
                if(mine_field.indexOf(counter) > -1) {
                    this.get_field(r, c).add_mine();
                }
                counter++;
            }
            
        }
    }

    this.get_field = function(row, column) {
        return this.fields[[row, column]];
    }

    this.check_for_win = function() {
        for(var r = 0; r< this.rows; r++) {
            for(var c= 0; c < this.columns; c++) {
                var field = this.get_field(r, c);
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


var Field = function(row, column) {
   this.row = row;

   this.column = column;

   this.mine = false;

   this.revealed = false;

   this.flagged = false;

   this.surrounding = new Array();

   this.$dom_field = function() {
       var $row = $($(".row")[row]);
       return $($row.children()[column]);
    }

   this.flag = function() {
       if(this.flagged) {
           $(this.$dom_field()).removeClass("flag");
           this.flagged = false;
        } else {
           $(this.$dom_field()).addClass("flag");
           this.flagged = true;
        }
    }
   
   this.add_mine = function() {
        this.mine = true;
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
       var count = this.mine_count();
       this.$dom_field().text(count == 0? "" : count);
       this.$dom_field().addClass("safe_" + count);

       if(!this.mine && this.mine_count() == 0) {
           for(var i = 0; i < this.surrounding().length; i++) {
               var surround = this.surrounding()[i];
               surround.reveal();
           }
       }
   }

   this.surrounding = function() {
       var sur = new Array();
       if( row > 0 ) {
            //top
            sur.push(board.get_field(row - 1, column));
            // top left
            if( column > 0) {
                sur.push(board.get_field(row - 1, column - 1));
            }
            // top right
            if(column < board.columns - 1) {
                sur.push(board.get_field(row - 1, column + 1));
            }
       }
       if( row < board.rows - 1 ) {
            // bottom
            sur.push(board.get_field(row + 1, column));
            // bottom left
            if( column > 0 ) {
                sur.push(board.get_field(row + 1, column - 1));
            }
            // bottom right
            if( column < board.columns - 1) {
                sur.push(board.get_field(row + 1, column + 1));
            }
       }
       // left
       if( column > 0 ) {
           sur.push(board.get_field(row, column - 1));
       }
       // right
       if( column < board.columns - 1 ) {
           sur.push(board.get_field(row, column + 1));
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

