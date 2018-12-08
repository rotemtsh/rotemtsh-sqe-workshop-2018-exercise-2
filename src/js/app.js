import $ from 'jquery';
import {parseCode} from './code-analyzer';
import  {makeRow,  clearMyRows, afterSubString} from './makeRows';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var assignments = {};
        makeRow(parsedCode, assignments);
        document.getElementsByTagName('p')[0].innerHTML=afterSubString;
        clearMyRows();
    });
});


