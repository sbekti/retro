!function e(t,n,o){function r(c,i){if(!n[c]){if(!t[c]){var f="function"==typeof require&&require;if(!i&&f)return f(c,!0);if(a)return a(c,!0);var l=new Error("Cannot find module '"+c+"'");throw l.code="MODULE_NOT_FOUND",l}var s=n[c]={exports:{}};t[c][0].call(s.exports,function(e){var n=t[c][1][e];return r(n?n:e)},s,s.exports,e,t,n,o)}return n[c].exports}for(var a="function"==typeof require&&require,c=0;c<o.length;c++)r(o[c]);return r}({1:[function(e,t,n){function o(e){var t=a[e];if(!t)return null;if("shift"==t)return f=!0,null;if("ctrl"==t)return l=!0,null;if("alt"==t)return s=!0,null;var n="";return f&&(n+="shift-"),l&&(n+="ctrl-"),s&&(n+="alt-"),n+t}var r=new SockJS("/echo"),a=e("./keymap"),c=document.getElementById("canvas-screen"),i=c.getContext("2d"),f=!1,l=!1,s=!1;$("#canvas-screen").mousedown(function(e){e.preventDefault();var t=$(this).offset(),n=((e.pageX-t.left).toFixed(0),(e.pageY-t.top).toFixed(0),e.which);3==n&&(n=4)}),$("#canvas-screen").mouseup(function(e){e.preventDefault();{var t=$(this).offset();(e.pageX-t.left).toFixed(0),(e.pageY-t.top).toFixed(0)}}),$("#canvas-screen").mousemove(function(e){e.preventDefault();var t=$(this).offset(),n=((e.pageX-t.left).toFixed(0),(e.pageY-t.top).toFixed(0),e.which);3==n&&(n=4)}),$(document).keydown(function(e){e.preventDefault();o(e.which)}),$(document).keyup(function(e){var t=e.which,n=a[t];"shift"==n?f=!1:"ctrl"==n?l=!1:"alt"==n&&(s=!1)}),r.onopen=function(){console.log("open");var e={message:"Hi!",username:"sbekti"};r.send(JSON.stringify(e))},r.onclose=function(){console.log("close")},r.onmessage=function(e){var t=JSON.parse(e.data);console.log(t)};var u=c.width/2,p=c.height/2;i.font="30pt Tahoma",i.textAlign="center",i.fillStyle="black",i.fillText("Loading screen...",u,p)},{"./keymap":2}],2:[function(e,t,n){var o={8:"backspace",9:"tab",13:"ret",16:"shift",17:"ctrl",18:"alt",19:"?",20:"caps_lock",27:"esc",32:"spc",33:"pgup",34:"pgdn",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",44:"print",45:"insert",46:"delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:"semicolon",61:"equal",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",91:"ctrl",93:"ctrl",107:"equal",109:"minus",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"num_lock",145:"scroll_lock",186:"semicolon",187:"equal",188:"comma",189:"minus",190:"dot",191:"slash",192:"apostrophe",219:"bracket_left",220:"backslash",221:"bracket_right",222:"'",224:"ctrl"};t.exports=o},{}]},{},[1]);