// ==UserScript==
// @name         FC StowMap V0_7 Beta Test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fc Stowmap AutoDownload for Excel display link
// @author       Brikane@amazon.com
// @match        https://stowmap-na.amazon.com/stowmap/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       GM_log
// ==/UserScript==

// --- Classes
// WIP for the data profiles
class dataProfile{
    constructor(){
        this.floorIds = ["1"];
        this.usageSelIds = ["PRIME", "PRIME_PUTBACK"];
        this.binTypeSelIds = ["RAINBOW", "HALF-VERTICAL", "LIBRARY-DEEP" ];

    }

}

// ---- Script Injection

var getCSVDataFunctionKey = 'convertToCSV();';

// Download and naming Conventions

var baseFileName = "FCStowMapWebsite";
var fileExtention = ".csv";
var separtationKey = "_";

/*
* Naming Conventions
*   Basename
*   FloorNum
*   BinType
*/

// -----  Global Vars
var reloadTimeSec = 300;
var selectionTimeSec = 2;
var submitTimeSec = 5;
var downloadButtonClickTimeSec = 10;
var runningTimer = 0;
var isRunning = true;

var usageId = "usage";
var binTypeId = "types";
var allFloorId = "fcmap_floors_all";

var binTypeArr = [["RAINBOW", "HALF-VERTICAL", "LIBRARY-DEEP" ],
                  ["DRAWER", "HALF-VERTICAL", "LIBRARY-DEEP" ],
                  ["DRAWER", "HALF-VERTICAL", "LIBRARY-DEEP" ] ];
// Old Hardcoding
var binTypes = ["RAINBOW", "HALF-VERTICAL", "LIBRARY-DEEP" ];
var binTypes2 = ["DRAWER", "HALF-VERTICAL", "LIBRARY-DEEP" ];
var binTypes3 = ["DRAWER", "HALF-VERTICAL", "LIBRARY-DEEP" ];
var usageSelection = ["PRIME", "PRIME_PUTBACK"];

// New Profiles
var profileFloor1 = new dataProfile();
profileFloor1.floorIds = ["1"];
profileFloor1.usageSelIds = usageSelection;
profileFloor1.binTypeSelIds = binTypes;

var profileFloor2 = new dataProfile();
profileFloor2.floorIds = ["2"];
profileFloor2.usageSelIds = usageSelection;
profileFloor2.binTypeSelIds = binTypes2;

var profileFloor3 = new dataProfile();
profileFloor3.floorIds = ["3"];
profileFloor3.usageSelIds = usageSelection;
profileFloor3.binTypeSelIds = binTypes3;

var profiles = [profileFloor1, profileFloor2, profileFloor3];



// -------- Settings
/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
/*
var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Ignore me! (for now) </button>'
+ '<button id="RunButton" type="button" > Start </button>'
                ;
zNode.setAttribute ('id', 'myContainer');
zNode.style.top = 50+'px';
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

document.getElementById ("RunButton").addEventListener (
    "click", downloadCSV, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.

    var zNode = document.createElement ('p');
    zNode.innerHTML = 'The button was clicked.';
    document.getElementById ("myContainer").appendChild (zNode);


    // id for download current tab button "formcsvCurrent Pickup"
   // document.getElementById("formcsvCurrent Pickup").submit();


}
*/
// ------- Main Function

(function() {
    'use strict';

    if(isRunning) {

        setTimeout(function(){ downloadSequence(); }, (selectionTimeSec)*1000);


    }
    setTimeout(function(){
         location.reload();
         runningTimer = 0;
        }, (reloadTimeSec)*1000);

})();


//---- Functions

// clicks the download button
// WIP hardcoded for each floor will use stadardized profile
function downloadCSVButtonClickFloor1(){
    // Download first CSV
    //document.getElementsByClassName("btn download")[0].click();
    var mapNameAdd = "1" + separtationKey + binTypes[0];
    downloadMap(mapNameAdd);
    var timer = 0;
     // Interate through all bin types
    for (let i = 1; i < binTypes.length; i++) {
        timer = timer + selectionTimeSec;
        setTimeout(function() {
            //Code to run After timeout elapses
            selectBin(binTypes[i]);
            sumitButtonClick();
        }, timer*1000);
        timer = timer + downloadButtonClickTimeSec;
        setTimeout(function() {
            //Code to run After timeout elapses
            mapNameAdd = "1" + separtationKey + binTypes[i];
            downloadMap(mapNameAdd);
        }, timer*1000);
    }

    exportSequence();
}

function downloadCSVButtonClickFloor2(){
    // Download first CSV
    // document.getElementsByClassName("btn download")[0].click();
    var mapNameAdd = "2" + separtationKey + binTypes2[0];
    downloadMap(mapNameAdd);
    var timer = 0;
     // Interate through all bin types
     for (let i = 1; i < binTypes2.length; i++) {
        timer = timer + selectionTimeSec;
     setTimeout(function() {
        //Code to run After timeout elapses
        selectBin(binTypes2[i]);
        sumitButtonClick();
        }, timer*1000);
        timer = timer + downloadButtonClickTimeSec;
        setTimeout(function() {
            //Code to run After timeout elapses
            // document.getElementsByClassName("btn download")[0].click();
            mapNameAdd = "2" + separtationKey + binTypes2[i];
            downloadMap(mapNameAdd);
        }, timer*1000);
    }

    exportSequence();
}

