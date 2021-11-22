// before (add 20 (subtract 4 2))

// after add(20, subtract(4, 2))

// 分词 把所有的语句进行分解
function generateToken(str) {
  let curIndex = 0;
  const tokens = [];

  while (curIndex < str.length) {
    let char = str[curIndex];
    // 字符匹配
    if (/[a-zA-Z]/.test(char)) {
      let stringValue = "";
      while (/[a-zA-Z]/.test(char)) {
        stringValue += char;
        char = str[++curIndex];
      }
      tokens.push({
        type: "name",
        value: stringValue,
      });
      // 数字匹配
    } else if (/\d/.test(char)) {
      let numberVal = "";
      while (/\d/.test(char)) {
        numberVal += char;
        char = str[++curIndex];
      }
      tokens.push({
        type: "number",
        value: numberVal,
      });
      // 开、闭括号匹配
    } else if (char === "(") {
      tokens.push({
        type: "paren",
        value: char,
      });
      curIndex++;
    } else if (char === ")") {
      tokens.push({
        type: "paren",
        value: char,
      });
      curIndex++;
      // 空格匹配
    } else if (/\s/.test(char)) {
      curIndex++;
    } else {
      throw new TypeError(`current char: ${str[curIndex]} is not match`);
    }
  }

  return tokens;
}

// 生成 ast
function generateAST(tokens) {
  let current = 0;

  let ast = {
    type: "Program",
    body: [],
  };

  function walk() {
    let token = tokens[current];

    // 判断值
    if (token.type === "number") {
      current++;

      return {
        type: "NumberLiteral",
        value: token.value,
      };
      // 判断行为
    } else if (token.type === "paren" && token.value === "(") {
      token = tokens[++current];
      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };
      token = tokens[++current];

      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }
  }

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

function transformer(ast) {
  let newAst = {
    type: "Program",
    body: [],
  };

  ast._context = newAst.body;

  DFS(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.value,
        });
      },
    },
  });
}

// 深度优先遍历我们的 ast
function DFS(ast, visitor) {
  function tranversNode(node, parent) {
    let methods = visitor[node.type];
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }
  }

  return tranversNode(ast, null);
}

function parser(input) {
  const tokens = generateToken(input);
  const ast = generateAST(tokens);
  return JSON.stringify(ast);
}

module.exports = parser;
