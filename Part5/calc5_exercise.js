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
    this.current_char = text[0];
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
    if(this.pos > this.text.length - 1){
      return new Token(EOF, null);
    }

    if(/\s/.test(this.current_char)){
      this.skip_whitespace();
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
    this.evaluate = 0;
  }

  term(){
    const left = this.factor();

    const op = this.current_token.type; 
    if(op === MUL){
      eat(MUL);
    }else if(op === DIV){
      eat(MUL);
    }else{
      this.lexer.error();
    }
    
    const right = this.factor();

    if(op === MUL){
      this.evaluate = left * right;
    }else if(op === DIV){
      this.evaluate = left / right;
    }
  }

  factor(){
    const value = this.current_token.value; 
    this.eat(INTEGER);
    return value;
  }

  expr(){
    const left = this.term();

    const op = this.current_token.type; 
    if(op === PLUS){
      eat(PLUS);
    }else if(op === MINUS){
      eat(MINUS);
    }else{
      this.lexer.error();
    }
    
    const right = this.term();

    if(op === PLUS){
      this.evaluate = left + right;
    }else if(op === MINUS){
      this.evaluate = left - right;
    }
  }

  eat(type){
    if(this.current_token.type === type){
      this.current_token = this.lexer.get_next_token();
    }else{
      this.lexer.error();
    }
  }
}

const lexer = new Lexer("11           +          321      ");
const interpreter = new Interpreter(lexer); 
interpreter.expr();
console.log(interpreter.evaluate);
