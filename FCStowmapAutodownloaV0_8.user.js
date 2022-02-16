    // ==UserScript==
    // @name         FC StowMap V0.8 Beta Test
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
    // Floor and Bin Type for URL param processing
    var paramFloorKey = "Floor";
    var paramBinTypeKey = "Bin";
    var paramUsageKey = "Usage";
    var paramLockKey = "Lock";
    var paramHRVKey = "HRV";

    var valueFloor = ["1"];
    var valueBinType = [""];
    var valueUsage = ["PRIME", "PRIME_PUTBACK"];
    var valueLock = "NO";
    var valueHRV = "NO";

    var usageSelection = ["PRIME", "PRIME_PUTBACK"];

    var doDownload = true;
    var useParamFunc = true;
    var doDebug = true;
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
    var reloadTimeSec = 60;
    var selectionTimeSec = 2;
    var submitTimeSec = 5;
    var downloadButtonClickTimeSec = 10;
    var runningTimer = 0;
    var isRunning = true;

    var usageId = "usage";
    var binTypeId = "types";
    var allFloorId = "fcmap_floors_all";

    // Defaults
    var binTypes = ["RAINBOW", "HALF-VERTICAL", "LIBRARY-DEEP" ];
    var usageSelection = ["PRIME", "PRIME_PUTBACK"];

    var lockKeys = {"YES":"lockedYes", "NO":"lockedNo", "BOTH":"lockedIgnore" };
    var HRVKeys = {"YES":"HeavyAsinYes", "NO":"HeavyAsinNo", "BOTH":"HeavyAsinIgnore"};

    // ------- Main Function

    (function() {
        'use strict';
        if(useParamFunc){
            runningTimer = 0;
            if(doDebug) console.log("ParamMode");
            setTimeout(function(){ paramSequence(); }, (selectionTimeSec)*1000);

            setTimeout(function(){
                location.reload(); 
                runningTimer = 0;
                }, (reloadTimeSec)*1000);
        }

    })();

    //---- Functions

    function paramSequence(){
        // read in download parameters 
        readParams(); 

        // make selections
        runningTimer = runningTimer + selectionTimeSec;
        // Set our selection critria
        setTimeout(function() {
            //Code to run After timeout elapses
            paramActivateParams();
            }, runningTimer*1000);


        // Hit Submit Button
        // click submit giveing time for selection
        runningTimer = runningTimer + submitTimeSec;
        setTimeout(function() {
            //Code to run After timeout elapses
            sumitButtonClick();
        }, runningTimer*1000);

    

        // Download 
        // click download after givign time for submit to run
        runningTimer = runningTimer + downloadButtonClickTimeSec;
        setTimeout(function() {
        //Code to run After timeout elapses
        if(doDownload) downloadForParams();
        }, runningTimer * 1000);
        // Refresh
    }

    function downloadForParams(){
        downloadMap(creatMapName());
    }

    // currently only 1 floor and bin type
    function creatMapName(){
    // if(doDebug) console.log("Pnt Floor: " + valueFloor[0].toString());
        //if(doDebug) console.log("Pnt Bin: " + valueBinType[0].toString());

        return  (""+valueFloor[0].toString() + separtationKey + valueBinType[0].toString());
    }

    function paramActivateParams(){

        // for all floors loop 
        clearSelectedObject(allFloorId); // clear all
        valueFloor.forEach(element => { // check all in params
            if(doDebug) console.log("Floor: " + element);
            checkSelectedObjectByClass(element, 0);
        });

    // Unlocked Only selection
    // Id = lockedNo  id ignored as lockedIgnore
    targetNode =  document.getElementById(valueLock);
    if (targetNode) {
        triggerMouseEvent (targetNode, "click");
    }
    else{
        console.log ("*** Target node not found!");
    }
    // Non-HRV selection
    // id = HeavyAsinNo
    targetNode =  document.getElementById(valueHRV);
    if (targetNode) {
        triggerMouseEvent (targetNode, "click");
    }
    else{
        console.log ("*** Target node not found!");
    }
    // Prime and Prime PRIME_PUTBACK usage
    clearSelectedObject(usageId);

        // Set your selections
        for(let i = 0; i < valueUsage.length; i++ ){
            selectUsage(valueUsage[i]);
        }

    // Bin type Start with Rainbow
    clearSelectedObject(binTypeId);
    valueBinType.forEach(element => { // check all in params
            if(doDebug) console.log("Bin: " + element);
            checkSelectedObjectById(element);
        });      

    // Bin Gorup by Ailse selection

    $(".group-bins").val ("Aisle");
    }

    function readParams(){
        var url = new URL(window.location.href);
        valueBinType = url.searchParams.getAll(paramBinTypeKey);
        valueFloor = url.searchParams.getAll(paramFloorKey);

        // if(doDebug) console.log("Bin: " + valueBinType[0].toString());
        var tArray = url.searchParams.getAll(paramBinTypeKey);
        if(tArray.length > 0){
            valueBinType = tArray;
            if(doDebug) console.log("Bin: " + valueBinType[0].toString());
        }

        tArray = url.searchParams.getAll(paramFloorKey);
        if(tArray.length > 0){
            valueFloor = tArray
            if(doDebug) console.log("Floor: " + valueFloor[0].toString());
        }

        tArray = url.searchParams.getAll(paramUsageKey);
        if(tArray.length > 0){
            valueUsage = tArray
            if(doDebug) console.log("Usage: " + valueUsage[0].toString());
        }

        tArray = url.searchParams.getAll(paramLockKey);
        if(tArray.length > 0){
            valueLock = tArray[0];
            if(doDebug) console.log("Lock: " + valueLock.toString());
        }

        if(valueLock in lockKeys){
            valueLock = lockKeys[valueLock];
        }else{
            valueLock = lockKeys["NO"];
        }
        if(doDebug) console.log("LockConverted: " + valueLock.toString());

        tArray = url.searchParams.getAll(paramHRVKey);
        if(tArray.length > 0){
            valueHRV = tArray[0];
            if(doDebug) console.log("HRV: " + valueHRV.toString());
        }

        if(valueHRV in HRVKeys){
            valueHRV = HRVKeys[valueHRV];
        }else{
            valueHRV = HRVKeys["NO"];
        }
        if(doDebug) console.log("HRVConverted: " + valueHRV.toString());

        doDownload = true;
    }


    // clicks the subbmit button to move to page with download button
    function sumitButtonClick(){
        document.getElementsByClassName("btn")[0].click();
    }


    function selectBin ( binName ){
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

    function clearSelectedObjectByNode(targetNode){
        
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

    function checkSelectedObjectById(objectID){
        var targetNode =  document.getElementById(objectID);
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
    }

    function checkSelectedObjectByNode(targetNode){
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
    }

    function checkSelectedObjectByClass(tName, tIndex){
        var targetNode =  document.getElementsByClassName(tName)[tIndex];
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



