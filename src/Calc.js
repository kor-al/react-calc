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

    constructor(op,isUni = false) {
        if (!['+', '-', '*', '/', '(', ')'].includes(op)) throw new Error(`${op} is not an operation!`);
        this.operation = op;
        this.isUni = isUni;
    }

    priority() {        
        if (this.operation === '-' || this.isUni ) {
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
                if (this.isUni){
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
        this.inputSeq = []
        this.inNumber = false;
        this.hasDecimal = false;
        this.hasMinus = false;
        this.currentNumber = undefined;
        this.isSet = false;
    }


    parse(symbol) {
        console.log('INPUT', symbol.val, symbol.type);
        let prevSymbol = this.inputSeq[this.inputSeq.length - 1];

        if (symbol.type === 'equals') {
            //remove operations at the end
            while (this.inputSeq.length && prevSymbol.type === 'operation') {
                this.inputSeq.pop();
            }
            this.inputSeq.push(symbol);
        }
        if (symbol.type === 'operation') {
            //number ended - reset variables
            this.inNumber = false;
            this.hasDecimal = false;
            //work with the previous result as if it was manually typed
            if (this.isSet) {
                this.isSet = false;
            }
            //identify unary operations
            if (symbol.val === '-' && (this.inputSeq.length === 0 | (this.inputSeq.length && prevSymbol.type !== 'number'))) {
                symbol.unary = true;
            } else {
                symbol.unary = false;
            }

            //do not allow mult and division at the start of the expression
            if (this.inputSeq.length === 0 && symbol.val !== '-' ) {}
            else{
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
        //remove last result
        if (this.isSet) {
            this.inputSeq = []
            this.isSet = false;
        }
        //if it's the first symbol in a number
        if (!this.inNumber) {
            //push a value symbol to the input sequence
            this.inNumber = true;
            //add zero before decimal if it only starts with it
            if (symbol.type === 'decimal') symbol.val = '0' + symbol.val 
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
    console.log('OUTPUT')
    console.log(this.inputSeq);
    return this.inputSeq[this.inputSeq.length - 1];

    }

    getExpression(){
        let lastIndex = this.inputSeq.length;
        // if(this.inNumber){
        //     lastIndex = lastIndex - 1;
        // }
        lastIndex = lastIndex - 1;
        return this.inputSeq.slice(0, lastIndex).map((symbol) => symbol.val ).join('');
    }

    setInputSeq(symbol){
        this.inputSeq = [symbol];
        this.isSet = true;
        this.inNumber = false; // number ended
    }

    reset(){
        this.inputSeq = []
        this.inNumber = false;
        this.hasDecimal = false;
        this.hasMinus = false;
        this.currentNumber = undefined;
        this.isSet = false;
    }


}

class Button extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        if(this.props.type === 'clear'){
            this.props.register();
        }
        else{
            this.props.register({val: this.props.label, type: this.props.type});
        }        
    }

    render() {
        return ( 
            <button id = {this.props.id} onClick = {this.handleClick} > {this.props.label}</button>)
    }

}

class Calc extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     input: ''
        //     //inputDiv: undefined
        // };
        
        this.ops = new Stack();
        this.values = new Stack();

        this.parser = new InputParser();

        this.execute = this.execute.bind(this);
        this.getInput = this.getInput.bind(this);
        this.reset = this.reset.bind(this);
        this.updateDisplay = this.updateDisplay.bind(this);
        this.registerInput= this.registerInput.bind(this);
        
    }

    componentDidMount(){
        //this.setState({inputDiv: document.getElementById("input")});
        this.inputDiv = document.getElementById("input");
        this.memoryDiv = document.getElementById("memory");
        console.log( this.inputDiv )
    }

    isOperation(val){
        if (['+', '-', '*', '/', '('].includes(val)) {
            return true;
        }
        else{
            return false;
        }
    }

    isNumber(i){
        let val = this.input[i]
        let isStart = (i === 0) || (i > 0 && this.input[i-1] === '(')
        let isNumeric = !isNaN(val) ;
        let isDecimal = ( val === '.');
        let isMinus = (val === '-');
        let nextIsBracket = (i + 1 < this.input.length ) && (this.input[i+1] === '(');

        if (isNumeric || isDecimal || (isMinus && !nextIsBracket && (isStart || (!isStart && this.isOperation(this.input[i-1]) ) ) )) {
            return true;
        }
        else{
            return false
        }
    }

    isUniMinus(i){
        let val = this.input[i];
        let isMinus = (val === '-'); 
        if(i === 0 && isMinus) {
            return true;
        }
        if(i > 0  &&  isMinus && this.isOperation(this.input[i-1])) {
            return true;
        }
        else{
             return false;
        }
    }

    getInput() {
        this.input = this.memoryDiv.innerText.replaceAll(' ', '');
        this.ops = new Stack();
        this.values = new Stack();
    }

    reset() {
        this.inputDiv.innerHTML = '';
        this.memoryDiv.innerHTML = '';
        this.parser.reset();
    }

    updateDisplay(exp, append = true){
        if (append) this.inputDiv.innerHTML += exp;
        else this.inputDiv.innerHTML = exp;
    }

    registerInput(symbol){
        let currentSymbol = this.parser.parse(symbol);
        console.log(this.parser.getExpression());
        this.memoryDiv.innerHTML = this.parser.getExpression();
        if(symbol.type === 'equals'){
            let result = this.execute()
            this.parser.setInputSeq({val: result, type: 'number'});
            return;
        }
        else if(currentSymbol){
            this.updateDisplay(currentSymbol.val, false);
        }
    }


    execute() {
        this.getInput();

        let input = this.input
        console.log('INPUT', input);

        for (let i = 0; i < input.length; i++) {
            
            //if space - skip
            if (input[i] === ' ') continue;

            //if left bracket - push
            if(input[i] === '('){
                this.ops.push(new Operation(input[i]));
            }
            else {
                //if number
                if (this.isNumber(i)) {
                    let value = '';
                    while (i < input.length && this.isNumber(i))
                    {
                        value += input[i];
                        i++;
                    }
                    this.values.push(+value);
                    i--;
                } else
                if (input[i] === ')')
                {
                    console.log("BRACKET1");
                    while(!this.ops.isEmpty() && this.ops.peek().operation !== '(')
                    {
                        let val2 = this.values.pop();
                        let val1 = this.values.pop();
                        let op = this.ops.pop();
                        console.log(val2,val1, op.operation);
                        this.values.push(op.apply(val1, val2));
                        console.log(val2,val1, op.operation);
                    }
                     
                    // pop opening brace.
                    if(!this.ops.isEmpty()) this.ops.pop();
                    console.log("BRACKET2");
                    console.log('values after brackets', this.values.print());
                    console.log('operations after brackets', this.ops.print());
                }
                    else {
                    //if operation
                    let curOp;
                    if(this.isUniMinus(i)) {
                        curOp = new Operation(input[i], true);
                    }
                    else{
                        curOp = new Operation(input[i]);
                    }
                    //Apply pending operations
                    console.log('current', curOp.operation);
                    while (!this.ops.isEmpty() && this.ops.peek().priority() >= curOp.priority()) {
                        let val2 = this.values.pop();
                        let val1 = this.values.pop();
                        let op = this.ops.pop();
                        console.log(val2,val1, op.operation);
                        this.values.push(op.apply(val1, val2));
                    }

                    // Push current operation to  the stack
                    this.ops.push(curOp);
                    console.log('operations', this.ops.print());

                }
            }
        }

        console.log('Finish up')
        console.log(this.values.print());
        console.log(this.ops.print());
        
        //expression parsed calculate remaining operations

        while (!this.ops.isEmpty()) {
            let val2 = this.values.pop();
            let val1 = this.values.pop();
            let op = this.ops.pop();

            console.log(val2,val1, op.operation);
            this.values.push(op.apply(val1, val2));
        }

        console.log('result', this.values.print());
        this.updateDisplay(this.values.peek().toString(), false);
        return this.values.peek();
    }


    render() {
        const numbers = [...Array(9).keys()]
        const operations = {'plus':'+', 'minus':'-', 'mult': '*', 'divide': '/'}
        return ( <div id = 'calc' >
            <div id = 'memory' contentEditable></div> 
            <div id = 'input' contentEditable></div> 
            <div id='pads'>
            {numbers.map((value) => {
                return <Button key = {value.toString()} label ={value.toString()}  type='number' update = {this.updateDisplay} register = {this.registerInput}/>
            })}
            {Object.keys(operations).map((key, index) => {
                return <Button key = {key.toString()} label={operations[key].toString()}  type='operation' update = {this.updateDisplay} register = {this.registerInput}/>
            })}
             <Button key = 'decimal' label='.'  type='decimal' update = {this.updateDisplay} register = {this.registerInput}/>
             <Button key = 'equals' label='='  type='equals' update = {this.updateDisplay} register = {this.registerInput}/>
             <Button key = 'clear' label='C'  type='clear' update = {this.updateDisplay} register = {this.reset}/>
            </div>
            </div>)
    }

}

export default Calc;