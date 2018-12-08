var Parser = require('expr-eval').Parser;
const tableStruct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o;} , {}));
const rowItem = tableStruct('Line', 'Type', 'Name', 'Condition', 'Value');
var myRows = [];
var afterSubString = '';
var initAss =[];
var initAssingmnetDic = {};


const pushFunctions = {
    'Program': ProgramParsing,
    'FunctionDeclaration': FunctionParsing,
    'VariableDeclaration': VariableParsing,
    'ExpressionStatement': ExpressionParsing,
    'AssignmentExpression': AssignmentParsing,
    'WhileStatement': WhileParsing,
    'IfStatement': IfParsing,
    'BlockStatement': BlockParsing,
    'ReturnStatement': ReturnParsing
};

const returnFunctions = {
    'Identifier': IdentifierParsing,
    'BinaryExpression': BinaryParsing,
    'Literal': LiteralParsing,
    'UnaryExpression': UnaryParsing,
    'MemberExpression': MemberParsing,
    'AssignmentExpression': AssignmentReturnParsing,
    'VariableDeclaration': VariableReturnParsing,
    'UpdateExpression': UpdateParsing
};

function makeRowsForInitAndAll(startCode, parsedCode, assignments){
    makeRow(startCode, assignments);
    makeRow(parsedCode, assignments);
}

function makeRow(parsedCode, assignments){
    pushFunctions[parsedCode.type](parsedCode, assignments);
}

function ProgramParsing(parsedCode, assignments){
    parsedCode['body'].forEach(body => makeRow(body, assignments));
}

function FunctionParsing(parsedCode, assignments) {
    afterSubString += 'function ' + parsedCode['id']['name'] + '(';
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'function declaration',parsedCode['id']['name'], '',''));
    parsedCode['params'].forEach(param => insertParams(param));
    afterSubString = afterSubString.slice(0, -2);
    afterSubString += '){<br/>';
    parsedCode['body']['body'].forEach(body=> makeRow(body, assignments));
    afterSubString += '}<br/>';

}

function VariableParsing(parsedCode, assignments){
    parsedCode['declarations'].forEach(decler => declaration(decler, assignments));
}

function declaration(parsedCode, assignments){
    var name = parsedCode['id'];
    name = returnFunctions[name.type](name, assignments);
    var value = parsedCode['init'];
    value = returnFunctions[value.type](value, assignments);
    assignments[name] = value;
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'variable declaration', name, '', value));
}

function ExpressionParsing(parsedCode, assignments){
    if(parsedCode['expression']['type'] === 'AssignmentExpression')
        AssignmentParsing(parsedCode['expression'], assignments);
    else if(parsedCode['expression']['type'] ==='CallExpression'){
        parsedCode['expression']['arguments'].forEach(body=> initAss.push(body.value));
    }
    else {
        var name = returnFunctions[parsedCode['expression']['argument'].type](parsedCode['expression']['argument']);
        var ret = UpdateParsing(parsedCode['expression'], assignments);
        myRows.push(rowItem(parsedCode['loc']['start']['line'], 'assignment expression', name, '', ret));
    }
}

function AssignmentParsing(parsedCode, assignments){
    var left = parsedCode['left'];
    left = returnFunctions[left.type](left, assignments);
    var value = parsedCode['right'];
    value = returnFunctions[value.type](value, assignments);
    assignments[left] = value;
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'assignment expression', left, '', value));
}

function WhileParsing(parsedCode, assignments){
    var test = parsedCode['test'];
    test = returnFunctions[test.type](test, assignments);
    afterSubString += 'while (' + test +')';
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'while statement', '', test, ''));
    makeRow(parsedCode['body'], assignments);
}

function IfParsing(parsedCode, assignments){
    var test= parsedCode['test'];
    test = returnFunctions[test.type](test, assignments);
    var ans = getAns(test, assignments);
    if(ans)
        afterSubString += '<div style="color:green">if (' + test +')</div>';
    else
        afterSubString += '<div style="color:red">if (' + test +')</div>';
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'if statement', '', test, ''));
    makeRow(parsedCode['consequent'], assignments);
    if(parsedCode['alternate']!=null)
        if(parsedCode['alternate']['type']=== 'IfStatement')
            elseif(parsedCode['alternate'], assignments);
        else  {
            afterSubString += 'else ';
            makeRow(parsedCode['alternate'], assignments);
        }
}

function BlockParsing(parsedCode, assignments){
    afterSubString += '{<p style="text-indent :2em;" >';
    var newAss = {};
    newAss = Object.create(assignments);
    parsedCode['body'].forEach(body => makeRow(body, newAss));
    afterSubString += '</p>}<br/>';
}

