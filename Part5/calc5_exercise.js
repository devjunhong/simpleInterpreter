const PLUS = 'PLUS', MINUS = 'MINUS', MUL = 'MUL', DIV = 'DIV';
const INTEGER = 'INTEGER', EOF = 'EOF';

class Token{
  constructor(type, value){
    this.type = type;
    this.value = value;
  }

  toString(){
    return `Token(${this.type}, ${this.value})`;
  }
}

class Lexer{
  constructor(text){
    this.text = text; 
    this.pos = 0
    this.current_char = text[this.pos];
  }

  error(){
    throw "Unexpected token";
  }

  get_integer(){
    let result = '';
    while(/\d/.test(this.current_char)){
      result += this.current_char;
      this.advance();
    }
    return Number(result);
  }

  advance(){
    if(this.pos > this.text.length - 1){
      this.current_char = null;
    }else{
      this.pos += 1
      this.current_char = this.text[this.pos];
    }
  }

  skip_whitespace(){
    while(/\s/.test(this.current_char)){
      this.advance();
    }
  }

  get_next_token(){
    if(/\s/.test(this.current_char)){
      this.skip_whitespace();
    }

    if(this.pos > this.text.length - 1){
      return new Token(EOF, null);
    }

    if(/\d/.test(this.current_char)){
      return new Token(INTEGER, this.get_integer());
    }

    switch(this.current_char){
      case '+':
        this.advance();
        return new Token(PLUS, '+');
      case '-':
        this.advance();
        return new Token(MINUS, '-');
      case '*':
        this.advance();
        return new Token(MUL, '*');
      case '/':
        this.advance();
        return new Token(DIV, '/');
      default:
        this.error();
    }
  }
}

class Interpreter{
  constructor(lexer){
    this.lexer = lexer;
    this.current_token = lexer.get_next_token();
  }

  term(){
    let result = this.factor();

    while(this.current_token.type === MUL ||
      this.current_token.type === DIV){
      if(this.current_token.type === MUL){
        this.eat(MUL);
        result = result * this.factor();
      }else if(this.current_token.type === DIV){
        this.eat(DIV);
        result = result / this.factor();
      }
    }

    return result;
  }

  factor(){
    const value = this.current_token.value; 
    this.eat(INTEGER);
    return value;
  }

  expr(){
    let result = this.term(); 

    while(this.current_token.type === PLUS ||
      this.current_token.type === MINUS){
      if(this.current_token.type === PLUS){
        this.eat(PLUS);
        result += this.term();
      }else if(this.current_token.type === MINUS){
        this.eat(MINUS);
        result -= this.term();
      }
    }

    return result;
  }

  eat(type){
    if(this.current_token.type === type){
      this.current_token = this.lexer.get_next_token();
    }else{
      this.lexer.error();
    }
  }
}

const readline = require('readline'); 
const rl = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});

rl.setPrompt('calc > ');
rl.prompt(); 

rl.on('line', function(line){
  let lexer = new Lexer(line); 
  let interpreter = new Interpreter(lexer); 
  console.log(interpreter.expr());
  rl.prompt();
}).on('close', function(){
  console.log('bye bye'); 
  process.exit(0);
});