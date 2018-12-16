import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {makeRow,afterSubString, clearMyRows, makeRowsForInitAndAll} from '../src/js/substitution';


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

describe('The javascript parser for loops', () => {
    it('is parsing a while statement correctly', () => {
        clearMyRows();
        makeRow(parseCode('function myFunc(a, b){let x = a;while(x < b){a++;x++;}return x;}'),{});
        var ans = 'function myFunc(a, b){<br/>while (a < b){<p style="text-indent :2em;" >a++;<br/></p>}<br/>return a;<br/>}<br/>';
        assert.equal(ans, afterSubString);});
});

describe('The javascript parser for apply function', () => {

    it('is parsing applay function correctly', () => {
        clearMyRows();
        makeRowsForInitAndAll(parseCode('foo([1,2], 3,4);'), parseCode('function foo(a, b, c){let x = a;let y = b;if(y > x[0]){b = y +1;a[0] = b;}return y;}'), {});
        var ans = 'function foo(a, b, c){<br/><div style="background-color:green;display:inline-block;">if (b > a[0])</div>{<p style="text-indent :2em;" >b = b + 1;<br/>a[0] = b + 1;<br/></p>}<br/>return b;<br/>}<br/>';
        assert.equal(ans, afterSubString);});
});

describe('The javascript parser for program', () => {
    it('is parsing a example run correctly', () => {clearMyRows();
        makeRowsForInitAndAll(parseCode('foo(1, 2, 3);'), parseCode('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if (b < z) {' +
            'c = c + 5;return x + y + z + c;} else if (b < z * 2) {c = c + x + 5;return x + y + z + c;} else {' +
            'c = c + z + 5;return x + y + z + c;}}'), {});
        var ans ='function foo(x, y, z){<br/><div style="background-color:red;display:inline-block;">' +
            'if (x + 1 + y < z)</div>{<p style="text-indent :2em;" >return x + y + z + 0 + 5;<br/></p>}' +
            '<br/><div style="background-color:green;display:inline-block;">else if (x + 1 + y < (z) * 2)' +
            '</div>{<p style="text-indent :2em;" >return x + y + z + 0 + x + 5;<br/></p>}<br/>else {' +
            '<p style="text-indent :2em;" >return x + y + z + 0 + z + 5;<br/></p>}<br/>}<br/>';
        assert.equal(ans, afterSubString);});
});

describe('The javascript parser for program', () => {
    it('is parsing a example run correctly', () => {clearMyRows();
        makeRowsForInitAndAll(parseCode('foo(-1, 2, 3);'), parseCode('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if (b < z) {' +
            'c = c + 5;return x + y + z + c;} else if (b < z * 2) {c = c + x + 5;return x + y + z + c;} else if (b < z * 3) {++x;' +
            'return x + y + z + c;} else {c = c + z + 5;return x + y + z + c;}}'), {});
        var ans ='function foo(x, y, z){<br/><div style="background-color:green;display:inline-block;">' +
            'if (x + 1 + y < z)</div>{<p style="text-indent :2em;" >return x + y + z + 0 + 5;<br/></p>}<br/>' +
            '<div style="background-color:red;display:inline-block;">else if (x + 1 + y < (z) * 2)</div>{' +
            '<p style="text-indent :2em;" >return x + y + z + 0 + x + 5;<br/></p>}<br/><div style="background-color:red;display:inline-block;">' +
            'else if (x + 1 + y < (z) * 3)</div>{<p style="text-indent :2em;" >++x;<br/>return x + y + z + 0;<br/></p>}' +
            '<br/>else {<p style="text-indent :2em;" >return x + y + z + 0 + z + 5;<br/></p>}<br/>}<br/>';
        assert.equal(ans, afterSubString);});
});

describe('The javascript parser for program with globals', () => {
    it('is parsing a example run with globals correctly', () => {clearMyRows();
        makeRowsForInitAndAll(parseCode('foo([1], 2, 3);'), parseCode('let a = 5;function foo(x, y, z){let b = x[0] + a;' +
            'let c = y + z;if(b < c){x[0] = a;}else{ x[0] = y;}return x[0];}'), {});
        var ans ='function foo(x, y, z){<br/><div style="background-color:red;display:inline-block;">' +
            'if (x[0] + a < y + z)</div>{<p style="text-indent :2em;" >x[0] = a;<br/></p>}<br/>else {' +
            '<p style="text-indent :2em;" >x[0] = y;<br/></p>}<br/>return x[0];<br/>}<br/>';
        assert.equal(ans, afterSubString);});
});


