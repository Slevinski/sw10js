/**
* SignWriting 2010 JavaScript Library v1.7.0
* https://github.com/Slevinski/sw10js
* Copyright (c) 2007-2015, Stephen E Slevinski Jr
* sw10.js is released under the MIT License.
*/
var sw10 = {
  key: function(text,style){
    var key = text.match(/S[123][0-9a-f]{2}[0-5][0-9a-f]([0-9]{3}x[0-9]{3})?/g);
    if (!key) {
      return '';
    } else {
      return key[0] + (style?this.styling(text):'');
    }
  },
  fsw: function(text,style){
    var fsw = text.match(/(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*|S38[7-9ab][0-5][0-9a-f][0-9]{3}x[0-9]{3}/);
    if (!fsw) {
      return '';
    } else {
      return fsw[0] + (style?this.styling(text):'');
    }
  },
  styling: function(text){
    var sfsw = text.match(/-C?(P[0-9]{2})?(G_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)_)?(D_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)(,([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+))?_)?(Z([0-9]+(\.[0-9]+)?|x))?(-(D[0-9]{2}_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)(,([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+))?_)*(Z[0-9]{2},[0-9]+(\.[0-9]+)?(,[0-9]{3}x[0-9]{3})?)*)?/);
    if (!sfsw) {
      return '';
    } else {
      return sfsw[0];
    }
  },
  mirror: function(key){
    key = this.key(key);
    if (!this.size(key)) {return '';}
    var base = key.slice(0,4);
    var fill = key.slice(4,5);
    var rot = parseInt(key.slice(5,6),16);
    var key1 = base + "08";
    var key2 = base + "18";
    var rAdd;
    if (this.size(key1) || this.size(key2)){
      rAdd = 8;
    } else {
      if ((rot===0) || (rot==4)) {rAdd=0;}
      if ((rot==1) || (rot==5)) {rAdd=6;}
      if ((rot==2) || (rot==6)) {rAdd=4;}
      if ((rot==3) || (rot==7)) {rAdd=2;}
    }
    key='';
    while (!this.size(key)) {
      rot += rAdd;
      if ((rot>7) && (rAdd<8)) { rot = rot -8;}
      if (rot>15) { rot = rot -16;}
      key = base + fill + rot.toString(16);
    }
    return key;
  },
  fill: function(key,step){
    key = this.key(key);
    if (!this.size(key)) {return '';}
    if (step!=-1) {step=1;}
    var base = key.slice(0,4);
    var fill = parseInt(key.slice(4,5));
    var rot = key.slice(5,6);
    key='';
    while (!this.size(key)){
      fill += step;
      if (fill>5) {fill=0;}
      if (fill<0) {fill=5;}
      key = base + fill + rot;
    }
    return key;
  },
  rotate: function(key,step){
    key = this.key(key);
    if (!this.size(key)) {return '';}
    if (step!=-1) {step=1;}
    var base = key.slice(0,4);
    var fill = key.slice(4,5);
    var rot = parseInt(key.slice(5,6),16);
    key='';
    while (!this.size(key)){
      if (rot>7){
        rot += step;
        if (rot>15) {rot=8;}
        if (rot<8) {rot=15;}
        key = base + fill + rot.toString(16);
      } else {
        rot -= step;
        if (rot>7) {rot=0;}
        if (rot<0) {rot=7;}
        key = base + fill + rot;
      }
    }
    return key;
  },
  scroll: function(key,step){
    key = this.key(key);
    if (!this.size(key)) {return '';}
    if (step!=-1) {step=1;}
    var base = parseInt(key.slice(1,4),16) + step;
    var fill = key.slice(4,5);
    var rot = key.slice(5,6);
    var nkey= 'S' + base.toString(16) + fill + rot;
    if(this.size(nkey)){
      return nkey;
    } else {
      return key;
    }
  },
  structure: function(division,key,opt){
    var arrs = {kind:['S100','S37f','S387'],
      category:['S100','S205','S2f7','S2ff','S36d','S37f','S387'],
      group:['S100','S10e','S11e','S144','S14c','S186','S1a4','S1ba','S1cd','S1f5','S205','S216','S22a','S255','S265','S288','S2a6','S2b7','S2d5','S2e3','S2f7','S2ff','S30a','S32a','S33b','S359','S36d','S376','S37f','S387']
    };
    var arr = arrs[division];
    if (!arr) {return !key?[]:opt=="is"?false:'';}
    if (!key&&!opt) {return arr;}
    if (!opt) {opt='';}
    var adj;
    switch(opt){
      case 'is':
        return (arr.indexOf(key.slice(0,4))==-1)?false:true;
      case 'first':
        return arr[0];
      case 'last':
        return arr.slice(-1)[0];
      case 'prev':
        adj = -2;
        break;
      case '':
        adj = -1;
        break;
      case 'next':
        adj = 0;
        break;
      default:
        return '';
    }
    var i,index = arr.length;
    for(i=0; i<arr.length; i++) {
      if(parseInt(key.slice(1,4),16) < parseInt(arr[i].slice(1,4),16)) {
        index = i;
        break;
      }
    }
    index += adj;
    index = index<0?0:index>=arr.length?arr.length-1:index;
    return arr[index];
  },
  type: function(type){
    var start,end;
    switch(type) {
      case "writing":
        start = '100';
        end = '37e';
        break;
      case "hand":
        start = '100';
        end = '204';
        break;
      case "movement":
        start = '205';
        end = '2f6';
        break;
      case "dynamic":
        start = '2f7';
        end = '2fe';
        break;
      case "head":
      case "hcenter":
        start = '2ff';
        end = '36c';
        break;
      case "vcenter":
        start = '2ff';
        end = '375';
        break;
      case "trunk":
        start = '36d';
        end = '375';
        break;
      case "limb":
        start = '376';
        end = '37e';
        break;
      case "location":
        start = '37f';
        end = '386';
        break;
      case "punctuation":
        start = '387';
        end = '38b';
        break;
      default:
        start = '100';
        end = '38b';
        break;
    }
    return [start,end];
  },
  is: function(key,type){
    if (key.length==6 && !this.size(key)) {return false;}
    var range = this.type(type);
    var start = range[0];
    var end = range[1];
    var char = key.slice(1,4);
    return (parseInt(start,16)<=parseInt(char,16) && parseInt(end,16)>=parseInt(char,16));
  },
  filter: function (fsw,type) {
    var range = this.type(type);
    var start = range[0];
    var end = range[1];
    var re = 'S' + this.range(start,end,1) + '[0-5][0-9a-f][0-9]{3}x[0-9]{3}';
    var matches = fsw.match(new RegExp(re,'g'));
    if (matches){
      return matches.join('');
    } else {
      return '';
    }
  },
  random: function(type) {
    var range = this.type(type);
    var start = range[0];
    var end = range[1];
    var rBase = Math.floor(Math.random() * (parseInt(end,16)-parseInt(start,16)+1) + parseInt(start,16));
    var rFill = Math.floor(Math.random() * 6);
    var rRota = Math.floor(Math.random() * 16);
    var key = "S" + rBase.toString(16) + rFill.toString(16) + rRota.toString(16);
    if (this.size(key)){
      return key;
    } else {
      return this.random(type);
    }
  },
  colorize: function(key) {
    var color = '000000';
    if (this.is(key,'hand')) {color = '0000CC';}
    if (this.is(key,'movement')) {color = 'CC0000';}
    if (this.is(key,'dynamic')) {color = 'FF0099';}
    if (this.is(key,'head')) {color = '006600';}
//    if (this.is(key,'trunk')) {color = '000000';}
//    if (this.is(key,'limb')) {color = '000000';}
    if (this.is(key,'location')) {color = '884411';}
    if (this.is(key,'punctuation')) {color = 'FF9900';}
    return color;
  },
  view: function(key,fillone) {
    if (!this.is(key)) {return '';}
    var prefix = key.slice(0,4);
    if (fillone){
      return prefix + ((this.size(prefix + '00'))?'0':'1') +'0';
    } else {
      return prefix + ((this.is(prefix,'hand') && !this.structure('group',prefix,'is'))?'1':'0') +'0';
    }
  },
  code: function(text,hexval){
    var key,i;
    var fsw = this.fsw(text);
    if (fsw){
      var pattern = 'S[123][0-9a-f]{2}[0-5][0-9a-f]';
      var matches = fsw.match(new RegExp(pattern,'g'));
      for(i=0; i<matches.length; i++) {
        key = matches[i];
        fsw = fsw.replace(key,this.code(key,hexval));
      }
      return fsw;
    }
    key = this.key(text);
    if (!key) {return '';}
    var code = 0x100000 + ((parseInt(key.slice(1,4),16) - 256) * 96) + ((parseInt(key.slice(4,5),16))*16) + parseInt(key.slice(5,6),16) + 1;
    return hexval?code.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((code - 0x10000) >> 10), 0xDC00 + ((code - 0x10000) & 0x3FF));
  },
  uni8: function(text,hexval){
    var key,i;
    var fsw = this.fsw(text);
    if (fsw){
      var pattern = 'S[123][0-9a-f]{2}[0-5][0-9a-f]';
      var matches = fsw.match(new RegExp(pattern,'g'));
      for(i=0; i<matches.length; i++) {
        key = matches[i];
        fsw = fsw.replace(key,this.uni8(key,hexval));
      }
      return fsw;
    }
    key = this.key(text);
    if (!key) {return '';}
    var base = parseInt(key.substr(1,3),16) + parseInt('1D700',16);
    var uni8 = hexval?base.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((base - 0x10000) >> 10), 0xDC00 + ((base - 0x10000) & 0x3FF));
    var fill = key.substr(4,1);
    if (fill!="0"){
      fill = parseInt(fill,16) + parseInt('1DA9A',16);
      uni8 += hexval?fill.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((fill - 0x10000) >> 10), 0xDC00 + ((fill - 0x10000) & 0x3FF));
    }
    var rotation = key.substr(5,1);
    if (rotation!="0"){
      rotation = parseInt(rotation,16) + parseInt('1DAA0',16);
      uni8 += hexval?rotation.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((rotation - 0x10000) >> 10), 0xDC00 + ((rotation - 0x10000) & 0x3FF));
    }
    return uni8;
  },
  pua: function(text,hexval){
    var key,pua,fsw = this.fsw(text);
    if (fsw){
      var str, code, coord;
      code = parseInt('FD800',16);
      fsw = fsw.replace('A',hexval?(code).toString(16).toUpperCase():String.fromCharCode(0xD800 + (((code) - 0x10000) >> 10), 0xDC00 + (((code) - 0x10000) & 0x3FF)));
      fsw = fsw.replace('B',hexval?(code+1).toString(16).toUpperCase():String.fromCharCode(0xD800 + (((code+1) - 0x10000) >> 10), 0xDC00 + (((code+1) - 0x10000) & 0x3FF)));
      fsw = fsw.replace('L',hexval?(code+2).toString(16).toUpperCase():String.fromCharCode(0xD800 + (((code+2) - 0x10000) >> 10), 0xDC00 + (((code+2) - 0x10000) & 0x3FF)));
      fsw = fsw.replace('M',hexval?(code+3).toString(16).toUpperCase():String.fromCharCode(0xD800 + (((code+3) - 0x10000) >> 10), 0xDC00 + (((code+3) - 0x10000) & 0x3FF)));
      fsw = fsw.replace('R',hexval?(code+4).toString(16).toUpperCase():String.fromCharCode(0xD800 + (((code+4) - 0x10000) >> 10), 0xDC00 + (((code+4) - 0x10000) & 0x3FF)));
      var pattern = '[0-9]{3}x[0-9]{3}';
      var matches = fsw.match(new RegExp(pattern,'g'));
      for(var i=0; i<matches.length; i++) {
        str = matches[i];
        coord = str.split('x');
        coord[0] = parseInt(coord[0]) + parseInt('FDD0C',16);
        coord[1] = parseInt(coord[1]) + parseInt('FDD0C',16);
        pua = hexval?coord[0].toString(16).toUpperCase():String.fromCharCode(0xD800 + ((coord[0] - 0x10000) >> 10), 0xDC00 + ((coord[0] - 0x10000) & 0x3FF));
        pua += hexval?coord[1].toString(16).toUpperCase():String.fromCharCode(0xD800 + ((coord[1] - 0x10000) >> 10), 0xDC00 + ((coord[1] - 0x10000) & 0x3FF));
        fsw = fsw.replace(str,pua);
      }
      pattern = 'S[123][0-9a-f]{2}[0-5][0-9a-f]';
      matches = fsw.match(new RegExp(pattern,'g'));
      for(i=0; i<matches.length; i++) {
        key = matches[i];
        fsw = fsw.replace(key,this.pua(key,hexval));
      }
      return fsw;
    }
    key = this.key(text);
    if (!key) {return '';}
    var base = parseInt(key.substr(1,3),16) + parseInt('FD730',16);
    pua = hexval?base.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((base - 0x10000) >> 10), 0xDC00 + ((base - 0x10000) & 0x3FF));
    var fill = key.substr(4,1);
    fill = parseInt(fill,16) + parseInt('FD810',16);
    pua += hexval?fill.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((fill - 0x10000) >> 10), 0xDC00 + ((fill - 0x10000) & 0x3FF));
    var rotation = key.substr(5,1);
    rotation = parseInt(rotation,16) + parseInt('FD820',16);
    pua += hexval?rotation.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((rotation - 0x10000) >> 10), 0xDC00 + ((rotation - 0x10000) & 0x3FF));
    return pua;
  },
  bbox: function(fsw) {
    var rcoord = /[0-9]{3}x[0-9]{3}/g;
    var x,y,x1,x2,y1,y2;
    var coords = fsw.match(rcoord);
    if (coords){
      for (var i=0; i < coords.length; i++) {
        x = parseInt(coords[i].slice(0, 3));
        y = parseInt(coords[i].slice(4, 7));
        if (i===0){
          x1 = x;
          x2 = x;
          y1 = y;
          y2 = y;
        } else {
          x1 = Math.min(x1, x);
          x2 = Math.max(x2, x);
          y1 = Math.min(y1, y);
          y2 = Math.max(y2, y);
        }
      }
      return '' + x1 + ' ' + x2 + ' ' + y1 + ' ' + y2;
    } else {
      return '';
    }
  },
  displace: function(text,x,y){
    var xpos,ypos;
    var re = '[0-9]{3}x[0-9]{3}';
    var matches = text.match(new RegExp(re,'g'));
    if (matches){
      for(var i=0; i<matches.length; i++) {
        xpos = parseInt(matches[i].slice(0, 3)) + x;
        ypos = parseInt(matches[i].slice(4, 7)) + y;
        text = text.replace(matches[i],xpos + "X" + ypos);
      }
      text = text.replace(/X/g,"x");
    }
    return text;
  },
  sizes:{
  },
  size: function(text) {
    var w,h,s,size,fsw = this.fsw(text);
    if (fsw) {
      var bbox = this.bbox(fsw);
      bbox = bbox.split(' ');
      var x1 = bbox[0];
      var x2 = bbox[1];
      var y1 = bbox[2];
      var y2 = bbox[3];
      size = (x2-x1) + 'x' + (y2-y1);
      if (size=='0x0') {return '';}
      return size;
    }
    var key = this.key(text);
    if (!key) {return '';}
    if (this.sizes[key]) {return this.sizes[key];}

    var imgData,i,zoom = 2;
    var bound = 76 * zoom;
    if (!this.canvaser){
      this.canvaser = document.createElement("canvas");
      this.canvaser.width = bound;
      this.canvaser.height = bound;
    }
    var canvas = this.canvaser;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, bound, bound);
    context.font = (30*zoom) + "px 'SignWriting 2010'";
    context.fillText(this.code(key),0,0);
    imgData = context.getImageData(0,0,bound,bound).data;

    wloop:
    for (w=bound-1;w>=0;w--){
      for (h=0;h<bound;h++){
        for (s=0;s<4;s++){
          i=w*4+(h*4*bound) +s;
          if (imgData[i]){
            break wloop;
          }
        }
      }
    }
    var width = w;
    hloop:
    for (h=bound-1;h>=0;h--){
      for (w=0;w<width;w++){
        for (s=0;s<4;s++){
          i=w*4+(h*4*bound) +s;
          if (imgData[i]){
            break hloop;
          }
        }
      }
    }
    var height = h+1;
    width= '' + Math.ceil(width/zoom);
    height= '' + Math.ceil(height/zoom);
    // Rounding error in chrome.  Manual fixes.
    if ('S1710d S1711d S1712d S17311 S17321 S17733 S1773f S17743 S1774f S17753 S1775f S16d33 S1713d S1714d S17301 S17329 S1715d'.indexOf(key)>-1){
      width = '20';
    }
    if ('S24c15 S24c30'.indexOf(key)>-1){
      width = '22';
    }
    if ('S2903b'.indexOf(key)>-1){
      width = '23';
    }
    if ('S1d203 S1d233'.indexOf(key)>-1){
      width = '25';
    }
    if ('S24c15'.indexOf(key)>-1){
      width = '28';
    }
    if ('S2e629'.indexOf(key)>-1){
      width = '29';
    }
    if ('S16541 S23425'.indexOf(key)>-1){
      width = '30';
    }
    if ('S2d316'.indexOf(key)>-1){
      width = '40';
    }
    if ('S2541a'.indexOf(key)>-1){
      width = '50';
    }
    if ('S1732f S17731 S17741 S17751'.indexOf(key)>-1){
      height = '20';
    }
    if ('S1412c'.indexOf(key)>-1){
      height = '21';
    }
    if ('S2a903'.indexOf(key)>-1){
      height = '31';
    }
    if ('S2b002'.indexOf(key)>-1){
      height = '36';
    }
    size = width + 'x' + height;
    // Error in chrome.  Manual fix.
    if (size=='0x0') {
      var sizefix = 'S1000815x30 S1000921x30 S1000a30x15 S1000b30x21 S1000c15x30 S1000d21x30 ';
      var ipos = sizefix.indexOf(key);
      if (ipos ==-1) {
        return '';
      } else {
        var iend = sizefix.indexOf(' ',ipos);
        size = sizefix.slice(ipos + 6,iend);
      }
    }
    this.sizes[key]=size;
    return size;
  },
  max: function(fsw,type){
    var range = this.type(type);
    var start = range[0];
    var end = range[1];
    var re = 'S' + this.range(start,end,1) + '[0-5][0-9a-f][0-9]{3}x[0-9]{3}';
    var matches = fsw.match(new RegExp(re,'g'));
    if (matches){
      var key,x,y,size,output='';
      for (var i=0; i < matches.length; i++) {
        key = matches[i].slice(0,6);
        x = parseInt(matches[i].slice(6, 9));
        y = parseInt(matches[i].slice(10, 13));
        size =this.size(key).split('x');
        output += key + x + "x" + y + (x+parseInt(size[0])) + 'x' + (y+parseInt(size[1]));
      }
      return output;
    } else {
      return '';
    }
  },
  norm: function (fsw){
    var minx,maxx,miny,maxy;
    var hbox = this.bbox(this.max(fsw,'hcenter'));
    var vbox = this.bbox(this.max(fsw,'vcenter'));
    var box = this.bbox(this.max(fsw));
    if (!box) {return "";}
    if (vbox){
      minx = parseInt(vbox.slice(0,3));
      maxx = parseInt(vbox.slice(4,7));
    } else {
      minx = parseInt(box.slice(0,3));
      maxx = parseInt(box.slice(4,7));
    }
    if (hbox){
      miny = parseInt(hbox.slice(8,11));
      maxy = parseInt(hbox.slice(12,15));
    } else {
      miny = parseInt(box.slice(8,11));
      maxy = parseInt(box.slice(12,15));
    }
    var xcenter = parseInt((minx + maxx)/2);
    var ycenter = parseInt((miny + maxy)/2);
    var xdiff = 500 - xcenter;
    var ydiff = 500 - ycenter;
    var start = fsw.match(/(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]/);
    if (!start) {
      start = 'M';
    } else {
      start = start[0];
    }

    fsw = start + parseInt(box.slice(4,7)) + "x" + parseInt(box.slice(12,15)) + this.filter(fsw);
    return this.displace(fsw,xdiff,ydiff);
  },
  svg: function(text,options){
    var fsw = this.fsw(text);
    var styling = this.styling(text);
    var stylings,pos,keysize,colors,i,size;
    if (!fsw) {
      var key = this.key(text);
      keysize = this.size(key);
      if (!keysize) {return '';}
      if (key.length==6) {
        fsw = key + "500x500";
      } else {
        fsw = key;
      }
    }
    if (!options) options = {};
    if (options.size) {
      options.size = parseFloat(options.size) || 'x';
    } else {
      options.size = 1;
    }
    if (options.colorize) {
      options.colorize = true;
    } else {
      options.colorize = false;
    }
    if (options.pad) {
      options.pad = parseInt(options.pad);
    } else {
      options.pad = 0;
    }
    if (!options.line){
      options.line="black";
    } else {
      options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.line)?"#"+options.line:options.line;
    }
    if (!options.fill){
      options.fill="white";
    } else {
      options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.fill)?"#"+options.fill:options.fill;
    }
    if (!options.back){
      options.back="";
    } else {
      options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.back)?"#"+options.back:options.back;
    }
    options.E = [];
    options.F = [];

    options.view = options.view=="key"?"key":options.view=="uni8"?"uni8":options.view=="pua"?"pua":"code";
    options.copy = options.copy=="code"?"code":options.copy=="uni8"?"uni8":options.copy=="pua"?"pua":"key";

    if (styling){
      var rs;
      rs = styling.match(/C/);
      options.colorize = rs?true:false;

      rs = styling.match(/P[0-9]{2}/);
      if (rs){
        options.pad = parseInt(rs[0].substring(1,rs[0].length));
      }

      rs = styling.match(/G_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)_/);
      if (rs){
        var back = rs[0].substring(2,rs[0].length-1);
        options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(back)?"#"+back:back;
      }