function downloadCSVButtonClickFloor3(){
    // Download first CSV
    // document.getElementsByClassName("btn download")[0].click();
    var mapNameAdd = "3" + separtationKey + binTypes3[0];
    downloadMap(mapNameAdd);

    var timer = 0;
     // Interate through all bin types
     for (let i = 1; i < binTypes3.length; i++) {
        timer = timer + selectionTimeSec;
     setTimeout(function() {
        //Code to run After timeout elapses
        selectBin(binTypes3[i]);
        sumitButtonClick();
        }, timer*1000);
        timer = timer + downloadButtonClickTimeSec;
        setTimeout(function() {
            //Code to run After timeout elapses
            // document.getElementsByClassName("btn download")[0].click();
            mapNameAdd = "3" + separtationKey + binTypes3[i];
            downloadMap(mapNameAdd);
        }, timer*1000);
    }

    exportSequence();
}

// clicks the subbmit button to move to page with download button
function sumitButtonClick(){
    document.getElementsByClassName("btn")[0].click();
}

// Checks the required boxs for Floor 1
function checkTheBoxsYeaFloor1(){
    // document.getElementById("types")
   //Floor 1 selection
    clearSelectedObject(allFloorId);

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
// Floor 2
function checkTheBoxsYeaFloor2(){

   //Floor 2 selection
   clearSelectedObject(allFloorId);

    var targetNode =  document.getElementsByClassName("2")[0];
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

    selectBin(binTypes2[0]);
    // Bin Gorup by Ailse selection

    $(".group-bins").val ("Aisle");


}

function checkTheBoxsYeaFloor3(){

    //Floor 3 selection
    clearSelectedObject(allFloorId);

     var targetNode =  document.getElementsByClassName("3")[0];
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

     selectBin(binTypes3[0]);
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

function moveBackToSelection(){

}


// Our order of events
// WIP currently hardcoded while scaling reqs are beign evaluated
function downloadSequence(){
    //--- Floor 1
    runningTimer = runningTimer + selectionTimeSec;
    // Set our selection critria
    setTimeout(function() {
        //Code to run After timeout elapses
          checkTheBoxsYeaFloor1();
        }, runningTimer*1000);


    // click submit giveing time for selection
    runningTimer = runningTimer + submitTimeSec;
    setTimeout(function() {
        //Code to run After timeout elapses
        sumitButtonClick();
        }, runningTimer*1000);

    // click download after givign time for submit to run
    runningTimer = runningTimer + downloadButtonClickTimeSec;
    setTimeout(function() {
        //Code to run After timeout elapses
            downloadCSVButtonClickFloor1();
        }, runningTimer * 1000);

        // Allow time for all downloads
        runningTimer = runningTimer + (selectionTimeSec+downloadButtonClickTimeSec)*binTypes.length;
    /*
      ------- Floor 2
      -- Move back to slection area (*is it still there virtually)
      -- Unselecr floor 1 and then select floor 2
      --
    */
   // Set our selection critria

   runningTimer = runningTimer + selectionTimeSec;
   // Set our selection critria
   setTimeout(function() {
       //Code to run After timeout elapses
         checkTheBoxsYeaFloor2();
       }, runningTimer*1000);


   // click submit giveing time for selection
   runningTimer = runningTimer + submitTimeSec;
   setTimeout(function() {
       //Code to run After timeout elapses
       sumitButtonClick();
       }, runningTimer*1000);

   // click download after givign time for submit to run
   runningTimer = runningTimer + downloadButtonClickTimeSec;
   setTimeout(function() {
       //Code to run After timeout elapses
           downloadCSVButtonClickFloor2();
       }, runningTimer * 1000);

       // Allow time for all downloads
       runningTimer = runningTimer + (selectionTimeSec+downloadButtonClickTimeSec)*binTypes2.length;

       // --- Floor 3

    // Set our selection critria
    runningTimer = runningTimer + selectionTimeSec;
    // Set our selection critria
    setTimeout(function() {
        //Code to run After timeout elapses
          checkTheBoxsYeaFloor3();
        }, runningTimer*1000);


    // click submit giveing time for selection
    runningTimer = runningTimer + submitTimeSec;
    setTimeout(function() {
        //Code to run After timeout elapses
        sumitButtonClick();
        }, runningTimer*1000);

    // click download after givign time for submit to run
    runningTimer = runningTimer + downloadButtonClickTimeSec;
    setTimeout(function() {
        //Code to run After timeout elapses
            downloadCSVButtonClickFloor3();
        }, runningTimer * 1000);

}



function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}


function downloadMap(fileNameAddOn){
        var csvDataInString = window.eval(getCSVDataFunctionKey);

        var fileName = baseFileName + separtationKey + fileNameAddOn + fileExtention;
        var blob = new Blob([csvDataInString], { type: 'text/csv;charset=utf-8;'});
        var downloadLink = document.createElement("a");
        var url = URL.createObjectURL(blob);
        downloadLink.setAttribute("href", url);
        downloadLink.setAttribute("download", fileName);
        downloadLink.style.visibility = 'hidden';
        document.body.appendChild(downloadLink);
        downloadLink.click();
}

function exportSequence(){

}

// ----- CSS Style
//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        right:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }

` );



