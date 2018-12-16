import $ from 'jquery';
import {parseCode} from './code-analyzer';
import  {makeRowsForInitAndAll,  clearMyRows, afterSubString} from './substitution';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var assignments = {};
        let callCode = $('#applyCode').val();
        makeRowsForInitAndAll(parseCode(callCode), parsedCode, assignments);
        document.getElementsByTagName('p')[0].innerHTML=afterSubString;
        clearMyRows();
    });
});



