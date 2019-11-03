"use strict";var CCIO={};CCIO.Util={};CCIO.Util.Modal={};CCIO.Util.Modal.open=function(url,options){var defaultOptions={maxHeight:750,close:false};options=$.extend(defaultOptions,options);var height=window.innerHeight>0?window.innerHeight:screen.height;height=height-20>options.maxHeight?options.maxHeight:height-20;var iframeMarkup='<div class="mfp-iframe-scaler">';if(options.close){iframeMarkup+='<div class="mfp-close">cerrar</div>'}iframeMarkup+='<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>';iframeMarkup+="</div>";$.magnificPopup.open({enableEscapeKey:false,closeOnBgClick:false,fixedContentPos:false,mainClass:"modal-pase",alignTop:true,items:{src:url},type:"iframe",iframe:{markup:iframeMarkup},callbacks:lockModalCallbacks(height)});$(document).trigger("wa.modal.open")};CCIO.Util.Modal.close=function(eventTrigger){$.magnificPopup.close();if(eventTrigger){$(document).trigger("wa.modal.close")}};CCIO.Util.ScriptLoader={};CCIO.Util.ScriptLoader.load=function(src,content){var script=document.createElement("script");if(content){var json=document.createTextNode(content);script.appendChild(json)}script.src=src;document.head.appendChild(script)};CCIO.Weizenbock={};CCIO.Weizenbock.Auth=function(options){var self=this;this.hasErrorConfig=false;var defaultOptions={urlIframeLogin:"",urlIframeProfile:"",onConnect:function(){},onLogin:function(){},onLogout:function(){},afterOnConnect:function(){},afterOnLogin:function(){},afterOnLogout:function(){}};if(!_wa_conf){console.error("WeizenbockAuth Error: Configuration is not loaded");this.hasErrorConfig=true;return}defaultOptions=$.extend(defaultOptions,_wa_conf);options=$.extend(defaultOptions,options);this.options=options;this.datasetUserProfile=CCIO.Weizenbock.Dataset.getInstance("userProfile",{ttl:options.datasetsTTL.userProfile});this.flow=new PASEGigyaFlow(options,self);this.getUser(function(error,user){$(document).ready(function(){setTimeout(function(){$(document).trigger("wa.ready")},0);options.onConnect(user);options.afterOnConnect(user,self.options)})},true)};CCIO.Weizenbock.Auth.KeyUrlSesionValid="wa_url_sesion_valid";CCIO.Weizenbock.Auth.prototype.authenticateUser=function(){if(this.hasErrorConfig){return}this.flow.authenticateUser()};CCIO.Weizenbock.Auth.prototype.logout=function(){if(this.hasErrorConfig){return}this.flow.logout()};CCIO.Weizenbock.Auth.prototype.getUserSync=function(){if(this.hasErrorConfig){return}return this.datasetUserProfile.getAll({forceNotExpire:true})};CCIO.Weizenbock.Auth.prototype.getUser=function(cb,forceEvents){if(typeof forceEvents=="undefined"){forceEvents=false}var self=this;if(this.hasErrorConfig){return}var user=self.datasetUserProfile.getAll();if(user){var sid=$.cookie(self.options.cookiesPrefix+self.options.cookieSID.name);if(!sid){$.cookie(self.options.cookiesPrefix+self.options.cookieSID.name,user.sessionId,{path:self.options.cookieSID.path,domain:self.options.cookieSID.domain,expires:getExpireDate()})}self.gigyaCheckSession();self.checkSessionStatus(user);return cb(null,user)}var sid=$.cookie(self.options.cookiesPrefix+self.options.cookieSID.name);if(!sid){if(forceEvents){self.getUserGigyaFallback(function(){})}return cb(null)}self.getUserServer(sid,function(err,user){if(user){self.gigyaCheckSession();self.checkSessionStatus(user)}return cb(null,user)},forceEvents)};CCIO.Weizenbock.Auth.prototype.checkSessionStatus=function(user){var self=this;if(user.sessionStatus=="invalidated"){self.flow.logout()}if(user.sessionStatus=="denied"&&window.location.href!=_wa_conf.devices.wallHost+_wa_conf.devices.wallPath){window.localStorage.setItem(CCIO.Weizenbock.Auth.KeyUrlSesionValid,window.location.href);location.href=_wa_conf.devices.wallHost+_wa_conf.devices.wallPath}};CCIO.Weizenbock.Auth.prototype.getUpdateUserServer=function(cb){var self=this;var sid=$.cookie(self.options.cookiesPrefix+self.options.cookieSID.name);$.ajax({url:self.options.api.host+"/api/mobile/v2/sessions/wa/refresh/"+sid}).done(function(res){var user=res.data;user.id=res.uId;user.sessionId=res.id;user.sessionStatus=res.status;self.datasetUserProfile.set(user);$(document).trigger("wa.user.update",user);cb(null,user)}).fail(function(){cb(1,{})})};CCIO.Weizenbock.Auth.prototype.getUserServer=function(sid,cb,forceEvents){var self=this;$.get(self.options.api.host+"/api/mobile/v2/sessions/"+sid,function(res){var user=res.data;user.id=res.uId;user.sessionId=res.id;user.sessionStatus=res.status;self.datasetUserProfile.set(user);if(forceEvents&&!self.datasetUserProfile.getAll()){$(document).trigger("wa.login",user);self.options.onLogin(user)}cb(null,user)}).fail(function(){return self.getUserGigyaFallback(cb)})};CCIO.Weizenbock.Auth.prototype.gigyaCheckSession=function(cb){var self=this;this.flow.isGigyaLogout(function(isLogout){if(isLogout&&self.datasetUserProfile.getAll()){self.WAonLogout()}})};CCIO.Weizenbock.Auth.prototype.clearUserDataset=function(){this.datasetUserProfile.delete()};CCIO.Weizenbock.Auth.prototype.getUserGigyaFallback=function(cb){var self=this;this.flow.getUser(function(error,response){if(error||!response){if(self.datasetUserProfile.getAll()){self.datasetUserProfile.delete();self.options.onLogout();self.options.afterOnLogout();$(document).trigger("wa.logout")}return cb("session not found")}self.WAonLogin(response)})};CCIO.Weizenbock.Auth.prototype.openProfile=function(){if(this.hasErrorConfig){return}this.flow.openProfile()};function getExpireDate(){var now=new Date;return new Date(now.getFullYear()+1,now.getMonth(),now.getDate())}CCIO.Weizenbock.Auth.prototype.WAonLogin=function(user){var self=this;user.UA=navigator.userAgent;$.post(self.options.api.host+"/api/mobile/v2/sessions/wa/create",{u:JSON.stringify(user)},function(res){$.cookie(self.options.cookiesPrefix+self.options.cookieSID.name,res.id,{path:self.options.cookieSID.path,domain:self.options.cookieSID.domain,expires:getExpireDate()});var user=res.data;user.id=res.uId;user.sessionId=res.id;user.sessionStatus=res.status;self.datasetUserProfile.set(user);$(document).trigger("wa.login",user);self.options.onLogin(user);self.options.afterOnLogin(user,self.options);self.checkSessionStatus(user)}).fail(function(){})};CCIO.Weizenbock.Auth.prototype.WAonLogout=function(){var self=this;var sid=$.cookie(self.options.cookiesPrefix+self.options.cookieSID.name);$.post(self.options.api.host+"/api/mobile/v2/sessions/wa/delete/"+sid,function(res){$.removeCookie(self.options.cookiesPrefix+self.options.cookieSID.name,{path:self.options.cookieSID.path,domain:self.options.cookieSID.domain});self.datasetUserProfile.delete();$(document).trigger("wa.logout");self.options.onLogout();self.options.afterOnLogout()}).fail(function(){$.removeCookie(self.options.cookiesPrefix+self.options.cookieSID.name,{path:self.options.cookieSID.path,domain:self.options.cookieSID.domain});self.datasetUserProfile.delete();$(document).trigger("wa.logout");self.options.onLogout();self.options.afterOnLogout()})};var PASEGigyaFlow=function(options,parentInstance){this.options=options;this.parentInstance=parentInstance;this.attempts=0;this.attemptsEvents=0;this.maxAttempts=20;var defaultOptions={siteName:"",enabledProviders:"facebook,twitter,yahoo,messenger,linkedin,myspace,google",connectWithoutLoginBehavior:"alwaysLogin"};var paramsGigya=$.extend(defaultOptions,options.Gigya);if(typeof gigya=="undefined"){this.initGigya(options.Gigya.apikey,paramsGigya)}this.setListeners()};PASEGigyaFlow.prototype.initGigya=function(apikey,options){CCIO.Util.ScriptLoader.load("https://cdns.gigya.com/JS/socialize.js?apikey="+apikey+"&lang=es-ar",JSON.stringify(options));this.setEventHandlers()};PASEGigyaFlow.prototype.setEventHandlers=function(){var self=this;try{gigya.socialize.addEventHandlers({onLogin:function(){},onLogout:function(){self.parentInstance.WAonLogout()}});$(document).trigger("wa.gigya.ready")}catch(e){if(self.attemptsEvents>self.maxAttempts){return null}setTimeout(function(){self.attemptsEvents++;self.setEventHandlers()},100)}};PASEGigyaFlow.prototype.setListeners=function(){var self=this;function getEventOrigin(){var url=self.options.urlIframeLogin;if(!url){return""}var x=url.split("/");var y=x[0]+"//"+x[2];return y}function listener(event){if(event.origin!=getEventOrigin()){return}try{if(typeof event.data!="string"){return}var data=JSON.parse(event.data);if(typeof data.flujoE2E!="undefined"&&(data.flujoE2E=="registracionLocal"||data.flujoE2E=="registracionSocial")){var date=new Date;$.cookie("registracion",1,{path:self.parentInstance.options.cookieSID.path,domain:self.parentInstance.options.cookieSID.domain,expires:date.setTime(date.getTime()+1*60*1e3)});CCIO.Util.Modal.close(false)}if(typeof data.autenticar=="undefined"&&data.e2eEventType!="socialLoginAndRedirect"){return}if(data.autenticar){self.getUser(function(err,response){self.parentInstance.WAonLogin(response);CCIO.Util.Modal.close(false)})}else if(data.e2eEventType=="socialLoginAndRedirect"){if(typeof gigya!="undefined"){$.cookie("pE2E_checkLoggedIn","1",{path:self.parentInstance.options.cookieSID.path,domain:self.parentInstance.options.cookieSID.domain});gigya.socialize.login({pendingRegistration:true,authFlow:"redirect",provider:data.provider,redirectURL:data.redirectURL})}}else{CCIO.Util.Modal.close(true)}}catch(e){return}}if(window.addEventListener){addEventListener("message",listener,false)}else{attachEvent("onmessage",listener)}};PASEGigyaFlow.prototype.isGigyaLogout=function(cb){var self=this;try{gigya.socialize.getUserInfo({callback:function(response){if(response&&response.user&&typeof response.user.UID!="undefined"&&response.user.UID.length==0){return cb(true)}return cb(false)}})}catch(e){if(self.attempts>self.maxAttempts){return cb(false)}setTimeout(function(){self.attempts++;self.isGigyaLogout(cb)},150)}};PASEGigyaFlow.prototype.getUser=function(cb){var self=this;try{gigya.socialize.getUserInfo({callback:function(response){if(!response||!response.user||!response.user.UID||!response.user.UID.length){return cb(null,null)}return cb(null,response)}})}catch(e){if(self.attempts>self.maxAttempts){return cb(null,null)}setTimeout(function(){self.attempts++;self.getUser(cb)},100)}};PASEGigyaFlow.prototype.openProfile=function(cb){var self=this;CCIO.Util.Modal.open(self.options.urlIframeProfile,{maxHeight:900,close:true})};PASEGigyaFlow.prototype.logout=function(cb){this.gigyaReintent(function(){gigya.socialize.logout()})};PASEGigyaFlow.prototype.gigyaReintent=function(cb){var self=this;try{gigya;return cb(true)}catch(e){if(self.attempts>self.maxAttempts){return cb(false)}console.log("reintento ("+self.attempts+") ...");setTimeout(function(){self.attempts++;self.gigyaReintent(cb)},100)}};PASEGigyaFlow.prototype.authenticateUser=function(cb){var self=this;CCIO.Util.Modal.open(self.options.urlIframeLogin)};CCIO.Weizenbock.Dataset=function(options){if(!options||!options.name){throw new TypeError("Bad arguments")}var prefix="wads_";this.name=prefix+options.name;this.ttl=options.ttl?options.ttl:null;return this};CCIO.Weizenbock.Dataset.instances={};CCIO.Weizenbock.Dataset.getInstance=function(name,options){if(CCIO.Weizenbock.Dataset.instances[name]){return CCIO.Weizenbock.Dataset.instances[name]}options=options||{};options.name=name;var ds=new CCIO.Weizenbock.Dataset(options);CCIO.Weizenbock.Dataset.instances[name]=ds;return ds};CCIO.Weizenbock.Dataset.prototype.set=function(){var self=this;if(arguments.length<1||arguments.length>2){throw new TypeError("Bad arguments")}if(arguments.length==2){var data=this.getAll()||{};data[arguments[0]]=arguments[1]}else{var data=arguments[0]}var value={value:data,created_at:(new Date).getTime()};window.localStorage.setItem(self.name,JSON.stringify(value))};CCIO.Weizenbock.Dataset.prototype.get=function(key){var data=this.getAll();if(!data||!data[key]){return null}return data[key]};CCIO.Weizenbock.Dataset.prototype.getAll=function(settings){var self=this;var data=window.localStorage.getItem(self.name);if(!data){return null}try{data=JSON.parse(data)}catch(e){return null}if((!settings||!settings.forceNotExpire)&&data.created_at!==null&&self.ttl&&data.created_at+self.ttl<(new Date).getTime()){self.delete();return null}return data.value};CCIO.Weizenbock.Dataset.prototype.delete=function(){window.localStorage.removeItem(this.name)};function lockModalCallbacks(height,customCallbacks){customCallbacks=customCallbacks||{};var callbacks={beforeOpen:function(){this.container.closest("body").css({opacity:.2})},open:function(){$(".mfp-container").addClass("pase-container");$(".mfp-iframe-scaler").css({height:height+"px"});$(".mfp-bg").css({opacity:0,height:height+"px"});$('[data-role="content"]').toggleClass("lock").css({opacity:.2})},close:function(){$('[data-role="content"]').toggleClass("lock").css({opacity:""});$(".mfp-bg").css({opacity:"",height:"",position:"fixed"})},resize:function(){}};$.extend(callbacks,customCallbacks);return callbacks}
(function(window){var on,off;function Webkit(){if(window.webkitRequestFileSystem){window.webkitRequestFileSystem(window.TEMPORARY,1,off,on);return true}}function Mozilla(){if("MozAppearance"in document.documentElement.style){var db=indexedDB.open("test");db.onerror=on;db.onsuccess=off;return true}}function Safari(){if(/constructor/i.test(window.HTMLElement)){try{window.openDatabase(null,null,null,null)}catch(e){on()}try{if(localStorage.length)off();else{localStorage.x=1;localStorage.removeItem("x");off()}}catch(e){navigator.cookieEnabled?on():off()}return true}}function IE10Edge(){if(!window.indexedDB&&(window.PointerEvent||window.MSPointerEvent)){on();return true}}window.isPrivate=function(on_cb,off_cb){on=on_cb||function(){};off=off_cb||function(){};Webkit()||Mozilla()||Safari()||IE10Edge()||off()}})(window);
var WeizenBockCompatible={checkSiteCookies:function(user){if(!user||!user.id){WeizenBockCompatible.removeOldCookies();return}if(isNaN(user.id)){CCIO.Util.Modal.open(WAuth.options.urlIframeLogin+"SegundoPaso");return}var name="";if(typeof user.apodo!="undefined"&&user.apodo!=""){name=user.apodo}else if(typeof user.nombre!="undefined"&&user.nombre!=""&&typeof user.apellido!="undefined"&&user.apellido!=""){name=user.nombre+" "+user.apellido}user.siteName=name;if(typeof $.cookie("nombre")!="undefined"&&$.cookie("nombre")!=name){$.removeCookie("nombre",{path:_wa_conf.cookieSID.path,domain:_wa_conf.cookieSID.domain})}if(typeof $.cookie("nombre")=="undefined"||$.cookie("nombre")==""||typeof $.cookie("idPase")=="undefined"||$.cookie("idPase")==""||typeof $.cookie("pase-estado")=="undefined"||$.cookie("pase-estado")==""){this.createOldCookies(user)}},checkPWSID:function(user){if(!user||!user.id){return}if($.cookie("PWSID")){return}$.ajax({type:"POST",url:"/pw/sid",data:{uid:user.id},error:function(resp){console.error("No se pudo crear pwsid")},success:function(resp){resp=JSON.parse(resp.replace(/[\(\)]/g,""));if(resp&&resp.sid){var date=new Date;date.setTime(date.getTime()+24*60*60*1e3);$.cookie("PWSID",resp.sid,{path:_wa_conf.cookieSID.path,domain:_wa_conf.cookieSID.domain,expires:date})}else{console.error("No se pudo crear pwsid")}}})},createOldCookies:function(user){var now=new Date;var cookieParams={path:_wa_conf.cookieSID.path,domain:_wa_conf.cookieSID.domain,expires:new Date(now.getFullYear()+1,now.getMonth(),now.getDate())};var name="";if(typeof user.siteName!="undefined"){name=user.siteName}else if(typeof user.apodo!="undefined"&&user.apodo!=""){name=user.apodo}else if(typeof user.nombre!="undefined"&&user.nombre!=""&&typeof user.apellido!="undefined"&&user.apellido!=""){name=user.nombre+" "+user.apellido}if(name!=""){$.cookie("nombre",name,cookieParams)}$.cookie("idPase",user.uid,cookieParams);$.cookie("pase-estado",user.estado,cookieParams)},removeOldCookies:function(){var cookieParams={path:_wa_conf.cookieSID.path,domain:_wa_conf.cookieSID.domain};$.removeCookie("nombre",cookieParams);$.removeCookie("idPase",cookieParams);$.removeCookie("pase-estado",cookieParams);$.removeCookie("PWSID",cookieParams);$.removeCookie("paseSubscriber",cookieParams);$.removeCookie("notification-version",cookieParams)},wzbLogin:function(){if(typeof _lginFrm!="undefined"&&_lginFrm!=""){CCIO.Util.Modal.open(_lginFrm)}else{WAuth.authenticateUser()}},getTemperatura:function(){return $("[data-temperatura]").length>0?$("[data-temperatura]").data("temperatura"):""},getAudiencia:function(defaultValue){return sasSiteHelper.getAudiencia(defaultValue)},getTipoLector:function(){return sasSiteHelper.getTipoLector()},getPaywallChoque:function(){return sasSiteHelper.getPwChoque()},getPaywallCount:function(){return sasSiteHelper.getKwCount()},getStatusSw:function(){return this.getPaywallCount()>10&&this.getPaywallCount()<=20?"si":"no"},getTipoSuscripcion:function(defaultValue){return defaultValue},getFingerprint:function(){if(typeof $.cookie("wbfp2")!="undefined"&&$.cookie("wbfp2")!=""){return $.cookie("wbfp2")}return"C0D7464FFE10BB49089C31A46A1345856FDB6A0BA4C"},getAge:function(dateString){var today=new Date;var birthDate=new Date(dateString);var age=today.getFullYear()-birthDate.getFullYear();var m=today.getMonth()-birthDate.getMonth();if(m<0||m===0&&today.getDate()<birthDate.getDate()){age--}return age},getKwPw:function(){var user=WAuth.getUserSync();if(!user)return"0";return user.subscriptionStatus=="subscribed"?"2":"1"}};