function ReturnParsing(parsedCode, assignments){
    var value = parsedCode['argument'];
    value = returnFunctions[value.type](value, assignments);
    afterSubString += 'return ' + value +';<br/>';
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'return statement', '', '', value));
}

function IdentifierParsing(parsedCode, assignments){
    return checkInAss( parsedCode['name'], assignments);
}

/**
 * @return {string}
 */
function BinaryParsing(parsedCode, assignments){
    var left = returnFunctions[parsedCode['left'].type](parsedCode['left'], assignments);
    left = checkInAss(left, assignments);
    var oper = parsedCode['operator'];
    var right = returnFunctions[parsedCode['right'].type](parsedCode['right'], assignments);
    right = checkInAss(right, assignments);
    return ''+ left + ' ' + oper + ' ' + right;
}

function LiteralParsing(parsedCode, assignments){
    return checkInAss(parsedCode['value'], assignments);
}

/**
 * @return {string}
 */
function UnaryParsing(parsedCode, assignments){
    var value = parsedCode['argument'];
    value = returnFunctions[value.type](value, assignments);
    value = checkInAss(value, assignments);
    return parsedCode['operator'] + '' + value;
}

/**
 * @return {string}
 */
function MemberParsing(parsedCode, assignments){
    var value = parsedCode['object'];
    value = returnFunctions[value.type](value, assignments);
    value = checkInAss(value, assignments);
    var property = returnFunctions[parsedCode['property'].type](parsedCode['property'], assignments);
    property = checkInAss(property, assignments);
    return '' + value +'[' + property +']';
}

/**
 * @return {string}
 */
function AssignmentReturnParsing(parsedCode, assignments){
    var left = parsedCode['left'];
    left = returnFunctions[left.type](left,assignments);
    left = checkInAss(left,assignments);
    var value = parsedCode['right'];
    value = returnFunctions[value.type](value,assignments);
    value = checkInAss(value,assignments);
    afterSubString += left + parsedCode['operator'] + value;
    return '' + left +parsedCode['operator']+value;
}

function VariableReturnParsing(parsedCode,assignments){
    return parsedCode['declarations'].reduce((str, declar) => str + declarationReturn(declar,assignments), '');
}

function declarationReturn(parsedCode,assignments){
    var name = parsedCode['id'];
    name = returnFunctions[name.type](name,assignments);
    name = checkInAss(name,assignments);
    var ret = '' + name;
    var value = parsedCode['init'];
    value = returnFunctions[value.type](value,assignments);
    value = checkInAss(value,assignments);
    ret +=  '=' + value;
    return ret;
}

/**
 * @return {string}
 */
function UpdateParsing(parsedCode,assignments){
    var arg = parsedCode['argument'];
    arg = returnFunctions[arg.type](arg,assignments);
    arg = checkInAss(arg,assignments);
    if(parsedCode['prefix'])
        return '' + parsedCode['operator'] + arg;
    else
        return '' + arg + parsedCode['operator'];
}

function insertParams(parsedCodeParam)
{
    afterSubString += parsedCodeParam['name'] + ', ';
    initAssingmnetDic[parsedCodeParam['name']] = initAss[0];
    initAss.shift();
    myRows.push(rowItem(parsedCodeParam['loc']['start']['line'], 'variable declaration', parsedCodeParam['name'],'','' ));
}

function elseif(parsedCode, assignments)
{
    var test = parsedCode['test'];
    test = returnFunctions[test.type](test,assignments);
    var ans = getAns(test, assignments);
    if(ans)
        afterSubString += '<div style="color:green">else if (' + test +')</div>';
    else
        afterSubString += '<div style="color:red">else if (' + test +')</div>';
    myRows.push(rowItem(parsedCode['loc']['start']['line'], 'else if statement', '', test, ''));
    makeRow(parsedCode['consequent'],assignments);
    if(parsedCode['alternate']!=null)
        if(parsedCode['alternate']['type'] === 'IfStatement')
            elseif(parsedCode['alternate'],assignments);
        else  {
            afterSubString += 'else ';
            makeRow(parsedCode['alternate'],assignments);
        }
}

function checkInAss(str,assignments){
    if(assignments[str] != null)
        return assignments[str];
    else
        return str;
}

function clearMyRows(){
    myRows = [];
    afterSubString = '';
}

function getAns(test, assignments){
    var expr = new Parser().parse(test);
    var dict = Object.create(assignments);
    for(var key in initAssingmnetDic)
        dict[key] = initAssingmnetDic[key];
    return expr.evaluate(dict);
}


export {makeRowsForInitAndAll, myRows, rowItem, clearMyRows, afterSubString};