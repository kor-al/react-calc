import React from 'react';

class Stack {

    constructor() {
        this.stack = [];
    }

    push(element) {
        //put element to the stack
        this.stack.push(element);
    }

    peek() {
        if (this.stack.length === 0) return undefined;
        //return the top element of the stack 
        return this.stack[this.stack.length - 1];
    }

    pop() {
        //return the top element of the stack and remove it from the stack
        if (this.stack.length === 0) return undefined;
        return this.stack.pop();
    }

    isEmpty() {
        // check if the stack is empty
        return this.stack.length === 0;
    }

    print() {
        if(typeof this.peek() =='object'){
            let output = '';
            this.stack.forEach( item =>{
                for (var property in item) {
                    output += property + ': ' + item[property]+'; ';
                }});
            return output;
        }
        return this.stack.join(', ')
    }
}


class Operation {

    constructor(op,unary = false) {
        if (!['+', '-', '*', '/', '(', ')'].includes(op)) throw new Error(`${op} is not an operation!`);
        this.operation = op;
        this.unary = unary;
    }

    priority() {
        if (this.operation === '-' && this.unary) {
            return 3;
        }
        if (this.operation === '+' || this.operation === '-') {
            return 1;
        }
        if (this.operation === '*' || this.operation === '/') {
            return 2;
        }
        if (this.operation === '(' || this.operation === ')') {
            return 0;
        }
    }

    apply(val1,val2){
        switch (this.operation) {
            case '+':
                return val1 + val2;
            case '-':
                if (this.unary){
                    return -1 * val2;}
                else{
                    return val1 - val2;
                }
            case '*':
                return val1 * val2;
            case '/':
                return val1 / val2;
            default:
                throw new Error(`${this.operation} is not an operation!`);
        }
    }

}

class InputParser {

    constructor() {
        this.reset();
        this.currentNumber = undefined;
    }

    //reset parser
    //use provided number as a start of the expression
    reset(startNumber = undefined) {
        if (startNumber) {
            //set first number in the operation with the result of the last expression
            this.inputSeq = [startNumber];
            this.numberIsLastResult = true;
        } else {
            this.inputSeq = []
            this.numberIsLastResult = false;
        }
        this.inNumber = false;
        this.hasDecimal = false;
        this.bracketOpen = false;
    }

