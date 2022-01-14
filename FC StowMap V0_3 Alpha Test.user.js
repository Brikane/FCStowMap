// ==UserScript==
// @name         FC StowMap V0.3 Alpha Test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fc Stowmap AutoDownload for Excel display link
// @author       Brikane@amazon.com
// @match        https://stowmap-na.amazon.com/stowmap/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant       GM_addStyle
// ==/UserScript==

var reloadTimeSec = 60;
var selectionTimeSec = 2;
var submitTimeSec = 5;
var downloadButtonClickTimeSec = 10;

var usageId = "usage";
var binTypeId = "types";

var binTypes = ["RAINBOW", "HALF-VERTICAL", "LIBRARY-DEEP" ];
var usageSelection = ["PRIME", "PRIME_PUTBACK"];


(function() {
    'use strict';
    downloadSequence();
    setTimeout(function(){ location.reload(); }, (reloadTimeSec)*1000);

})();

// clicks the download button
function downloadCSVButtonClick(){
    // Download first CSV
    document.getElementsByClassName("btn download")[0].click();

     // Interate through all bin types
     for (let i = 1; i < binTypes.length; i++) {
     setTimeout(function() {
        //Code to run After timeout elapses
        selectBin(binTypes[i]);
        sumitButtonClick();
        }, selectionTimeSec*1000);

        setTimeout(function() {
            //Code to run After timeout elapses
            document.getElementsByClassName("btn download")[0].click();
        }, downloadButtonClickTimeSec*1000);
    }

    exportSequence();
}

// clicks the subbmit button to move to page with download button
function sumitButtonClick(){
    document.getElementsByClassName("btn")[0].click();
}

// Checks the required boxs
function checkTheBoxsYea(){
    document.getElementById("types")
   //Floor 1 selection
    var targetNode =  document.getElementsByClassName("1")[0];
    if (targetNode) {
        if(targetNode.checked) {
            triggerMouseEvent (targetNode, "click");
            triggerMouseEvent (targetNode, "click");
        }else{
            triggerMouseEvent (targetNode, "click");
        }
    }
    else{
        console.log ("*** Target node not found!");
    }

    // Unlocked Only selection
    // Id = lockedNo  id ignored as lockedIgnore
    targetNode =  document.getElementById("lockedNo");
    if (targetNode) {
        triggerMouseEvent (targetNode, "click");
    }
    else{
        console.log ("*** Target node not found!");
    }
    // Non-HRV selection
    // id = HeavyAsinNo
    targetNode =  document.getElementById("HeavyAsinNo");
    if (targetNode) {
        triggerMouseEvent (targetNode, "click");
    }
    else{
        console.log ("*** Target node not found!");
    }
    // Prime and Prime PRIME_PUTBACK usage
    clearSelectedObject(usageId);

        // Set your selections
        for(let i = 0; i < usageSelection.length; i++ ){
            selectUsage(usageSelection[i]);
        }



    // Bin type Start with Rainbow

    selectBin(binTypes[0]);
    // Bin Gorup by Ailse selection

    $(".group-bins").val ("Aisle");


}

function selectBin ( binName ){
    // Clear all selections
    clearSelectedObject(binTypeId);
        // Select bin
        var targetNode =  document.getElementById(binName);
        if (targetNode) {
            triggerMouseEvent (targetNode, "click");
        }
        else{
            console.log ("*** Target node not found!");
        }
}

function selectUsage ( usage ){
    var targetNode =  document.getElementById(usage);
    if (targetNode) {
        triggerMouseEvent (targetNode, "click");
    }
    else{
        console.log ("*** Target node not found!");
    }
}

function clearSelectedObject(objectID){
    var targetNode =  document.getElementById(objectID);
    if (targetNode) {
        if(targetNode.checked) {
            triggerMouseEvent (targetNode, "click");
        }else{
            triggerMouseEvent (targetNode, "click");
            triggerMouseEvent (targetNode, "click");
        }
    }
    else{
        console.log ("*** Target node not found!");
    }
}


// Our secuence of events
function downloadSequence(){
    // Set our selection critria
    setTimeout(function() {
        //Code to run After timeout elapses
        checkTheBoxsYea();
        }, selectionTimeSec*1000);


    // click submit giveing time for selection
    setTimeout(function() {
        //Code to run After timeout elapses
        sumitButtonClick();
        }, submitTimeSec*1000);

    // click download after givign time for submit to run
    setTimeout(function() {
        //Code to run After timeout elapses
            downloadCSVButtonClick();
        }, downloadButtonClickTimeSec * 1000);

}



function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}


function exportSequence(){

}



