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
        console.log('Stack: pop', this.stack[this.stack.length - 1])
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
        this.inputSeq = []
        this.inNumber = false;
        this.hasDecimal = false;
        this.hasMinus = false;
        this.currentNumber = undefined;
        this.isSet = false;
        this.bracketOpen = false;
        this.setInputSeq = this.setInputSeq.bind(this);
    }


    parse(symbol) {
        let prevSymbol = this.inputSeq[this.inputSeq.length - 1];

        if (symbol.type === 'equals') {
            //remove operations at the end
            while (this.inputSeq.length && prevSymbol.type === 'operation') {
                this.inputSeq.pop();
            }
            //add bracket if needed
            if(this.bracketOpen){
                this.inputSeq.push({type: 'bracket', val: ')'});
            }
            this.inputSeq.push(symbol);
        }
        if (symbol.val === '('){
            if(this.inputSeq.length === 0 || (this.inputSeq.length && prevSymbol.type === 'operation')) {
            this.bracketOpen = true;
            this.inputSeq.push(symbol);
            }
        }
        if (symbol.val === ')'){
        if(this.bracketOpen &&  prevSymbol.val !== '('  && prevSymbol.type !== 'operation') {
        this.bracketOpen = false;
        this.inputSeq.push(symbol);
        }
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

    getExpression(){
        let lastIndex = this.inputSeq.length;
        return this.inputSeq.slice(0, lastIndex).map((symbol) => symbol.val ).join('');
    }

    setInputSeq(symbol){
        this.inputSeq = [symbol];
        this.isSet = true;
        this.inNumber = false; // number ended
    }

    reset(){
        this.inputSeq = []
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

class History extends React.Component {

    constructor(props) {
        super(props);
        this.handleResultClick= this.handleResultClick.bind(this);
    }

    handleResultClick(result){
        this.props.setValueFunc(result);
    }

    render() {
        let items = this.props.items;
        return ( 
            <ol>
            {items.map((value, index) => {return <li key = {`item${index}`}> {value.expression} <span onClick = {() => this.handleResultClick(value.result)}>{value.result.toString()}</span> </li>})}
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
        this.getInput = this.getInput.bind(this);
        this.reset = this.reset.bind(this);
        this.registerInput= this.registerInput.bind(this);
        this.calcOp= this.calcOp.bind(this);
        this.saveToHistory= this.saveToHistory.bind(this);
        this.setFirstInputValue = this.setFirstInputValue.bind(this);
        
    }

    componentDidMount(){
        this.memoryDiv = document.getElementById("memory");
    }

    getInput() {
        this.input = this.memoryDiv.innerText.replaceAll(' ', '');
        this.ops = new Stack();
        this.values = new Stack();
    }
    
    saveToHistory(expr, result){
        let item = {'expression': expr, 'result' :result};
        this.setState({history: [...this.state.history, item]});
    }

    reset() {
        this.setState({currentItem : 0, currentExpr: ''});
        this.memoryDiv.innerHTML = '';
        this.parser.reset();
        this.ops = new Stack();
        this.values = new Stack();
    }

    setFirstInputValue(val, expr){
        this.parser.setInputSeq({val: val, type: 'number'});
        this.setState({currentItem: val});
        if(expr){
            this.setState({currentExpr: expr});
        }
    }

    registerInput(symbol){
        let currentSymbol = this.parser.parse(symbol);
        this.memoryDiv.innerHTML = this.parser.getExpression();
        if(symbol.type === 'equals'){
            let result = this.execute();
            this.setFirstInputValue(result);
            //save result
            console.log(this.state.history);

            return;
        }
        else if(currentSymbol){
            this.setState({currentItem: currentSymbol.val});
        }
    }

    calcOp(){
        let val2 = this.values.pop();
        let op = this.ops.pop();
        let val1 = op.unary ? undefined : this.values.pop();
        this.values.push(op.apply(val1, val2));
    }

    execute() {
        //don't take '=' symbol at the end
        let input = this.parser.inputSeq.slice( 0 , this.parser.inputSeq.length - 1);
        console.log(input);

        for (let i = 0; i < input.length; i++) {
            console.log('element >', input[i]);
            //if left bracket - push
            if (input[i].val === '(') {
                this.ops.push(new Operation(input[i].val));
            } else {
                //if number
                if (input[i].type === 'number') {
                    this.values.push(+input[i].val);
                } else
                if (input[i].val === ')') {
                    while (!this.ops.isEmpty() && this.ops.peek().operation !== '(') {
                        this.calcOp();
                    }
                    // pop opening brace.
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

        //expression parsed calculate remaining operations
        while (!this.ops.isEmpty()) {
            this.calcOp();
        }
        
        let result = this.values.peek()

        this.saveToHistory(this.parser.getExpression(), result);
        this.setState({currentItem: result});
    

        return result;
    }


    render() {
        const numbers = [...Array(9).keys()]
        const operations = {'plus':'+', 'minus':'-', 'mult': '*', 'divide': '/'}
        return ( <div id = 'calc' >
            <div id = 'memory'></div> 
            <div id = 'input'>{this.state.currentItem}</div> 
            <div id='pads'>
            {numbers.map((value) => {
                return <Button key = {value.toString()} label ={value.toString()}  type='number' register = {this.registerInput}/>
            })}
            {Object.keys(operations).map((key, index) => {
                return <Button key = {key.toString()} label={operations[key].toString()}  type='operation' register = {this.registerInput}/>
            })}
            <Button key = 'lbracket' label='('  type='bracket' register = {this.registerInput}/>
            <Button key = 'rbracket' label=')'  type='bracket' register = {this.registerInput}/>
            <Button key = 'decimal' label='.'  type='decimal' register = {this.registerInput}/>
            <Button key = 'equals' label='='  type='equals' register = {this.registerInput}/>
            <Button key = 'clear' label='C'  type='clear' register = {this.reset}/>
            </div>
            <History items = {this.state.history} setValueFunc = {this.setFirstInputValue}/>
            </div>)
    }

}

export default Calc;