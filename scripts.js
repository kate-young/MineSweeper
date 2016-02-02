$(document).ready(function() {
    var rows = 20;
    var columns = 20;
    var mines = 25;
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
        if(field.mine) {
            alert("You lost!");
        }
        if(board.check_for_win()) {
            alert("You Won!");
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

   this.$dom_field = function() {
       return $(document.getElementById(this.row + " " + this.column));
    }

   this.flag = function() {
       if(flagged) {
           $(this.$dom_field()).removeClass("glyphicon glyphicon-flag");
       } else {
           $(this.$dom_field()).addClass("glyphicon glyphicon-flag");
       }
       flagged = true;
   }

   this.reveal = function() {
       this.revealed = true;
       if(this.mine) {
           this.$dom_field().addClass("mine");
           board.end();
       } else {
           this.$dom_field().addClass("safe");
           this.$dom_field().text(this.mine_count() == 0? "" : this.mine_count());
       }
       if(!this.mine && this.mine_count() == 0) {
           if(this.top_right() && !this.top_right().revealed) {
               this.top_right().reveal();
           }
           if(this.on_top() && !this.on_top().revealed) {
               this.on_top().reveal();
           }
           if(this.top_left() && !this.top_left().revealed) {
               this.top_left().reveal();
           }
           if(this.bottom() && !this.bottom().revealed) {
               this.bottom().reveal();
           }
           if(this.bottom_right() && !this.bottom_right().revealed) {
               this.bottom_right().reveal();
           }
           if(this.right() && !this.right().revealed) {
               this.right().reveal();
           }
           if(this.bottom_left() && !this.bottom_left().revealed) {
               this.bottom_left().reveal();
           }
           if(this.left() && !this.left().revealed) {
               this.left().reveal();
           }
       }
   }

   this.mark = function() {
       this.marked = true;
   }
   this.top_left = function() {
       if(row == 0 || column == 0) {
           return false;
        }
        return board.get_field(row -1 + " " + (column - 1));
    }

   this.on_top = function() {
       if(row == 0) {
            return false;
       }
       return board.get_field(row - 1 + " " + column);
   }

   this.top_right = function() {
       if(row == 0 || column == board.columns - 1) {
           return false;
       }
       return board.get_field(row - 1 + " " + (column + 1));
   }
   
   this.bottom = function() {
        if(row == board.rows - 1) {
            return false;
        }
        return board.get_field(row + 1 + " " + column);
   }   

   this.bottom_left = function() {
       if(row == board.rows || column == 0) {
           return false;
        }
        return board.get_field(row + 1 + " " + (column - 1));
   }
   
   this.bottom_right = function() {
       if(row == board.rows || column == board.columns) {
           return false;
        }
        return board.get_field(row + 1 + " " + (column + 1));
    }
   this.left = function() {
       if(column == 0) {
           return false;
       }
       return board.get_field(row + " " + (column - 1));
   }
    this.right = function() {
       if(column == board.columns - 1) {
           return false;
       }
           return board.get_field(row + " " + (column + 1));
    }
    this.mine_count = function() {
       var count = 0;
       if(this.on_top() && this.on_top().mine) {
           count++;
        }
        if(this.top_left() && this.top_left().mine) {
            count++;
        }
        if(this.top_right() && this.top_right().mine) {
            count++;
        }
        if(this.bottom() && this.bottom().mine) {
            count++;
        }
        if(this.bottom_left() && this.bottom_left().mine) {
            count++;
        }
        if(this.bottom_right() && this.bottom_right().mine) {
            count++;
        }
        if(this.right() && this.right().mine) {
            count++;
        }
        if(this.left().mine) {
            count++;
        }
        return count;
    }
}