//fix
      stylings = styling.split('-');
      rs = stylings[1].match(/D_([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+))?_/);
      if (rs) {
        colors = rs[0].substring(2,rs[0].length-1).split(',');
        if (colors[0]) options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
        if (colors[1]) options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
      }

      rs = stylings[1].match(/Z([0-9]+(\.[0-9]+)?|x)/);
      if (rs){
        options.size = parseFloat(rs[0].substring(1,rs[0].length)) || 'x';
      }

      if (!stylings[2]) stylings[2]='';

      rs = stylings[2].match(/D[0-9]{2}_([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+))?_/g);
      if (rs) {
        for (i=0; i < rs.length; i++) {
          pos = parseInt(rs[i].substring(1,3));
          colors = rs[i].substring(4,rs[i].length-1).split(',');
          if (colors[0]) colors[0] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
          if (colors[1]) colors[1] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
          options.E[pos]=colors;
        }
      }

      rs = stylings[2].match(/Z[0-9]{2},[0-9]+(\.[0-9]+)?(,[0-9]{3}x[0-9]{3})?/g);
      if (rs){
        for (i=0; i < rs.length; i++) {
          pos = parseInt(rs[i].substring(1,3));
          size = rs[i].substring(4,rs[i].length).split(',');
          size[0]=parseFloat(size[0]);
          options.F[pos]=size;
        }
      }
    }

    var r, rsym, rcoord, sym, syms, gelem, o;
    r = /(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*|S38[7-9ab][0-5][0-9a-f][0-9]{3}x[0-9]{3}/g;
    rsym = /S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3}/g;
    rcoord = /[0-9]{3}x[0-9]{3}/g;
    o = {};
    o.L = -1;
    o.R = 1;
    var x, x1 = 500,
      x2 = 500,
      y, y1 = 500,
      y2 = 500,
      k, w, h, l;
    k = fsw.charAt(0);
    var bbox = this.bbox(fsw);
    bbox = bbox.split(' ');
    x1 = parseInt(bbox[0]);
    x2 = parseInt(bbox[1]);
    y1 = parseInt(bbox[2]);
    y2 = parseInt(bbox[3]);
    if (k == 'S') {
      if (x1==500 && y1==500){
        size = keysize.split('x');
        x2 = 500 + parseInt(size[0]);
        y2 = 500 + parseInt(size[1]);
      } else {
        x2 = 1000-x1;
        y2 = 1000-y1;
      }
    }
    syms = fsw.match(rsym);
    for (i=0; i < syms.length; i++) {
      sym = syms[i].slice(0,6);
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      if (options.F[i+1]){
        if (options.F[i+1][1]){
          x = parseInt(x) + parseInt(options.F[i+1][1].slice(0,3))-500;
          y = parseInt(y) + parseInt(options.F[i+1][1].slice(4,7))-500;
          x1 = Math.min(x1,x);
          y1 = Math.min(y1,y);
        }
        var keysized = this.size(sym);
        if (keysized) {
          keysized = keysized.split('x');
          x2 = Math.max(x2,parseInt(x) + (options.F[i+1][0] * parseInt(keysized[0])));
          y2 = Math.max(y2,parseInt(y) + (options.F[i+1][0] * parseInt(keysized[1])));
        }

      }
      gelem = '<g transform="translate(' + x + ',' + y + ')">';
      gelem += '<text ';
      gelem += 'class="sym-fill" ';
      if (!options.css) {
        gelem += 'style="pointer-events:none;font-family:\'SignWriting 2010 Filling\';font-size:' + (options.F[i+1]?30*options.F[i+1][0]:30) + 'px;fill:' + (options.E[i+1]?options.E[i+1][1]?options.E[i+1][1]:options.fill:options.fill) + ';';
        gelem += options.view=='code'?'':'-webkit-font-feature-settings:\'liga\';font-feature-settings:\'liga\';';
        gelem += '"';
        //-moz-font-feature-settings:'liga';
      }
      gelem += '>';
      gelem += options.view=="key"?sym:options.view=="uni8"?this.uni8(sym):options.view=="pua"?this.pua(sym):this.code(sym);
      gelem += '</text>';
      gelem += '<text ';
      gelem += 'class="sym-line" ';
      if (!options.css) {
        gelem += 'style="';
        gelem += options.view==options.copy?'':'pointer-events:none;';
        gelem += 'font-family:\'SignWriting 2010\';font-size:' + (options.F[i+1]?30*options.F[i+1][0]:30) + 'px;fill:' + (options.E[i+1]?options.E[i+1][0]:options.colorize?'#'+this.colorize(sym):options.line) + ';';
        gelem += options.view=='code'?'':'-webkit-font-feature-settings:\'liga\';font-feature-settings:\'liga\';';
        gelem += '"';
      }
      gelem += '>';
      gelem += options.view=="key"?sym:options.view=="uni8"?this.uni8(sym):options.view=="pua"?this.pua(sym):this.code(sym);
      gelem += '</text>';
      gelem += '</g>';
      syms[i] = gelem;
    }

    x1 = x1 - options.pad;
    x2 = x2 + options.pad;
    y1 = y1 - options.pad;
    y2 = y2 + options.pad;
    w = x2 - x1;
    h = y2 - y1;
    l = o[k] || 0;
    l = l * 75 + x1 - 400;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" ';
    if (options.class) svg += 'class="' + options.class + '" ';
    if (options.size!='x') svg += 'width="' + (w * options.size) + '" height="' + (h * options.size) + '" ';
    svg += 'viewBox="' + x1 + ' ' + y1 + ' ' + w + ' ' + h + '">';
    if (options.view!=options.copy) {
      svg += '<text style="font-size:0%;">';
      svg += options.copy=="code"?this.code(text):options.copy=="uni8"?this.uni8(text):options.copy=="pua"?this.pua(text):text;
      svg += '</text>';
    }
    if (options.back) {
      svg += '  <rect x="' + x1 + '" y="' + y1 + '" width="' + w + '" height="' + h + '" style="fill:' + options.back + ';" />';
    }
    svg += syms.join('') + "</svg>";
    if (options.laned){
      svg = '<div style="padding:10px;position:relative;width:' + w + 'px;height:' + h + 'px;left:' + l + 'px;">' + svg + '</div>';
    }
    return svg;
  },
  canvas: function(text,options){
    var canvas = document.createElement("canvas");
    var fsw = this.fsw(text,true);
    var styling = this.styling(text);
    var stylings,colors,keysize,keysized,size,i,pos;
    if (!fsw) {
      var key = this.key(text);
      keysize=this.size(key);
      if (!key) {return '';}
      if (key.length==6) {
        fsw = key + "500x500";
      } else {
        fsw = key;
      }
    }
    if (!options) options = {};
    if (options.size) {
      options.size = parseFloat(options.size);
    } else {
      options.size = 1;
    }
    if (options.colorize) {
      options.colorize = true;
    } else {
      options.colorize = false;
    }
    if (options.pad) {
      options.pad = parseInt(options.pad);
    } else {
      options.pad = 0;
    }
    if (!options.line){
      options.line="black";
    } else {
      options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.line)?"#"+options.line:options.line;
    }
    if (!options.fill){
      options.fill="white";
    } else {
      options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.fill)?"#"+options.fill:options.fill;
    }
    if (!options.back){
      options.back="";
    } else {
      options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.back)?"#"+options.back:options.back;
    }
    options.E = [];
    options.F = [];

    if (styling){
      var rs;
      rs = styling.match(/C/);
      options.colorize = rs?true:false;

      rs = styling.match(/P[0-9]{2}/);
      if (rs){
        options.pad = parseInt(rs[0].substring(1,rs[0].length));
      }

      rs = styling.match(/G_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)_/);
      if (rs){
        var back = rs[0].substring(2,rs[0].length-1);
        options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(back)?"#"+back:back;
      }