    parse(symbol) {
        //only expression ending with "=" can be executed later
        //so use "=" to signify correctness of the expression
        let prevSymbol = this.inputSeq[this.inputSeq.length - 1];

        if (symbol.type === 'equals') {
            // "=" can be clicked only if some input was provided AND input should not be a previous result
            if (this.inputSeq.length && !this.numberIsLastResult) {
                //remove operations at the end
                while (this.inputSeq.length && prevSymbol.type === 'operation') {
                    this.inputSeq.pop();
                    prevSymbol = this.inputSeq[this.inputSeq.length - 1];
                }
                //add bracket if needed
                if (this.bracketOpen) {
                    this.inputSeq.push({
                        type: 'bracket',
                        val: ')'
                    });
                }
                //push '=' at the end
                this.inputSeq.push(symbol);
            }
            else{
                return undefined;  //do not update 
            }
        }
        if (symbol.val === '(') {
            if (this.inputSeq.length === 0 || (this.inputSeq.length && prevSymbol.type === 'operation')) {
                this.bracketOpen = true;
                this.inputSeq.push(symbol);
            }
        }
        if (symbol.val === ')') {
            if (this.bracketOpen && prevSymbol.val !== '(' && prevSymbol.type !== 'operation') {
                this.bracketOpen = false;
                this.inputSeq.push(symbol);
            }
        }
        if (symbol.type === 'operation') {
            //number ended - reset variables
            this.inNumber = false;
            this.hasDecimal = false;
            //work with the previous result as if it was manually typed
            if (this.numberIsLastResult) {
                this.numberIsLastResult = false;
            }
            //identify unary operations
            if (symbol.val === '-' && (this.inputSeq.length === 0 || (this.inputSeq.length && prevSymbol.type !== 'number'))) {
                symbol.unary = true;
            } else {
                symbol.unary = false;
            }

            //do not allow mult and division at the start of the expression
            if (this.inputSeq.length === 0 && symbol.val !== '-') {} else {
                //do not allow many operations in a row
                if (this.inputSeq.length && prevSymbol.type === 'operation' && (symbol.unary === false || (symbol.unary === true && prevSymbol.unary === true))) {
                    //replace the last operation with a new one
                    this.inputSeq[this.inputSeq.length - 1] = symbol;
                }
                //otherwise
                else {
                    //push operation
                    this.inputSeq.push(symbol);
                }
            }

        }
        if (symbol.type === 'number' || symbol.type === 'decimal') {
            //remove last result if new value in entered instead
            if (this.numberIsLastResult) {
                this.inputSeq = []
                this.numberIsLastResult = false;
            }
            //if it's the first symbol in a number
            if (!this.inNumber) {
                //push a value symbol to the input sequence
                this.inNumber = true;
                //add zero before decimal if it only starts with it
                if (symbol.type === 'decimal') {
                    symbol.val = '0' + symbol.val;
                    symbol.type = 'number'; //change type from decimal to number
                }
                this.currentNumber = symbol;
                this.inputSeq.push(this.currentNumber);
            }
            //if the number continues append values to the symbol object in the input sequence
            else {
                if (symbol.type === 'number') {
                    //skip more than 1 starting zero in a current number
                    if (this.currentNumber.val.length === 1 && this.currentNumber.val[0] === '0' && symbol.val === '0') {
                        console.log("already has leading zero")
                    } else {
                        this.currentNumber.val += symbol.val;
                    }
                }
                if (symbol.type === 'decimal') {
                    this.inNumber = true;
                    //skip if more than one decimal
                    if (!this.hasDecimal) {
                        this.currentNumber.val += symbol.val;
                        this.hasDecimal = true;
                    }
                }
                //update number
                this.inputSeq[this.inputSeq.length - 1] = this.currentNumber;
            }

        }
        return this.inputSeq[this.inputSeq.length - 1];

    }

    // get expression in a string  e.g. "x{operation}y="
    getExpression(){
        return this.inputSeq.map((symbol) => symbol.val ).join('');
    }


}

class Button extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        if(this.props.type === 'clear'){
            //reset parser and calc
            this.props.register();
        }
        else{
            //parse new symbol in an expression
            this.props.register({val: this.props.label, type: this.props.type});
        }        
    }

    render() {
        return ( 
            <button id = {this.props.id} className={this.props.type}  onClick = {this.handleClick} > {this.props.label}</button>)
    }

}

class History extends React.Component {

    constructor(props) {
        super(props);
        this.handleResultClick= this.handleResultClick.bind(this);
    }

    handleResultClick(result, expression){
        this.props.setValueFunc(result, expression);
    }

    render() {
        let items = this.props.items;
        return ( 
            <ol id="history">
            {items.map((value, index) => {return <li key = {`item${index}`}> {value.expression} <span onClick = {() => this.handleResultClick(value.result, value.expression)}>{value.result.toString()}</span> </li>})}
            </ol>
            )
    }

}

class Calc extends React.Component {

    constructor(props) {
        super(props);
        this.state = {history : [], currentItem: 0, currentExpr: ''};
        
        this.ops = new Stack();
        this.values = new Stack();

        this.parser = new InputParser();
        this.result = 0;

        this.execute = this.execute.bind(this);
        this.reset = this.reset.bind(this);
        this.registerInput= this.registerInput.bind(this);
        this.calcOp= this.calcOp.bind(this);
        this.saveToHistory= this.saveToHistory.bind(this);
        this.setFirstInputValue = this.setFirstInputValue.bind(this);
        
    }
    
    saveToHistory(expr, result){
        let item = {'expression': expr, 'result' :result};
        this.setState({history: [...this.state.history, item]});
    }

    reset() {
        this.setState({currentItem : 0, currentExpr: ''});
        this.parser.reset();
        this.ops = new Stack();
        this.values = new Stack();
    }

    setFirstInputValue(val, expr){
        this.parser.reset({val: val, type: 'number'});
        this.setState({currentItem: val});
        if(expr){
            this.setState({currentExpr: expr});
        }
    }

