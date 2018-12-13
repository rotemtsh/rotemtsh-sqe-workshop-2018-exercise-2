var Parser = require('expr-eval').Parser;

var afterSubString = '';
var initAss =[];
var globals =[];
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
    'UpdateExpression': UpdateParsing,
    'ArrayExpression': ArrayParsing
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
}

function ExpressionParsing(parsedCode, assignments){
    if(parsedCode['expression']['type'] === 'AssignmentExpression')
        AssignmentParsing(parsedCode['expression'], assignments);
    else //CallExpression
        parsedCode['expression']['arguments'].forEach(body=> initAss.push(returnFunctions[body.type](body, assignments)));
}

function AssignmentParsing(parsedCode, assignments){
    var left = parsedCode['left']['name'];
    //left = returnFunctions[left.type](left, assignments);
    var value = parsedCode['right'];
    value = returnFunctions[value.type](value, assignments);
    assignments[left] = value;
    if(checkForAssignment(parsedCode['left'])){
        afterSubString += left + ' = ' + value +';<br/>';
    }
}

function WhileParsing(parsedCode, assignments){
    var test = parsedCode['test'];
    test = returnFunctions[test.type](test, assignments);
    afterSubString += 'while (' + test +')';
    var newAss = Object.create(assignments);
    makeRow(parsedCode['body'], newAss);
}

function IfParsing(parsedCode, assignments){
    var test= parsedCode['test'];
    test = returnFunctions[test.type](test, assignments);
    var ans = getAns(test, assignments);
    var color ='';
    if(ans) {
        afterSubString += '<div style="background-color:green;display:inline-block;">if (' + test + ')</div>';
        color = 'green';}
    else {
        afterSubString += '<div style="background-color:red;display:inline-block;">if (' + test + ')</div>';
        color = 'red';}
    var newAss = Object.create(assignments);
    makeRow(parsedCode['consequent'], newAss);
    if(parsedCode['alternate']!=null)
        if(parsedCode['alternate']['type']=== 'IfStatement')
            elseif(parsedCode['alternate'], assignments, color);
        else  {
            afterSubString += 'else ';
            makeRow(parsedCode['alternate'], assignments);}
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
    if(oper === '*' || oper === '/')
        return '('+ left + ') ' + oper + ' ' + right;
    else
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

/**
 * @return {string}
 */
function ArrayParsing(parsedCode,assignments){
    var arg = parsedCode['elements'];
    var retVal = '[';
    arg.forEach(body=> retVal += returnFunctions[body.type](body, assignments) + ', ');
    retVal = retVal.slice(0, -2);
    retVal += ']';
    return retVal;
}

function insertParams(parsedCodeParam)
{
    afterSubString += parsedCodeParam['name'] + ', ';
    if(initAss.length > 0) {
        initAssingmnetDic[parsedCodeParam['name']] = initAss[0];
        initAss.shift();
    }
    globals.push(parsedCodeParam['name']);
}

function elseif(parsedCode, assignments, color) {
    var test = parsedCode['test'];
    test = returnFunctions[test.type](test,assignments);
    var ans = getAns(test, assignments);
    if(ans && color !== 'green') {
        afterSubString += '<div style="background-color:green;display:inline-block;">else if (' + test + ')</div>';
        color = 'green';}
    else {
        afterSubString += '<div style="background-color:red;display:inline-block;">else if (' + test + ')</div>';
        color = 'red';}
    var newAss = Object.create(assignments);
    makeRow(parsedCode['consequent'],newAss);
    if(parsedCode['alternate']!=null)
        if(parsedCode['alternate']['type'] === 'IfStatement')
            elseif(parsedCode['alternate'],assignments, color);
        else  {
            afterSubString += 'else ';
            makeRow(parsedCode['alternate'],assignments);
        }
}

function checkInAss(str,assignments){
    var ret ='';
    if(assignments[str] != null) {

        ret =  '' + assignments[str];
    }
    else
        ret =  '' + str;
    var splitCloseBraces = ret.split(']');
    if (splitCloseBraces.length > 2) {
        var splitOpenBraces = splitCloseBraces[1].split('[');
        splitCloseBraces[0] = splitCloseBraces[0].split('[')[1];
        var splitCommas = splitCloseBraces[0].split(',');
        return splitCommas[splitOpenBraces[1]];
    }
    else
        return ret;
}

function clearMyRows(){
    afterSubString = '';
}

function getAns(test, assignments){
    test = replaceArray(test,assignments);
    var expr = new Parser().parse(test);
    var dict = Object.create(assignments);
    for(var key in initAssingmnetDic)
        dict[key] = initAssingmnetDic[key];
    try {
        return expr.evaluate(dict);
    }
    catch (e) {
        return false;
    }
}

function checkForAssignment(left){
    if(left.type === 'Identifier')
        return globals.includes(left.name);
    else//member
        return globals.includes(left['object'].name);
}

function replaceArray(test,assignment){
    var withoutSpaces = test.split(' ');
    var testToRet = '';
    for(var part in withoutSpaces) {
        var splitOpenBraces = withoutSpaces[part].split('[');
        if (splitOpenBraces.length > 1) {
            var splitCloseBraces = splitOpenBraces[1].split(']');
            var place = replaceArray(splitCloseBraces[0], assignment);
            var array = '';
            if (initAssingmnetDic[splitOpenBraces[0]] != null)
                array = initAssingmnetDic[splitOpenBraces[0]];
            else array = assignment[splitOpenBraces[0]];
            var args = array.split('[')[1].split(']')[0];
            args = args.split(',');
            testToRet += args[place] + ' ';
        }
        else testToRet += withoutSpaces[part] + ' ';
    }
    return testToRet.slice(0,-1);
}


export {makeRowsForInitAndAll, clearMyRows, afterSubString, makeRow};