import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {makeRow,afterSubString, clearMyRows} from '../src/js/makeRows';


describe('The javascript parser for assignment', () => {
    it('is parsing a simple flow correctly', () => {
        clearMyRows();
        makeRow(parseCode('function foo(a){return a;}'),{});
        var str = 'function foo(a){<br/>return a;<br/>}<br/>';
        assert.equal(afterSubString, str);
    });
    it('is parsing an assignment correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){a=1;}'),{});
        var ans = 'function myFunc(a){<br/>a = 1;<br/>}<br/>';
        assert.equal(ans, afterSubString);});
    it('is parsing a variable correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){let b=1;}'), {});
        var ans = 'function myFunc(a){<br/>}<br/>';
        assert.equal(ans, afterSubString);});
});

describe('The javascript parser for conditions', () => {
    it('is parsing a if statement correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){if(a < 1)a=a+1;}'),{});
        var ans = 'function myFunc(a){<br/><div style="background-color:red;display:inline-block;">if (a < 1)</div>a = a + 1;<br/>}<br/>';
        assert.equal(ans, afterSubString);});
    it('is parsing a else if correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){if(a < 1)a=a+1; else if(a == 1) a = a+2;}'),{});
        var ans = 'function myFunc(a){<br/><div style="background-color:red;display:inline-block;">if (a < 1)</div>a = a + 1;<br/><div style="background-color:red;display:inline-block;">else if (a == 1)</div>a = a + 2;<br/>}<br/>';
        assert.equal(ans, afterSubString);});
    it('is parsing a else correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){let b = a +1;let c =0;if(b > c){b = b +1;return b;}else {a=1;return a;}}'),{});
        var ans = 'function myFunc(a){<br/><div style="background-color:red;display:inline-block;">if (a + 1 > 0)</div>{<p style="text-indent :2em;" >return a + 1 + 1;<br/></p>}<br/>else {<p style="text-indent :2em;" >a = 1;<br/>return 1;<br/></p>}<br/>}<br/>';
        assert.equal(ans, afterSubString);});
    it('is parsing a else with else if correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a){let b = a +1;let c =0;if(b > c){b = b +1;return b;}else if(b == c){c = b;return c;}else {a=1;return a;}}'),{});
        var ans = 'function myFunc(a){<br/><div style="background-color:red;display:inline-block;">if (a + 1 > 0)</div>{<p style="text-indent :2em;" >return a + 1 + 1;<br/></p>}<br/><div style="background-color:red;display:inline-block;">else if (a + 1 == 0)</div>{<p style="text-indent :2em;" >return a + 1;<br/></p>}<br/>else {<p style="text-indent :2em;" >a = 1;<br/>return 1;<br/></p>}<br/>}<br/>';
        assert.equal(ans, afterSubString);});
});
//
// describe('The javascript parser for loops', () => {
//     it('is parsing a while statement correctly', () => {
//         clearMyRows();
//         makeRow(parseCode('while(a < b)\n b=1;'));
//         var rows = [];
//         rows.push(rowItem(1,'while statement','' ,'a < b',''));
//         rows.push(rowItem(2, 'assignment expression','b','',1));
//         assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
//     it('is parsing a for statement correctly', () => {
//         clearMyRows();
//         makeRow(parseCode('for(a=0; a < b; ++a){\n a=1}'));
//         var rows = [];
//         rows.push(rowItem(1,'for statement','' ,'a=0;a < b;++a',''));
//         rows.push(rowItem(2, 'assignment expression','a','',1));
//         assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
// });
//
describe('The javascript parser for function', () => {

//     it('is parsing a return statement correctly', () => {
//         clearMyRows();
//         makeRow(parseCode('function myFunc(a){\nb=1\n return b;}'));
//         var rows = [];
//         rows.push(rowItem(1,'function declaration','myFunc' ,'',''));
//         rows.push(rowItem(1, 'variable declaration','a','',''));
//         rows.push(rowItem(2, 'assignment expression','b','',1));
//         rows.push(rowItem(3, 'return statement','','','b'));
//         assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
});
//
// describe('The javascript parser for program', () => {
//     it('is parsing a function declaration correctly', () => {clearMyRows();
//         makeRow(parseCode('function binarySearch(X, V, n){\n let low, high, mid;\n' +
//             '       low = 0;\n high = n - 1;\n while (low <= high) {\n mid = (low + high)/2;\n' +
//             '        if (X < V[mid])\n high = mid - 1;\n' +
//             '        else if (X > V[mid])\n low = mid + 1;\n' +
//             '        else\n return mid;\n }\n return -1;\n}'));
//         var rows = [];
//         rows.push(rowItem(1,'function declaration','binarySearch' ,'',''));
//         rows.push(rowItem(1, 'variable declaration','X','',''));
//         rows.push(rowItem(1, 'variable declaration','V','',''));
//         rows.push(rowItem(1, 'variable declaration','n','',''));
//         rows.push(rowItem(2, 'variable declaration','low','',null));
//         rows.push(rowItem(2, 'variable declaration','high','',null));
//         rows.push(rowItem(2, 'variable declaration','mid','',null));
//         rows.push(rowItem(3, 'assignment expression','low','',0));
//         rows.push(rowItem(4, 'assignment expression','high','','n - 1'));
//         rows.push(rowItem(5,'while statement','' ,'low <= high',''));
//         rows.push(rowItem(6, 'assignment expression','mid','','low + high / 2'));
//         rows.push(rowItem(7, 'if statement','','X < V[mid]',''));
//         rows.push(rowItem(8,'assignment expression','high' ,'','mid - 1'));
//         rows.push(rowItem(9, 'else if statement','','X > V[mid]',''));
//         rows.push(rowItem(10, 'assignment expression','low','','mid + 1'));
//         rows.push(rowItem(12,'return statement','' ,'','mid'));
//         rows.push(rowItem(14, 'return statement','','','-1'));
//         assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
// });
//
//
// describe('The javascript parser for program', () => {
//     it('is parsing a function declaration correctly', () => {clearMyRows();
//         makeRow(parseCode('function myFunc(a, b, c){\n' +
//             '        for (let i =0; i< a; i++) {\n if(i>b){\n' +
//             '       c++;} \n else if(i < c)\n{ --b; }\n else ++a\n}\n' +
//             '        return a + b + c;}'));
//         var rows = [];
//         rows.push(rowItem(1,'function declaration','myFunc' ,'',''));
//         rows.push(rowItem(1, 'variable declaration','a','',''));
//         rows.push(rowItem(1, 'variable declaration','b','',''));
//         rows.push(rowItem(1, 'variable declaration','c','',''));
//         rows.push(rowItem(2, 'for statement','','i=0;i < a;i++',''));
//         rows.push(rowItem(3, 'if statement','','i > b',''));
//         rows.push(rowItem(4, 'assignment expression','c','','c++'));
//         rows.push(rowItem(5, 'else if statement','','i < c',''));
//         rows.push(rowItem(6, 'assignment expression','b','','--b'));
//         rows.push(rowItem(7,'assignment expression','a' ,'','++a'));
//         rows.push(rowItem(9, 'return statement','','','a + b + c'));
//         assert.equal(JSON.stringify(myRows),JSON.stringify(rows));});
// });

//function foo(a, b, c){
// let x = a;
// let y = b;
//
// if(y > x[0]){
//
// b = y +1;
// a[0] = b;
// }
//
// return y;
//
// }