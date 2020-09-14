// ==UserScript==
// @name         Karat Form Crystals
// @namespace    http://www.leoseccia.co.uk/
// @version      0.3
// @description  make form filling faster | Ctrl + Q for candidate's name and Ctrl + Alt + 1 (He) | 2 (She) | 3 (They) for sex change | Click on candidate's name for name too... :)
// @author       Leonardo Seccia
// @match        https://central.karat.io/**/edit
// @match        https://central.karat.io/**edit=true
// @grant        none
// ==/UserScript==

// TODO: split into two files... name and gender
(function() {
    'use strict';

    var curT;

    $("span[class='body candidate-name']").parent().click(pasteName);

    $(document).keydown(e => {if(e.which == 81 && e.ctrlKey ) pasteName()});

    $(document).keydown(e => {if(e.which == 49 && e.ctrlKey ) swapGenderHe()});
    $(document).keydown(e => {if(e.which == 50 && e.ctrlKey ) swapGenderShe()});
    $(document).keydown(e => {if(e.which == 51 && e.ctrlKey ) swapGenderThey()});

    // `
    //$(document).keydown(e => {if(e.which == 223 && e.ctrlKey ) swapGenderThey()});

    $("textarea").focus(a=> curT = a.target);

    function pasteName() {

        let myValue = $("span[class='body candidate-name']").text().split(' ')[0] + ' ';

        if (curT.selectionStart || curT.selectionStart == '0') {
            var startPos = curT.selectionStart;
            var endPos = curT.selectionEnd;
            var scrollTop = curT.scrollTop;
            updateReact(curT, curT.value.substring(0, startPos) + myValue + curT.value.substring(endPos,curT.value.length));
            setTimeout(function(){
            curT.focus();
            curT.selectionStart = startPos + myValue.length;
            curT.selectionEnd = startPos + myValue.length;
            curT.scrollTop = scrollTop;
            }, 50);


        } else {
            updateReact(curT.value + myValue);
            curT.focus();
        }
    }

    function swapGenderHe(){
        let text = curT.value;
        
        text = text.replace(/(?:^|(?<= ))(she|they)(?:(?= )|$)/gm, "he");
        text = text.replace(/(?:^|(?<= ))(her|their)(?:(?= )|$)/gm, "his");
        text = text.replace(/(?:^|(?<= ))(She|They)(?:(?= )|$)/gm, "He");
        text = text.replace(/(?:^|(?<= ))(Her|Their)(?:(?= )|$)/gm, "His");
      
        updateReact(curT, text);
    }

    function swapGenderShe(){
        let text = curT.value;

        text = text.replace(/(?:^|(?<= ))(he|they)(?:(?= )|$)/gm, "she");
        text = text.replace(/(?:^|(?<= ))(his|their)(?:(?= )|$)/gm, "her");
        text = text.replace(/(?:^|(?<= ))(He|They)(?:(?= )|$)/gm, "She");
        text = text.replace(/(?:^|(?<= ))(His|Their)(?:(?= )|$)/gm, "Her");

        updateReact(curT, text);
    }

    function swapGenderThey(){
        let text = curT.value;

        text = text.replace(/(?:^|(?<= ))(he|she)(?:(?= )|$)/gm, "they");
        text = text.replace(/(?:^|(?<= ))(his|her)(?:(?= )|$)/gm, "their");
        text = text.replace(/(?:^|(?<= ))(He|She)(?:(?= )|$)/gm, "They");
        text = text.replace(/(?:^|(?<= ))(His|Her)(?:(?= )|$)/gm, "Their");

        updateReact(curT, text);
    }

})();

function updateReact(someInput, text){
    let input = someInput;
    let lastValue = input.value;
    input.value = text;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}