//fix
      stylings = styling.split('-');
      rs = stylings[1].match(/D_([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+))?_/);
      if (rs) {
        colors = rs[0].substring(2,rs[0].length-1).split(',');
        if (colors[0]) options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
        if (colors[1]) options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
      }

      rs = stylings[1].match(/Z[0-9]+(\.[0-9]+)?/);
      if (rs){
        options.size = rs[0].substring(1,rs[0].length);
      }

      if (!stylings[2]) stylings[2]='';

      rs = stylings[2].match(/D[0-9]{2}_([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+))?_/g);
      if (rs) {
        for (i=0; i < rs.length; i++) {
          pos = parseInt(rs[i].substring(1,3));
          colors = rs[i].substring(4,rs[i].length-1).split(',');
          if (colors[0]) colors[0] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
          if (colors[1]) colors[1] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
          options.E[pos]=colors;
        }
      }

      rs = stylings[2].match(/Z[0-9]{2},[0-9]+(\.[0-9]+)?(,[0-9]{3}x[0-9]{3})?/g);
      if (rs){
        for (i=0; i < rs.length; i++) {
          pos = parseInt(rs[i].substring(1,3));
          size = rs[i].substring(4,rs[i].length).split(',');
          size[0]=parseFloat(size[0]);
          options.F[pos]=size;
        }
      }
    }


    var r, rsym, rcoord, sym, syms, o;
    r = /(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*|S38[7-9ab][0-5][0-9a-f][0-9]{3}x[0-9]{3}/g;
    rsym = /S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3}/g;
    rcoord = /[0-9]{3}x[0-9]{3}/g;
    o = {};
    o.L = -1;
    o.R = 1;
    var x, x1 = 500,
      x2 = 500,
      y, y1 = 500,
      y2 = 500,
      k, w, h;
    k = fsw.charAt(0);
    var bbox = this.bbox(fsw);
    bbox = bbox.split(' ');
    x1 = parseInt(bbox[0]);
    x2 = parseInt(bbox[1]);
    y1 = parseInt(bbox[2]);
    y2 = parseInt(bbox[3]);

    if (k == 'S') {
      if (x1==500 && y1==500){
        size = keysize.split('x');
        x2 = 500 + parseInt(size[0]);
        y2 = 500 + parseInt(size[1]);
      } else {
        x2 = 1000-x1;
        y2 = 1000-y1;
      }
    }

    syms = fsw.match(rsym);
    for (i=0; i < syms.length; i++) {
      sym = syms[i].slice(0,6);
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      if (options.F[i+1]){
        if (options.F[i+1][1]){
          x = parseInt(x) + parseInt(options.F[i+1][1].slice(0,3))-500;
          y = parseInt(y) + parseInt(options.F[i+1][1].slice(4,7))-500;
          x1 = Math.min(x1,x);
          y1 = Math.min(y1,y);
        }
        keysized = this.size(sym);
        if (keysized) {
          keysized = keysized.split('x');
          x2 = Math.max(x2,parseInt(x) + (options.F[i+1][0] * parseInt(keysized[0])));
          y2 = Math.max(y2,parseInt(y) + (options.F[i+1][0] * parseInt(keysized[1])));
        }

      }
    }

    x1 = x1 - options.pad;
    x2 = x2 + options.pad;
    y1 = y1 - options.pad;
    y2 = y2 + options.pad;
    w = (x2-x1) * options.size;
    h = (y2-y1) * options.size;
    canvas.width = w;
    canvas.height = h;
    var context = canvas.getContext("2d");
    if (options.back){
      context.rect(0,0,w,h);
      context.fillStyle=options.back;
      context.fill();
//      context.fillStyle = options.back;
//      context.fillRect(0,0,w,h);
    }
    syms = fsw.match(rsym);
    for (i=0; i < syms.length; i++) {
      sym = syms[i].slice(0,6);
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      if (options.F[i+1]){
        if (options.F[i+1][1]){
          x = parseInt(x) + parseInt(options.F[i+1][1].slice(0,3))-500;
          y = parseInt(y) + parseInt(options.F[i+1][1].slice(4,7))-500;
          x1 = Math.min(x1,x);
          y1 = Math.min(y1,y);
        }
        keysized = this.size(sym);
        if (keysized) {
          keysized = keysized.split('x');
          x2 = Math.max(x2,parseInt(x) + (options.F[i+1][0] * parseInt(keysized[0])));
          y2 = Math.max(y2,parseInt(y) + (options.F[i+1][0] * parseInt(keysized[1])));
        }

      }
      context.font = (options.F[i+1]?30*options.size*options.F[i+1][0]:30*options.size) + "px 'SignWriting 2010 Filling'";
      context.fillStyle =  (options.E[i+1]?options.E[i+1][1]?options.E[i+1][1]:options.fill:options.fill);
      context.fillText(this.code(sym),((x-x1)*options.size),((y-y1)*options.size));
      context.font = (options.F[i+1]?30*options.size*options.F[i+1][0]:30*options.size) + "px 'SignWriting 2010'";
      context.fillStyle = (options.E[i+1]?options.E[i+1][0]:options.colorize?'#'+this.colorize(sym):options.line);
      context.fillText(this.code(sym),((x-x1)*options.size),((y-y1)*options.size));
    }
    return canvas;
  },
  png: function (fsw,options){
    if (this.fsw(fsw,true) || this.key(fsw,true) ){
      var canvas = this.canvas(fsw,options);
      var png = canvas.toDataURL("image/png");
      canvas.remove();
      return png;
    } else {
      return '';
    }
  },
  query: function (query){
    query = query.match(/Q((A(S[123][0-9a-f]{2}[0-5u][0-9a-fu]|R[123][0-9a-f]{2}t[123][0-9a-f]{2})+)?T)?((R[123][0-9a-f]{2}t[123][0-9a-f]{2}([0-9]{3}x[0-9]{3})?)|(S[123][0-9a-f]{2}[0-5u][0-9a-fu]([0-9]{3}x[0-9]{3})?))*(V[0-9]+)?/);
    if (query) {
      return query[0];
    } else {
      return '';
    }
  },
  range: function (min,max,hex){
    var pattern, re, diff, tmax, cnt, minV, maxV;
    if (!hex) hex='';
    min = ("000" + min).slice(-3);
    max = '' + max;
    pattern='';

    if (min===max) {return min;}

    //ending pattern will be series of connected OR ranges
    re = [];

    //first pattern+  10's don't match and the min 1's are not zero
    //odd number to 9
    if (!(min[0]==max[0] && min[1]==max[1])) {
      if (min[2]!='0'){
        pattern = min[0] + min[1];
        if (hex) {
          //switch for dex
          switch (min[2]){
          case "f":
            pattern += 'f';
            break;
          case "e":
            pattern += '[ef]';
            break;
          case "d":
          case "c":
          case "b":
          case "a":
            pattern += '[' + min[2] + '-f]';
            break;
          default:
            switch (min[2]){
              case "9":
             pattern += '[9a-f]';
              break;
            case "8":
              pattern += '[89a-f]';
              break;
            default:
             pattern += '[' + min[2] + '-9a-f]';
              break;
            }
            break;
          }
          diff = 15-parseInt(min[2],16) +1;
          min = '' + ((parseInt(min,16)+diff)).toString(16);
          re.push(pattern);
        } else {
          //switch for dex
          switch (min[2]){
          case "9":
            pattern += '9';
            break;
          case "8":
            pattern += '[89]';
            break;
          default:
           pattern += '[' + min[2] + '-9]';
            break;
          }
          diff = 9-min[2] +1;
          min = '' + (min*1 + diff);
          re.push(pattern);
        }
      }
    }
    pattern = '';

    //if hundreds are different, get odd to 99 or ff
    if (min[0]!=max[0]){
      if (min[1]!='0'){
        if (hex){
          //scrape to ff
          pattern = min[0];
          switch (min[1]){
          case "f":
            pattern += 'f';
            break;
          case "e":
            pattern += '[ef]';
            break;
          case "d":
          case "c":
          case "b":
          case "a":
            pattern += '[' + min[1] + '-f]';
            break;
          case "9":
            pattern += '[9a-f]';
            break;
          case "8":
            pattern += '[89a-f]';
            break;
          default:
            pattern += '[' + min[1] + '-9a-f]';
            break;
          }
          pattern += '[0-9a-f]';
          diff = 15-parseInt(min[1],16) +1;
          min = '' + (parseInt(min,16)+diff*16).toString(16);
          re.push(pattern);
        } else {
          //scrape to 99
          pattern = min[0];
          diff = 9-min[1] +1;
          switch (min[1]){
          case "9":
            pattern += '9';
            break;
          case "8":
            pattern += '[89]';
            break;
          default:
            pattern += '[' + min[1] + '-9]';
            break;
          }
          pattern += '[0-9]';
          diff = 9-min[1] +1;
          min = '' + (min*1 + diff*10);
          re.push(pattern);
        }
      }
    }
    pattern = '';

    //if hundreds are different, get to same
    if (min[0]!=max[0]){
      if (hex){
        diff = parseInt(max[0],16) - parseInt(min[0],16);
        tmax = (parseInt(min[0],16) + diff-1).toString(16);

        switch (diff){
        case 1:
          pattern = min[0];
          break;
        case 2:
          pattern = '[' + min[0] + tmax + ']';
          break;
        default:
          if (parseInt(min[0],16)>9){
            minV = 'h';
          } else {
            minV = 'd';
          }
          if (parseInt(tmax,16)>9){
            maxV = 'h';
          } else {
            maxV = 'd';
          }
          switch (minV + maxV){
          case "dd":
            pattern += '[' + min[0] + '-' + tmax + ']';
            break;
          case "dh":
            diff = 9 - min[0];
            //firs get up to 9
            switch (diff){
            case 0:
              pattern += '[9';
              break;
            case 1:
              pattern += '[89';
              break;
            default:
              pattern += '[' + min[0] + '-9';
              break;
            }
            switch (tmax[0]){
            case 'a':
              pattern += 'a]';
              break;
            case 'b':
              pattern += 'ab]';
              break;
            default:
              pattern += 'a-' + tmax + ']';
              break;
            }
            break;
          case "hh":
            pattern += '[' + min[0] + '-' + tmax + ']';
            break;
          }
        }

        pattern += '[0-9a-f][0-9a-f]';
        diff = parseInt(max[0],16) - parseInt(min[0],16);
        min = '' + (parseInt(min,16)+diff*256).toString(16);
        re.push(pattern);
      } else {
        diff = max[0] - min[0];
        tmax = min[0]*1 + diff-1;

        switch (diff){
        case 1:
          pattern = min[0];
          break;
        case 2:
          pattern = '[' + min[0] + tmax + ']';
          break;
        default:
          pattern = '[' + min[0] + '-' + tmax + ']';
          break;
        }
        pattern += '[0-9][0-9]';
        min = '' + (min*1 + diff*100);
        re.push(pattern);
      }
    }
    pattern = '';

    //if tens are different, get to same
    if (min[1]!=max[1]){
      if (hex){
        diff = parseInt(max[1],16) - parseInt(min[1],16);
        tmax = (parseInt(min[1],16) + diff-1).toString(16);
        pattern = min[0];
        switch (diff){
        case 1:
          pattern += min[1];
          break;
        case 2:
          pattern += '[' + min[1] + tmax + ']';
          break;
        default:

          if (parseInt(min[1],16)>9){
            minV = 'h';
          } else {
            minV = 'd';
          }
          if (parseInt(tmax,16)>9){
            maxV = 'h';
          } else {
            maxV = 'd';
          }
          switch (minV + maxV){
          case "dd":
            pattern += '[' + min[1];
            if (diff>1) pattern += '-';
            pattern += tmax + ']';
            break;
          case "dh":
            diff = 9 - min[1];
            //firs get up to 9
            switch (diff){
            case 0:
              pattern += '[9';
              break;
            case 1:
              pattern += '[89';
              break;
            default:
              pattern += '[' + min[1] + '-9';
              break;
            }
            switch (max[1]){
            case 'a':
              pattern += ']';
              break;
            case 'b':
              pattern += 'a]';
              break;
            default:
              pattern += 'a-' + (parseInt(max[1],16)-1).toString(16) + ']';
              break;
            }
            break;
          case "hh":
            pattern += '[' + min[1];
            if (diff>1) pattern += '-';
            pattern += (parseInt(max[1],16)-1).toString(16) + ']';
            break;
          }
          break;
        }
        pattern += '[0-9a-f]';
        diff = parseInt(max[1],16) - parseInt(min[1],16);
        min = '' + (parseInt(min,16)+diff*16).toString(16);
        re.push(pattern);
      } else {
        diff = max[1] - min[1];
        tmax = min[1]*1 + diff-1;
        pattern = min[0];
        switch (diff){
        case 1:
          pattern += min[1];
          break;
        case 2:
          pattern += '[' + min[1] + tmax + ']';
          break;
        default:
         pattern += '[' + min[1] + '-' + tmax + ']';
          break;
        }
        pattern += '[0-9]';
        min = '' + (min*1 + diff*10);
        re.push(pattern);
      }
    }
    pattern = '';

    //if digits are different, get to same
    if (min[2]!=max[2]){
      if (hex){
        pattern = min[0] + min[1];
        diff = parseInt(max[2],16) - parseInt(min[2],16);
        if (parseInt(min[2],16)>9){
          minV = 'h';
        } else {
          minV = 'd';
        }
        if (parseInt(max[2],16)>9){
          maxV = 'h';
        } else {
          maxV = 'd';
        }
        switch (minV + maxV){
        case "dd":
          pattern += '[' + min[2];
          if (diff>1) pattern += '-';
          pattern += max[2] + ']';
          break;
        case "dh":
          diff = 9 - min[2];
          //firs get up to 9
          switch (diff){
          case 0:
            pattern += '[9';
            break;
          case 1:
            pattern += '[89';
            break;
          default:
            pattern += '[' + min[2] + '-9';
            break;
          }
          switch (max[2]){
          case 'a':
            pattern += 'a]';
            break;
          case 'b':
            pattern += 'ab]';
            break;
          default:
            pattern += 'a-' + max[2] + ']';
            break;
          }

          break;
        case "hh":
          pattern += '[' + min[2];
          if (diff>1) pattern += '-';
          pattern += max[2] + ']';
          break;
        }
        diff = parseInt(max[2],16) - parseInt(min[2],16);
        min = '' + (parseInt(min,16) + diff).toString(16);
        re.push(pattern);
      } else {
        diff = max[2] - min[2];
        pattern = min[0] + min[1];
        switch (diff){
        case 0:
          pattern += min[2];
          break;
        case 1:
          pattern += '[' + min[2] + max[2] + ']';
          break;
        default:
         pattern += '[' + min[2] + '-' + max[2] + ']';
          break;
        }
        min = '' + (min*1 + diff);
        re.push(pattern);
      }
    }
    pattern = '';

    //last place is whole hundred
    if (min[2]=='0' && max[2]=='0') {
      pattern = max;
      re.push(pattern);
    }
    pattern = '';

    cnt = re.length;
    if (cnt==1){
      pattern = re[0];
    } else {
      pattern = re.join(')|(');
      pattern = '((' + pattern + '))';
    }
    return pattern;
  },
  regex: function (query,fuzz){
    query = this.query(query);
    if (!query) {
      return '';
    }
    var matches, i, fsw_pattern, part, from, to, re_range, segment, x, y, base, fill, rotate;
    if (!fuzz) fuzz = 20;
    var re_sym = 'S[123][0-9a-f]{2}[0-5][0-9a-f]';
    var re_coord = '[0-9]{3}x[0-9]{3}';
    var re_word = '[BLMR](' + re_coord + ')(' + re_sym + re_coord + ')*';
    var re_term = '(A(' + re_sym+ ')+)';
    var q_range = 'R[123][0-9a-f]{2}t[123][0-9a-f]{2}';
    var q_sym = 'S[123][0-9a-f]{2}[0-5u][0-9a-fu]';
    var q_coord = '([0-9]{3}x[0-9]{3})?';
    var q_var = '(V[0-9]+)';
    var q_term;
    query = this.query(query);
    if (!query) {return '';}
    if (query=='Q'){
      return [re_term + "?" + re_word];
    }
    if (query=='QT'){
      return [re_term + re_word];
    }
    var segments = [];
    var term = query.indexOf('T')+1;
    if (term){
      q_term = '(A';
      var qat = query.slice(0,term);
      query = query.replace(qat,'');
      if (qat == 'QT') {
        q_term += '(' + re_sym + ')+)';
      } else {
        matches = qat.match(new RegExp('(' + q_sym + '|' + q_range + ')','g'));
        if (matches){
          for(i=0; i<matches.length; i++) {
            var matched = matches[i].match(new RegExp(q_sym));
            if (matched){
              segment = matched[0].slice(0,4);
              fill = matched[0].slice(4,5);
              if (fill=='u') {
                segment += '[0-5]';
              } else {
                segment += fill;
              }
              rotate = matched[0].slice(5,6);
              if (rotate=='u') {
                segment += '[0-9a-f]';
              } else {
                segment += rotate;
              }
              q_term += segment;
            } else {
              from = matches[i].slice(1,4);
              to = matches[i].slice(5,8);
              re_range = this.range(from,to,'hex');
              segment = 'S' + re_range + '[0-5][0-9a-f]';
              q_term += segment;
            }
          }
          q_term += '(' + re_sym + ')*)';
        }
      }
    }
    //get the variance
    matches = query.match(new RegExp(q_var,'g'));
    if (matches) fuzz = matches.toString().slice(1)*1;
    //this gets all symbols with or without location
    fsw_pattern = q_sym + q_coord;
    matches = query.match(new RegExp(fsw_pattern,'g'));
    if (matches){
      for(i=0; i<matches.length; i++) {
        part = matches[i].toString();
        base = part.slice(1,4);
        segment = 'S' + base;
        fill = part.slice(4,5);
        if (fill=='u') {
          segment += '[0-5]';
        } else {
          segment += fill;
        }
        rotate = part.slice(5,6);
        if (rotate=='u') {
          segment += '[0-9a-f]';
        } else {
          segment += rotate;
        }
        if (part.length>6){
          x = part.slice(6,9)*1;
          y = part.slice(10,13)*1;
          //now get the x segment range+++
          segment += this.range((x-fuzz),(x+fuzz));
          segment += 'x';
          segment += this.range((y-fuzz),(y+fuzz));
        } else {
          segment += re_coord;
        }
        //now I have the specific search symbol
        // add to general ksw word
        segment = re_word + segment + '(' + re_sym + re_coord + ')*';
        if (term) {
          segment = q_term + segment;
        } else {
          segment = re_term + "?" + segment;
        }
        segments.push(segment);
      }
    }
    //this gets all ranges
    fsw_pattern = q_range + q_coord;
    matches = query.match(new RegExp(fsw_pattern,'g'));
    if (matches){
      for(i=0; i<matches.length; i++) {
        part = matches[i].toString();
        from = part.slice(1,4);
        to = part.slice(5,8);
        re_range = this.range(from,to,"hex");
        segment = 'S' + re_range + '[0-5][0-9a-f]';
        if (part.length>8){
          x = part.slice(8,11)*1;
          y = part.slice(12,15)*1;
          //now get the x segment range+++
          segment += this.range((x-fuzz),(x+fuzz));
          segment += 'x';
          segment += this.range((y-fuzz),(y+fuzz));
        } else {
          segment += re_coord;
        }
        // add to general ksw word
        segment = re_word + segment + '(' + re_sym + re_coord + ')*';
        if (term) {
          segment = q_term + segment;
        } else {
          segment = re_term + "?" + segment;
        }
        segments.push(segment);
      }
    }
    if (!segments.length){
      segments.push(q_term + re_word);
    }
    return segments;
  },
  results: function (query,text,lane){
    if (!text) {return [];}
    if("BLMR".indexOf(lane) === -1 || lane.length>1) {
      lane='';
    }
    var pattern, matches, parts, words;
    var re = this.regex(query);
    if (!re) {return [];}
    for(var i=0; i<re.length; i++) {
      pattern = re[i];
      matches = text.match(new RegExp(pattern,'g'));
      if (matches){
        text = matches.join(' ');
      } else {
        text ='';
      }
    }
    if (text){
      if (lane){
        text = text.replace(/B/g,lane);
        text = text.replace(/L/g,lane);
        text = text.replace(/M/g,lane);
        text = text.replace(/R/g,lane);
      }
      parts = text.split(' ');
      words = parts.filter(function(element) {
        return element in this ? false : this[element] = true;
      }, {});
    } else {
      words = [];
    }
    return words;
  },
  lines: function (query,text,lane){
    if (!text) {return [];}
    if("BLMR".indexOf(lane) === -1 || lane.length>1) {
      lane='';
    }
    var pattern, matches, parts, words;
    var re = this.regex(query);
    if (!re) {return [];}
    for(var i=0; i<re.length; i++) {
      pattern = re[i];
      pattern = '^' + pattern + '.*';
      matches = text.match(new RegExp(pattern,'mg'));
      if (matches){
        text = matches.join("\n");
      } else {
        text ='';
      }
    }
    if (text){
      if (lane){
        text = text.replace(/B/g,lane);
        text = text.replace(/L/g,lane);
        text = text.replace(/M/g,lane);
        text = text.replace(/R/g,lane);
      }
      parts = text.split("\n");
      words = parts.filter(function(element) {
        return element in this ? false : this[element] = true;
      }, {});
    } else {
      words = [];
    }
    return words;
  },
  convert: function (fsw,flags){
    // update to new set of flags
    // A - exact symbol in temporal prefix
    // a - general symbol in temporal prefix
    // S - exact symbol in spatial signbox
    // s - general symbol in spatial signbox
    // L - spatial signbox symbol at location
    var i,query = '';
    if (this.fsw(fsw)){
      if (/^[Aa]?([Ss]L?)?$/.test(flags)){
        var re_base = 'S[123][0-9a-f]{2}';
        var re_sym = re_base + '[0-5][0-9a-f]';
        var re_coord = '[0-9]{3}x[0-9]{3}';
        var matches,matched;

        if (flags.indexOf('A') > -1 || flags.indexOf('a') > -1) {
          //exact symbols or general symbols in order
          matches = fsw.match(new RegExp('A(' + re_sym + ')*','g'));
          if (matches){
            matched = matches[0];
            if (flags.indexOf('A') > -1) {
              query += matched + "T";
            } else {
              matches = matched.match(new RegExp(re_base,'g'));
              query += "A";
              for(i=0; i<matches.length; i++) {
                query += matches[i] + "uu";
              }
              query += "T";
            }
          }
        }

        if (flags.indexOf('S') > -1 || flags.indexOf('s') > -1) {
          //exact symbols or general symbols in spatial
          matches = fsw.match(new RegExp(re_sym + re_coord,'g'));
          if (matches){
            for(i=0; i<matches.length; i++) {
              if (flags.indexOf('S') > -1) {
                query += matches[i].slice(0,6);
              } else {
                query += matches[i].slice(0,4) + "uu";
              }
              if (flags.indexOf('L') > -1) {
                query += matches[i].slice(6,13);
              }
            }
          }
        }
      }
    }
    return query?"Q" + query:'';
  }
};
