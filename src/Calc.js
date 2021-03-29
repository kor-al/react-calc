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

class Calc extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: ''
        };
        this.ops = new Stack();
        this.values = new Stack();

        this.execute = this.execute.bind(this);
        this.getInput = this.getInput.bind(this);
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
        let val = this.state.input[i]
        let isStart = (i === 0) || (i > 0 && this.state.input[i-1] === '(')
        let isNumeric = !isNaN(val) ;
        let isDecimal = ( val === '.');
        let isMinus = (val === '-');
        let nextIsBracket = (i + 1 < this.state.input.length ) && (this.state.input[i+1] === '(');

        if (isNumeric || isDecimal || (isMinus && !nextIsBracket && (isStart || (!isStart && this.isOperation(this.state.input[i-1]) ) ) )) {
            return true;
        }
        else{
            return false
        }
    }

    isUniMinus(i){
        let val = this.state.input[i];
        let isMinus = (val === '-'); 
        if(i === 0 && isMinus) {
            return true;
        }
        if(i > 0  &&  isMinus && this.isOperation(this.state.input[i-1])) {
            return true;
        }
        else{
             return false;
        }
    }

    getInput() {
        let inputEq = document.getElementById("input").innerText.replaceAll(' ', '');;
        this.setState({
            input: inputEq
        });
        this.ops = new Stack();
        this.values = new Stack();
    }

    execute() {
        this.getInput();

        let input = this.state.input
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
        return this.values.peek();
    }


    render() {
        //this.execute()
        return ( <div id = 'calc' >
            <div id = 'input' contentEditable></div> 
            <button id = 'equals'
            onClick = {this.execute}> = </button>
             </div>)
    }

}

export default Calc;