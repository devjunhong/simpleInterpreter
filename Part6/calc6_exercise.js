// declaration of value token
const INTEGER = 'INTEGER', EOF = 'EOF';

// Declaration of operator token 
const PLUS = 'PLUS', MINUS = 'MINUS', MUL = 'MUL', DIV = 'DIV';

// Declaration of parenthesis token 
const LPAREN = 'LPAREN', RPAREN = 'RPAREN';

class Token{
  constructor(type, value){
    this.type = type; 
    this.value = value; 
  }

  tostring(){
    return `Token(${this.type}, ${this.value})`;
  }

  print(){
    console.log(this.tostring());
  }
}

class Lexer{
  constructor(text){
    this.text = text; 
    this.pos = 0; 
    this.current_char = this.text[this.pos];
  }

  error(){
    throw new Error('Unexpected token');
  }

  advance(){
    this.pos += 1;
    this.current_char = this.text[this.pos];
  }

  check_whitespace(){
    return /\s/.test(this.current_char);
  }

  check_digit(){
    return /\d/.test(this.current_char);
  }  

  skip_whitespace(){
    while(this.pos < this.text.length && this.check_whitespace()){
      this.advance();
    }
  }

  integer(){
    let result = ''; 
    while(this.pos < this.text.length && this.check_digit()){
      result += this.current_char;
      this.advance();
    }
    return Number(result); 
  }

  get_next_token(){
    if(this.check_whitespace()){
      this.skip_whitespace();
    }

    if(this.pos > this.text.length - 1){
      return new Token(EOF, null);
    }

    if(this.check_digit()){
      return new Token(INTEGER, this.integer());
    }

    if(this.current_char === '+'){
      this.advance();
      return new Token(PLUS, '+'); 
    }

    if(this.current_char === '-'){
      this.advance();
      return new Token(MINUS, '-'); 
    }

    if(this.current_char === '*'){
      this.advance();
      return new Token(MUL, '*');
    }

    if(this.current_char === '/'){
      this.advance();
      return new Token(DIV, '/');
    }

    if(this.current_char === '('){
      this.advance();
      return new Token(LPAREN, '('); 
    }

    if(this.current_char === ')'){
      this.advance();
      return new Token(RPAREN, ')'); 
    }

    this.error();
  }
}

class Interpreter{
  constructor(lexer){
    this.lexer = lexer; 
    this.current_token = this.lexer.get_next_token(); 
  }

  error(){
    throw new Error('Unexpected token');
  }

  factor(){
    if(this.current_token.type === INTEGER){
      const val = this.current_token.value;
      this.eat(INTEGER);
      return val; 
    }else if(this.current_token.type === LPAREN){
      this.eat(LPAREN);
      const val = this.expr();
      this.eat(RPAREN);
      return val;
    }
  }

  term(){
    let result = this.factor(); 

    while(this.current_token.type === MUL ||
      this.current_token.type === DIV){

      if(this.current_token.type === MUL){
        this.eat(MUL);
        result *= this.factor();
      }else if(this.current_token.type === DIV){
        this.eat(DIV);
        result /= this.factor(); 
      }
    }

    return result; 
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
      this.error();
    }
  }
}

// const input = "  11 + 1 * 3 + 4 / 2 * 2";
// Cannot read property 'type' of undefined

const input = "7 + (((3 + 2)))";
const lexer = new Lexer(input); 

// console.log(lexer.get_next_token().value); 
// console.log(lexer.get_next_token().value); 
// console.log(lexer.get_next_token().value); 

const interpreter = new Interpreter(lexer);

console.log(interpreter.current_token);
console.log(interpreter.lexer);
console.log(interpreter.expr());
// console.log(lexer.get_next_token().value); 