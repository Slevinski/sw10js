/**
* SignWriting 2010 JavaScript Library v1.0
* Copyright (c) 2007-2014, Stephen E Slevinski Jr
* sw10.js is released under the MIT License.
* http://www.opensource.org/licenses/mit-license.php
*/
 var sw10 = signwriting_2010 = {
  key: function(text){
    var key = text.match(/S[123][0-9a-f]{2}[0-5][0-9a-f]([0-9]{3}x[0-9]{3})?/g);
    if (!key) {
      return '';
    } else {
      return key[0];
    }
  },
  fsw: function(text){
    var fsw = text.match(/(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*|S38[7-9ab][0-5][0-9a-f][0-9]{3}x[0-9]{3}/);
    if (!fsw) {
      return '';
    } else {
      return fsw[0];
    }
  },
  is: function(key,type){
    if (!this.size(key)) return '';
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
    var char = key.slice(1,4);
    return (parseInt(start,16)<=parseInt(char,16) && parseInt(end,16)>=parseInt(char,16)); 
  },
  random: function (type) {
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
  code: function(key){
    key = this.key(key);
    if (!key) return '';
    var code = 0x100000 + ((parseInt(key.slice(1,4),16) - 256) * 96) + ((parseInt(key.slice(4,5),16))*16) + parseInt(key.slice(5,6),16) + 1;
    return String.fromCharCode(0xD800 + ((code - 0x10000) >> 10), 0xDC00 + ((code - 0x10000) & 0x3FF));
  },
  uni8: function(key){
    key = this.key(key);
    if (!key) return '';
    var base = parseInt(key.substr(1,3),16) + parseInt('1D700',16);
    var uni8 = String.fromCharCode(0xD800 + ((base - 0x10000) >> 10), 0xDC00 + ((base - 0x10000) & 0x3FF));
    var fill = key.substr(4,1);
    if (fill!="0"){
      fill = parseInt(fill,16) + parseInt('1DA9A',16);
      uni8 += String.fromCharCode(0xD800 + ((fill - 0x10000) >> 10), 0xDC00 + ((fill - 0x10000) & 0x3FF));
    }
    var rotation = key.substr(5,1);
    if (rotation!="0"){
      rotation = parseInt(rotation,16) + parseInt('1DAA0',16);
      uni8 += String.fromCharCode(0xD800 + ((rotation - 0x10000) >> 10), 0xDC00 + ((rotation - 0x10000) & 0x3FF));
    }
    return uni8;
  },
  pua: function(key){
    key = this.key(key);
    if (!key) return '';
    var base = parseInt(key.substr(1,3),16) + parseInt('FD730',16);
    var pua = String.fromCharCode(0xD800 + ((base - 0x10000) >> 10), 0xDC00 + ((base - 0x10000) & 0x3FF));
    var fill = key.substr(4,1);
    fill = parseInt(fill,16) + parseInt('FD810',16);
    pua += String.fromCharCode(0xD800 + ((fill - 0x10000) >> 10), 0xDC00 + ((fill - 0x10000) & 0x3FF));
    var rotation = key.substr(5,1);
    rotation = parseInt(rotation,16) + parseInt('FD820',16);
    pua += String.fromCharCode(0xD800 + ((rotation - 0x10000) >> 10), 0xDC00 + ((rotation - 0x10000) & 0x3FF));
    return pua;
  },
  bbox: function(fsw) {
    var rcoord = /[0-9]{3}x[0-9]{3}/g;
    var x,y,x1=500,x2=500,y1=500,y2=500;
    var coords = fsw.match(rcoord);
    if (coords){
      for (var i=0; i < coords.length; i++) {
        x = parseInt(coords[i].slice(0, 3));
        y = parseInt(coords[i].slice(4, 7));
        x1 = Math.min(x1, x);
        x2 = Math.max(x2, x);
        y1 = Math.min(y1, y);
        y2 = Math.max(y2, y);
      }
    }
    return x1 + ' ' + x2 + ' ' + y1 + ' ' + y2;
  },
  size: function(text) {
    var size,fsw = this.fsw(text);
    if (fsw) {
      var bbox = this.bbox(fsw);
      bbox = bbox.split(' ');
      x1 = bbox[0];
      x2 = bbox[1];
      y1 = bbox[2];
      y2 = bbox[3];
      size = (x2-x1) + 'x' + (y2-y1);
      if (size=='0x0') return '';
      return size;
    }
    var key = this.key(text);
    if (!key) return '';

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
    for (var w=bound-1;w>=0;w--){
      for (var h=0;h<bound;h++){
        for (var s=0;s<4;s++){
          i=w*4+(h*4*bound) +s;
          if (imgData[i]){
            break wloop;
          }
        }
      }
    }
    var width = w;
    hloop:
    for (var h=bound-1;h>=0;h--){
      for (var w=0;w<width;w++){
        for (var s=0;s<4;s++){
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
    //rounding error appears in chrome, could be FontForge, Potrace, or TrueType based
    if ('S1710d S1711d S1712d S17311 S17321 S17733 S1773f S17743 S1774f S17753 S1775f'.indexOf(key)>-1){
      width = '20';
    }
    if ('S1732f S17731 S17741 S17751'.indexOf(key)>-1){
      height = '20';
    }
    size = width + 'x' + height;
    if (size=='0x0') return '';
    return size;
  },
  svg: function(text,options){
    var fsw = this.fsw(text);
    if (!fsw) {
      var key = this.key(text);
      if (!key) return '';
      if (key.length==6) {
        fsw = key + "500x500";
      } else {
        fsw = key;
      }
    }
    if (!options) options = {};
    if (options.zoom) {
      options.zoom = parseFloat(options.zoom);
    } else {
      options.zoom = 1;
    }
    if (!options.line){
      options.line="black";
    }
    if (!options.fill){
      options.fill="white";
    }
    var r, rsym, rcoord, sym, syms, coords, gelem, o;
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
    x1 = bbox[0];
    x2 = bbox[1];
    y1 = bbox[2];
    y2 = bbox[3];
    syms = fsw.match(rsym);
    for (var i=0; i < syms.length; i++) {
      sym = syms[i].slice(0,6)
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      gelem = '<g transform="translate(' + x + ',' + y + ')">';
      gelem += '<text ';
      if (options.css) {
        gelem += 'class="sym-fill"';
      } else {
        gelem += 'style="font-family:\'SignWriting 2010 Filling\';font-size:30px;fill:' + options.fill + '"';
      }
      gelem += '>' + this.code(sym) + '</text>';
      gelem += '<text ';
      if (options.css) {
        gelem += 'class="sym-line"';
      } else {
        gelem += 'style="font-family:\'SignWriting 2010\';font-size:30px;fill:' + options.line + '"';
      }
      gelem += '>' + this.code(sym) + '</text>';
      gelem += '</g>';
      syms[i] = gelem
    }
    if (k == 'S') {
      if (x1==500 && y1==500){
        var size = this.size(fsw.slice(0,6)).split('x');
        x2 = 500 + parseInt(size[0]);
        y2 = 500 + parseInt(size[1]);
      } else {
        x2 = 1000-x1;
        y2 = 1000-y1;
      }
    }
    w = x2 - x1;
    h = y2 - y1;
    l = o[k] || 0;
    l = l * 75 + x1 - 400;
    var svg = '<svg '
    if (options.zoom!='x') svg += 'width="' + (w * options.zoom) + '" height="' + (h * options.zoom) + '" ';
    svg += 'viewBox="' + x1 + ' ' + y1 + ' ' + w + ' ' + h + '">' + syms.join('') + "</svg>";
    if (options.laned){
      svg = '<div style="padding:10px;position:relative;width:' + w + 'px;height:' + h + 'px;left:' + l + 'px;">' + svg + '</div>';
    }
    return svg;
  },
  canvas: function(text,options){
    var canvas = document.createElement("canvas");
    var fsw = this.fsw(text);
    if (!fsw) {
      var key = this.key(text);
      if (!key) return '';
      if (key.length==6) {
        fsw = key + "500x500";
      } else {
        fsw = key;
      }
    }
    if (!options) options = {};
    if (options.zoom) {
      options.zoom = parseFloat(options.zoom);
    } else {
      options.zoom = 1;
    }
    if (!options.line){
      options.line="black";
    }
    if (!options.fill){
      options.fill="white";
    }
    var r, rsym, rcoord, sym, syms, coords, gelem, o;
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
    x1 = bbox[0];
    x2 = bbox[1];
    y1 = bbox[2];
    y2 = bbox[3];

    if (k == 'S') {
      if (x1==500 && y1==500){
        var size = this.size(fsw.slice(0,6)).split('x');
        x2 = 500 + parseInt(size[0]);
        y2 = 500 + parseInt(size[1]);
      } else {
        x2 = 1000-x1;
        y2 = 1000-y1;
      }
    }

    canvas.width = (x2-x1) * options.zoom;
    canvas.height = (y2-y1) * options.zoom;
    var context = canvas.getContext("2d");
    syms = fsw.match(rsym);
    for (var i=0; i < syms.length; i++) {
      sym = syms[i].slice(0,6)
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      context.font = (30*options.zoom) + "px 'SignWriting 2010 Filling'";
      context.fillStyle = options.fill;
      context.fillText(this.code(sym),((x-x1)*options.zoom),((y-y1)*options.zoom));
      context.font = (30*options.zoom) + "px 'SignWriting 2010'";
      context.fillStyle = options.line;
      context.fillText(this.code(sym),((x-x1)*options.zoom),((y-y1)*options.zoom));
    }
    return canvas;
  },
  png: function (fsw,options){
    if (this.fsw(fsw) || this.key(fsw) ){
      var canvas = this.canvas(fsw,options);
      var png = canvas.toDataURL("image/png");
      canvas.remove();
      return png;
    } else {
      return '';
    }
  },
  query: function (text){
    var query = text.match(/Q((A(S[123][0-9a-f]{2}[0-5u][0-9a-fu]|R[123][0-9a-f]{2}t[123][0-9a-f]{2})+)?T)?((R[123][0-9a-f]{2}t[123][0-9a-f]{2}([0-9]{3}x[0-9]{3})?)|(S[123][0-9a-f]{2}[0-5u][0-9a-fu]([0-9]{3}x[0-9]{3})?))*(V[0-9]+)?/);
    if (query) {
      return query[0];
    } else {
      return '';
    }
  },
  range: function (min,max,hex){
    var pattern, re, diff, tmax, cnt, text, minV, maxV;
    if (!hex) hex='';
    min = ("000" + min).slice(-3);
    max = '' + max;
    pattern='';

    if (min===max) return min;

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
  regex: function (text,fuzz){
    var query = this.query(text);
    if (!query) {
      return '';
    }

    var fsw_pattern, part, from, to, re_range, segment, x, y, base, fill, rotate;
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

    query = sw10.query(query);
    if (!query) return '';

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
        var matches = qat.match(RegExp('(' + q_sym + '|' + q_range + ')','g'));
        if (matches){
          for(var i=0; i<matches.length; i++) {
            var matched = matches[i].match(RegExp(q_sym));
            if (matched){
              segment = matched[0].slice(0,4)
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
              re_range = sw10.range(from,to,'hex');
              segment = 'S' + re_range + '[0-5][0-9a-f]';
              q_term += segment;
            }
	      }
          q_term += '(' + re_sym + ')*)';
	    } else {
	      console.log(qat)
	    }
	  }
	}

    //get the variance
    var matches = query.match(RegExp(q_var,'g'));
    if (matches) fuzz = matches.toString().slice(1)*1;
    //this gets all symbols with or without location
    fsw_pattern = q_sym + q_coord;
    var matches = query.match(RegExp(fsw_pattern,'g'));
    if (matches){

      for(var i=0; i<matches.length; i++) {
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
          segment += sw10.range((x-fuzz),(x+fuzz));
          segment += 'x';
          segment += sw10.range((y-fuzz),(y+fuzz));
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
    var matches = query.match(RegExp(fsw_pattern,'g'));
    if (matches){

      for(var i=0; i<matches.length; i++) {
        part = matches[i].toString();
        from = part.slice(1,4);
        to = part.slice(5,8);
        re_range = sw10.range(from,to,"hex");
        segment = 'S' + re_range + '[0-5][0-9a-f]';
        if (part.length>8){

          x = part.slice(8,11)*1;
          y = part.slice(12,15)*1;
          //now get the x segment range+++
          segment += sw10.range((x-fuzz),(x+fuzz));
          segment += 'x';
          segment += sw10.range((y-fuzz),(y+fuzz));
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
  }
};