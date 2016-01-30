var Board = function(rows, columns, mines) {
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.fields = new Array();
    this.initialize = function() {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.columns; c++) {
                this.fields.push(new Field(r, c, false));              
            }
        }
    }
}

var Field = function(row, column, mine) {
   this.row = row;
   this.column = column;
   this.mine = mine;
}
