# everything from scratch without looking over the example 
# as written in the exercise on part 3
INTEGER, ADD, SUB, EOF = 'INTEGER', 'ADD', 'SUB', 'EOF'

class Token(object):
	def __init__(self, t, v):
		self.value = v
		self.type = t

	def __str__(self):
		return 'value: %s\ntype: %s\n' % (self.value, self.type)

class Interpreter(object):
	def __init__(self, text):
		self.current_token = None 
		self.text = text
		self.pos = 0

	def error(self):
		raise Exception('Unexpected token')

	def eat(self, t):
		if self.current_token.type == t:
			self.current_token = self.get_next_token()
		else:
			self.error()

	def advance(self): 
		if self.pos < len(self.text):
			self.pos += 1

	def skip_whitespace(self):
		text = self.text
		current_char = text[self.pos]

		while current_char.isspace():
			self.advance()
			if self.pos > len(text) - 1:
				break
			current_char = text[self.pos]

	def get_integer(self): 
		concatenate = ''
		current_char = self.text[self.pos]

		while current_char.isdigit():
			concatenate += current_char
			self.advance()
			if self.pos > len(self.text) - 1:
				break
			current_char = self.text[self.pos]

		return int(concatenate)

	def get_next_token(self):
		text = self.text

		if self.pos < len(text) and text[self.pos].isspace():
			self.skip_whitespace()

		if self.pos > len(text) - 1:
			return Token(EOF, None)

		current_char = text[self.pos]

		if current_char.isdigit():
			value = self.get_integer()
			return Token(INTEGER, value)

		if current_char == '+':
			self.advance()
			return Token(ADD, current_char)

		if current_char == '-':
			self.advance()
			return Token(SUB, current_char) 

		self.error()

		return None 

	def expr(self):
		self.current_token = self.get_next_token()

		left = self.current_token
		self.eat(INTEGER)

		result = left.value 
		while self.current_token.type != EOF:
			op = self.current_token

			if op.type == 'ADD':
				self.eat(ADD)
			elif op.type == 'SUB':
				self.eat(SUB)

			right = self.current_token
			self.eat(INTEGER)

			if op.type == 'ADD':
				result += right.value
			elif op.type == 'SUB':
				result -= right.value

		return result

def main():
	while True:
		text = raw_input('calc > ')
		interpreter = Interpreter(text)
		result = interpreter.expr()
		print(result)

if __name__ == '__main__':
	main()