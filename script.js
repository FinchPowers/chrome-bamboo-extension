var baseUrl = "https://datacratic.atlassian.net/builds"
var latestFavResults = baseUrl + "/rest/api/latest/result.json?favourite";

function update(){
    $.getJSON(latestFavResults, function(data){
        var ok = true;
        $.each(data["results"]["result"], function(index, plan){
            if(plan["buildState"] == "Failed"){
                ok = false;
                return false;
            }
        });
        if(ok){
            chrome.browserAction.setBadgeText({"text" : "Ok"});
            chrome.browserAction.setBadgeBackgroundColor({"color" : "#00FF00"});
        }else{
            chrome.browserAction.getBadgeText({}, function(result){
                if(result != "Error"){
                    options = {
                        "message" : "A build has failed",
                        "type"    : "basic",
                        "title"   : "Failure",
                        "iconUrl" : "images/BAMBOO.png"
                    };
                    chrome.notifications.create("", options, function(id){});
                }
            });
            chrome.browserAction.setBadgeText({"text" : "Error"});
            chrome.browserAction.setBadgeBackgroundColor({"color" : "#FF0000"});
        }
    }).fail(function(jqxhr, textStatus, error){
        console.log("JQ:" + jqxhr);
        console.log("Text: " + textStatus);
        console.log("Err: " + error);
        chrome.browserAction.setBadgeText({"text" : "!"});
        chrome.browserAction.setBadgeBackgroundColor({"color" : "#999999"});
    });
    setTimeout(update, 1000 * 60 * 3); //every 3 minutes
}

$(function(){
    update();
    chrome.browserAction.onClicked.addListener(function(tabs){
        chrome.tabs.create({'url': baseUrl}, function(tab) {});
    });
})


//TODO
//Can't connect - grey
//All good - green
//All errors rebuilding - yellow
//1 error not rebuilding - red
