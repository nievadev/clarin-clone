var Direct=function(e){var t={loginWall:!1,adblock:!1,privateMode:!1,refresh:!1,timestamp:!1,pase:!1},n={c1:"2"},s={},a={},r=function(t,i){e.extend(this.modsEnabled,i),e.extend(this.params,n,t);var s=this,a=this.modsEnabled;a.timestamp&&e.extend(this.params,this.getTimestamp()),a.refresh&&e.extend(this.params,this.getRefresh()),a.adblock&&e.extend(this.params,this.getAdblock()),a.loginWall&&e.extend(this.params,this.getLWParams()),a.pase&&e.extend(this.params,this.getPase()),a.privateMode&&!this.callbacksFinished.hasOwnProperty("privateMode")&&(this.callbacksFinished.privateMode=!1,this.detectPrivateMode(function(t){window.isPrivateMode=!!t,e.extend(s.params,window.isPrivateMode?{bprivate:1}:{bprivate:0}),s.callbacksFinished.privateMode=!0})),a.fingerprint&&!this.callbacksFinished.hasOwnProperty("fingerprint")&&(this.callbacksFinished.fingerprint=!1,this.getFingerprint(function(t){e.extend(s.params,{c12:t}),s.callbacksFinished.fingerprint=!0}))},c=function(e,t,i){try{var n=this;if(e=e||{},t=t||{},i=i||!1,i&&(this.params={}),this.construct(e,t),!h(this.callbacksFinished))throw"Callbacks in execution";if(null==document.getElementById("directDeferScript"))window._comscore=window._comscore||[],window._comscore.push(this.params),o();else{if("undefined"==typeof COMSCORE)throw"COMSCORE undefined";COMSCORE.beacon(this.params)}d(n)}catch(s){setTimeout(function(){n.hit(e,t)},100)}},o=function(){var e=document.createElement("script"),t=document.getElementsByTagName("script")[0];e.async=!0,e.id="directDeferScript",e.src=("https:"==document.location.protocol?"https://sb":"http://b")+".scorecardresearch.com/beacon.js",t.parentNode.insertBefore(e,t)},d=function(e){e.callbacksFinished={}},h=function(e){var t=!0;for(i=0,len=Object.keys(e).length;i<len&&t;i++){var n=Object.keys(e)[i];e[n]||(t=!1)}return t},l=function(){return{}},p=function(){return"undefined"==typeof window.canRunAds?{adblock:"si"}:{adblock:"no"}},m=function(e){e.call(this,!1)},u=function(e){e.call(this)},f=function(){return{refresh:""}},b=function(){return{timestamp:""}},g=function(){return{}};return{modsEnabled:t,params:s,callbacksFinished:a,construct:r,hit:c,getAdblock:p,getLWParams:l,detectPrivateMode:m,getFingerprint:u,getRefresh:f,getTimestamp:b,getPase:g}}(jQuery);