    registerInput(symbol) {
        let currentSymbol = this.parser.parse(symbol);
        if (currentSymbol) {
            this.setState({
                currentExpr: this.parser.getExpression()
            });
        }
        if (symbol.type === 'equals') {
            let result = this.execute();
            //check if result was calculated
            if (result) {
                console.log(result);
                //save expr and result to the history
                this.saveToHistory(this.parser.getExpression(), result);
                //update state
                this.setState({
                    currentItem: result
                });

                //use result as a possible start fot the next expression
                this.setFirstInputValue(result);
            }
        } else if (currentSymbol) {
            this.setState({
                currentItem: currentSymbol.val
            });
        }
    }

    calcOp(){
        let val2 = this.values.pop();
        let op = this.ops.pop();
        let val1 = op.unary ? undefined : this.values.pop();
        this.values.push(op.apply(val1, val2));
    }

    execute() {
        //input is stored in the parser's array  this.parser.inputSeq
        //check if expression ends with =
        if(this.parser.inputSeq.length  && this.parser.inputSeq[this.parser.inputSeq.length - 1].val !== '='){
            return undefined;
        }
        console.log('INPUT', this.parser.getExpression());
        //don't take '=' symbol at the end - use slice
        let input = this.parser.inputSeq.slice( 0 , this.parser.inputSeq.length - 1);
        console.log('INPUT', input);

        for (let i = 0; i < input.length; i++) {
            //if left bracket - just push it
            if (input[i].val === '(') {
                this.ops.push(new Operation(input[i].val));
            } else {
                //if number
                if (input[i].type === 'number') {
                    this.values.push(+input[i].val);
                } else
                //if brackets are closed, then it's time to calculate operations in these brackets 
                //apply operations while the opening bracket is not the top most operation
                if (input[i].val === ')') {
                    while (!this.ops.isEmpty() && this.ops.peek().operation !== '(') {
                        this.calcOp();
                    }
                    // then pop the opening brace.
                    if (!this.ops.isEmpty()) this.ops.pop();
                } else {
                    //if operation
                    let curOp;
                    if (input[i].unary) {
                        curOp = new Operation(input[i].val, true);
                    } else {
                        curOp = new Operation(input[i].val);
                    }
                    //Apply pending operations
                    while (!this.ops.isEmpty() && this.ops.peek().priority() >= curOp.priority()) {
                        this.calcOp();
                    }

                    // Push current operation to  the stack
                    this.ops.push(curOp);

                }
            }
        }

        // expression parsed
        // calculate remaining operations
        while (!this.ops.isEmpty()) {
            this.calcOp();
        }
        
        let result = this.values.peek()
        
        return result;
    }


    render() {
        const numbers = {"zero": 0, "one": 1, "two": 2, "three":3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9}
        const operations = {'add':'+', 'substract':'-', 'multiply': '*', 'divide': '/'}
        return ( <div id = 'container' >
            <div id = 'calc'>
            <div id = 'expression'>{this.state.currentExpr}</div> 
            <div id = 'display'>{this.state.currentItem}</div> 
            <div className='pads'>
            <div className='pads--numbers'>
            <Button key = 'decimal' label='.'  type='decimal' register = {this.registerInput}/>
            {Object.keys(numbers).map((key, index) => {
                return <Button key = {key.toString()} id = {key.toString()} label ={numbers[key].toString()}  type='number' register = {this.registerInput}/>
            })}
            </div>
            <div className='pads--operations'>
            {Object.keys(operations).map((key, index) => {
                return <Button key = {key.toString()} id = {key.toString()} label={operations[key].toString()}  type='operation' register = {this.registerInput}/>
            })}
            <Button key = 'lbracket' label='('  type='bracket' register = {this.registerInput}/>
            <Button key = 'rbracket' label=')'  type='bracket' register = {this.registerInput}/>
            
            <Button key = 'equals' label='='  type='equals' register = {this.registerInput}/>
            <Button key = 'clear' label='C'  type='clear' register = {this.reset}/>
            </div>
            </div>
            </div>
            <History items = {this.state.history} setValueFunc = {this.setFirstInputValue}/>
            </div>)
    }

}

export default Calc;