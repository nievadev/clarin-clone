Direct.detectPrivateMode=function(e){detectPrivateMode(e)},Direct.getLWParams=getPaseDaxParams,Direct.getTimestamp=function(){var e=(new Date).getTime(),t=(new Date).getTimezoneOffset();return{timestamp:e+"|GMT"+-1*t/60}};var directDataParams=JSON.parse(decodeURIComponent(document.getElementById("directAppScript").getAttribute("data-params")));Direct.hit(directDataParams,{});