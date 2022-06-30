const $ = require("jquery");
const dialog = require("electron").remote.dialog;
const fs=require("fs");
const { getPriority } = require("os");

// /The $ function returns an enhanced version of the document object.Once the DOM is ready, the JavaScript function is executed.
$(document).ready(function() {
    
    // using 2d array of (objects of cells) as database
    let db;
    let lsc;

    // ***************Formatting and functionality
    
    $(".menu >*").on("click", function () {
        let id = $(this).attr("id");
        $(".menu-options-item").removeClass("selected");
        $(`#${id}-menu-options`).addClass("selected");
    })
    // ***************

    // new databse(db) array is created
    // clears the ui
    // fills databse of grid , with empty cell object in all cells, cell object represent state of a cell  
    $("#New").on("click",function()
    {
        // new database is created
        db=[];
        let rows=$("#grid").find(".row");
        for(let i=0;i<rows.length;i++)
        {
            let row=[];
            let cells=$(rows[i]).find(".cell");
            for(let j=0;j<cells.length;j++)
            {
                let cell={
                    value:"",
                    formula:"",
                    downStream:[],
                    upStream:[],
                    // *********
                    fontFamily: 'Arial',
                    fontSize: 12,
                    bold: false,
                    underline: false,
                    italic: false,
                    bgColor: '#FFFFFF',
                    textColor: '#000000',
                    halign: 'left'
                    // *********
                };
                // **********
                $(cells[j]).html("");
                $(cells[j]).html(cell.value);
                $(cells[j]).css('font-family', cell.fontFamily);
                $(cells[j]).css("font-size", cell.fontSize + 'px');
                $(cells[j]).css("font-weight", cell.bold ? "bolder" : "normal");
                $(cells[j]).css("text-decoration", cell.underline ? "underline" : "none");
                $(cells[j]).css("font-style", cell.italic ? "italic" : "normal");
                $(cells[j]).css("background-color", cell.bgColor);
                $(cells[j]).css("color", cell.textColor);
                $(cells[j]).css("text-align", cell.halign);
                // ***********
                row.push(cell);
            }
            db.push(row);
        }
        $($("#grid .cell")[0]).trigger("click");    //not working
        $("#formula-input").val("");
    });

    $("#Save").on("click",async function()
    {    
        // first time save / file name =? create => data save 
    
        let sdb = await dialog.showOpenDialog();
        let jsonData = JSON.stringify(db);
        fs.writeFileSync(sdb.filePaths[0], jsonData);
        console.log("File Saved");
    });

    $("#Open").on("click", async function () {
        let sdb = await dialog.showOpenDialog();
        let buffContent = fs.readFileSync(sdb.filePaths[0]);
        db = JSON.parse(buffContent);
        let rows = $("#grid").find(".row");
        for (let i = 0; i < rows.length; i++) {
            let cells = $(rows[i]).find(".cell");

            for (let j = 0; j < cells.length; j++) {
                // $(cells[j]).html(db[i][j].value);
                // ***********
                let cell = db[i][j];
                $(cells[j]).html("");
                $(cells[j]).html(cell.value);
                $(cells[j]).css('font-family', cell.fontFamily);
                $(cells[j]).css("font-size", cell.fontSize + 'px');
                $(cells[j]).css("font-weight", cell.bold ? "bolder" : "normal");
                $(cells[j]).css("text-decoration", cell.underline ? "underline" : "none");
                $(cells[j]).css("font-style", cell.italic ? "italic" : "normal");
                $(cells[j]).css("background-color", cell.bgColor);
                $(cells[j]).css("color", cell.textColor);
                $(cells[j]).css("text-align", cell.halign);
                // ************
            }
        }
        console.log("File Opened");
    });

    // cell which is clicked, display that cell address in address bar and display that cell formula in formula bar
    $(".grid .cell").on("click",function()
    {
        let ri=Number($(this).attr("ri"));
        let ci=Number($(this).attr("ci"));
        let address=String.fromCharCode(65+ci) + (ri+1);
        $("#address-input").val(address);
        let cellObject=db[ri][ci];
        $("#formula-input").val(cellObject.formula);

        // // ***************Formatting and functionality
        $(this).addClass("selected");
        if (lsc && lsc != this)
            $(lsc).removeClass("selected");
        lsc = this;
        if (cellObject.bold) {
            $('#bold').addClass('selected');
        } else {
            $('#bold').removeClass('selected');
        }

        if (cellObject.underline) {
            $('#underline').addClass('selected');
        } else {
            $('#underline').removeClass('selected');
        }

        if (cellObject.italic) {
            $('#italic').addClass('selected');
        } else {
            $('#italic').removeClass('selected');
        }
        // **************
    });

    // ***************Formatting and functionality
    $('#font-family').on("change", function () {
        let fontFamily = $(this).val();

        let cell = $("#grid .cell.selected")
        $(cell).css("font-family", fontFamily);

        let rid = parseInt($(cell).attr('ri'));
        let cid = parseInt($(cell).attr('ci'));

        db[rid][cid].fontFamily = fontFamily;
    });

    $('#font-size').on("change", function () {
    let fontSize = $(this).val();

    let cell = $("#grid .cell.selected");

    $(cell).css("font-size", fontSize + 'px');

    let rid = parseInt($(cell).attr('ri'));
    let cid = parseInt($(cell).attr('ci'));

    db[rid][cid].fontSize = fontSize;

    });

    $('#bold').on("click", function () {
        $(this).toggleClass('selected');
        let bold = $(this).hasClass('selected');
        let cell = $("#grid .cell.selected")
        $(cell).css("font-weight", bold ? "bolder" : "normal");

        let rid = parseInt($(cell).attr('ri'));
        let cid = parseInt($(cell).attr('ci'));

        db[rid][cid].bold = bold;
    });

    $('#underline').on("click", function () {
        $(this).toggleClass('selected');
        let underline = $(this).hasClass('selected');

        let cell = $("#grid .cell.selected")
        $(cell).css("text-decoration", underline ? "underline" : "none");

        let rid = parseInt($(cell).attr('ri'));
        let cid = parseInt($(cell).attr('ci'));

        db[rid][cid].underline = underline;
    });

    $('#italic').on("click", function () {
        $(this).toggleClass('selected');
        let italic = $(this).hasClass('selected');

        let cell = $("#grid .cell.selected")
        $(cell).css("font-style", italic ? "italic" : "normal");

        let rid = parseInt($(cell).attr('ri'));
        let cid = parseInt($(cell).attr('ci'));

        db[rid][cid].italic = italic;
    });
    // ************

    // Update
    // => when you enter anything you should put an entry inside db 
    // it is little slow 
    $("#grid .cell").on("keyup",function(event)
    {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode=='37' || keycode=='38' || keycode=='39' || keycode=='40')
            return;
        let ri=Number($(this).attr("ri"));
        let ci=Number($(this).attr("ci"));
        let val=$(this).html();

        let cellObject=db[ri][ci];

        if(cellObject.formula)
            removeFormula(ri,ci,cellObject);
        
        updateCell(ri,ci,val);
        $("#formula-input").val(cellObject.formula);
    });

    // update value on selected cell using formula
    $("#formula-input").on("blur",function(){
        // get details
        let formula=$(this).val();
        let cellAddress=$("#address-input").val();

        // get address from  A1 to (row no. and column no.)
        let {rowId,colId}=getRcFAddr(cellAddress);
        let cellObject=db[rowId][colId];

        // set formula property if it is valid (means their is no cycle)
        if(isFormulaInValid(rowId ,colId ,formula)){
            console.log(`cycle in ${rowId} , ${colId}`);
            return;
        }

        if(cellObject.formula == $(this).val())
            return;

        if(cellObject.formula)
            removeFormula(rowId,colId,cellObject);

        let val = evaluate(formula);

        // update cell properties
        cellObject.formula=formula;
        updateCell(rowId,colId,val);
        setUpFormula(rowId, colId,formula);
    });

    // to check graph cycle
    function isFormulaInValid(rowId ,colId ,formula)
    {
        const map=new Map();
        return isCycle(rowId,colId,formula,map);
    }

    function isCycle(r,c,formula,map)
    {
        let k=r*26 + c;
        if(map.has(k)){
            return true;
        }
        map.set(k,true);

        let fromulaArr = formula.split(" ");  //[( ,A1 ,+ ,A2,)]
        for(let i=0;i<fromulaArr.length;i++)
        {
            let code=fromulaArr[i];
            if(code.charCodeAt(0)>=65 && code.charCodeAt(0)<=90)
            {
                let {rowId,colId}=getRcFAddr(code);
                let res=isCycle(rowId,colId,db[rowId][colId].formula,map);
                if(res)
                    return true;
            }
        }

        map.delete(k);
        return false;
    }
    // update itself and its children
    function updateCell(rowId,colId,val)
    {
        // update cell
        let cellObject=db[rowId][colId];
        cellObject.value=val; // update db
        $(`#grid .cell[ri=${rowId}][ci=${colId}]`).html(val);  // update ui

        // children cells are those whose values are set using this cell with the help of formula.
        // update its children cells.
        for(let i=0;i<cellObject.downStream.length;i++)
        {
            let child_rc_Obj = cellObject.downStream[i];
            let child_Obj = db[child_rc_Obj.rowId][child_rc_Obj.colId];
            let n_val = evaluate(child_Obj.formula);
            updateCell(child_rc_Obj.rowId ,child_rc_Obj.colId ,n_val);
        }
    }

    // solve this formula ( A1 + A2 ) and find its answer
    function evaluate(formula)
    {
        // convert ( A1 + A2 ) to ( 10 + 20 )
        let fromulaArr = formula.split(" ");  //[( ,A1 ,+ ,A2,)]
        for(let i=0;i<fromulaArr.length;i++)
        {
            let code=fromulaArr[i];
            if(code.charCodeAt(0)>=65 && code.charCodeAt(0)<=90)
            {
                let {rowId,colId}=getRcFAddr(code);
                let cellObject=db[rowId][colId];
                let val=cellObject.value;
                formula=formula.replace(code,val);
            }
        }

        // ( 10 + 20 ) to 30
        // evaluate formula and return result of formula
        let res=infixEvaluation(formula);  
        return res;
    }

    class Stack { 
        // Array is used to implement stack 
        stack;
        size;
        constructor() 
        { 
            this.stack = new Array(); 
            this.size = 0;
        } 
      
        push(item) 
        {
            this.stack.push(item);
            this.size++;
        }
        pop() 
        {
            if(this.size == 0)
                return;
            this.size--;
            return this.stack.pop();
        }
        peek() 
        {
            if(this.size == 0)
                return;
            return this.stack[this.size-1];   
        }
        isEmpty() 
        {
            return (this.size==0);
        }
    } 

    function getPriority(ch)
    {
        switch(ch)
        {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
            case '%':
                return 2;
            case '^':
                return 3;
            default:
                break;
        }
        return -1;
    }

    // solve (a+b),(a-b)...
    function solveOperation(val1,val2,ch)
    {
        switch(ch)
        {
            case '+':
                return val1+val2;
            case '-':
                return val1-val2;
            case '*':
                return val1*val2;
            case '/':
                return val1/val2;
            case '%':
                return val1%val2;
            case '^':
                return Math.pow(val1,val2);
            default:
                break;
        }
        return -1;
    }

    // solves ( 10 + 20 )
    function infixEvaluation(formula)
    {
        let formulaArr = formula.split(" "); //[( ,10 ,+ ,20,)]
        var c_stack=new Stack();
        var v_stack=new Stack();
        for(let i=0;i<formulaArr.length;i++)
        {
            let ch=formulaArr[i];
            if(ch == "(")
                c_stack.push(ch);
            else if(ch=="+" || ch=="-" || ch=="*" || ch=="/" || ch=="%" || ch=="^")
            {
                while(c_stack.size > 0 && c_stack.peek()!="(" && getPriority(c_stack.peek()) >= getPriority(ch))
                {
                    let rc=c_stack.pop();
                    let val2=v_stack.pop();
                    let val1=v_stack.pop();
                    let ans=solveOperation(val1,val2,rc);
                    v_stack.push(ans);
                }
                c_stack.push(ch);
            }
            else if(ch==")")
            {
                while(c_stack.peek() != "(")
                {
                    let rc=c_stack.pop();
                    let val2=v_stack.pop();
                    let val1=v_stack.pop();
                    let ans=solveOperation(val1,val2,rc);
                    v_stack.push(ans);
                }
                c_stack.pop();
            }
            else
            {
                v_stack.push(Number(ch));
            }
        }
        while(c_stack.size>0)
        {
            let rc=c_stack.pop();
            let val2=v_stack.pop();
            let val1=v_stack.pop();
            let ans=solveOperation(val1,val2,rc);
            v_stack.push(ans);
        }
        return v_stack.pop();
    }

    // set (rowId,colId) cell as child of all the cells present in formula 
    function setUpFormula(rowId,colId,formula)
    {
        let cellObject=db[rowId][colId];
        let fromulaArr = formula.split(" ");  //[( ,A1 ,+ ,A2,)]
        for(let i=0;i<fromulaArr.length;i++)
        {
            let code=fromulaArr[i];
            if(code.charCodeAt(0)>=65 && code.charCodeAt(0)<=90)
            {
                let parent=getRcFAddr(code);
                let parentObject=db[parent.rowId][parent.colId];
                parentObject.downStream.push({
                    rowId,
                    colId
                });

                cellObject.upStream.push({
                    rowId:parent.rowId,
                    colId:parent.colId
                });
            }
        }
    }

    // removes formula from cell
    function removeFormula(rowId,colId,cellObject)
    {
        for(let i=0;i<cellObject.upStream.length;i++)
        {
            let parent=cellObject.upStream[i];
            let parentObject=db[parent.rowId][parent.colId];
            parentObject.downStream=parentObject.downStream.filter(function(c_obj)
            {
                return (c_obj.rowId!=rowId && c_obj.colId!=colId);
            });
        }
        cellObject.formula="";
        cellObject.upStream=[];
    }

    // convert address A1 to row no. and column no.
    function getRcFAddr(cellAddress) {
        let colId=cellAddress.charCodeAt(0)-65;
        let row=cellAddress.substring(1);
        let rowId=Number(row)-1; 
        return {rowId,colId};
    }

    // click on new button
    function init()
    {
        $("#File").trigger("click");
        $("#New").trigger("click");
    }

    init();
});