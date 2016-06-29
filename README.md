## The SignWriting 2010 JavaScript Library
- - - 
> Version 1.9.1  
June 29th, 2016


SignWriting 2010 is the modern implementation and international specification of the SignWriting script for the internet community that includes TrueType Fonts, CSS Declarations, and a compact JavaScript Library.

- - -

### JavaScript Library
The JavaScript library leverages the TrueType fonts without any additional requirements. Include the "sw10.js" script or the minified version "sw10.min.js" in any HTML page to access the function library. 

> SignWriting 2010 JavaScript Library  
Copyright (c) 2007-2016, Stephen E Slevinski Jr  
Licensed under the MIT License

- [SignWriting 2010 JavaScript Library](http://slevinski.github.io/sw10js)  
- [Guide](http://slevinski.github.io/sw10js/guide.html)  
- [API](http://slevinski.github.io/sw10js/api.html)  
- [Testing](http://slevinski.github.io/sw10js/tests)  

- - -

### TrueType Fonts
>SignWriting 2010 Fonts  
Copyright (c) 1974-2015, Center for Sutton Movement Writing, inc  
Licensed under the SIL Open Font License v1.1

#### Installation
The TrueType Fonts can be installed on Linux, Windows, Mac, and iOS. 

- Reserved Font Name: [SignWriting 2010](https://cdn.rawgit.com/Slevinski/signwriting_2010_fonts/master/fonts/SignWriting%202010.ttf) with [log report](https://cdn.rawgit.com/Slevinski/signwriting_2010_fonts/master/fonts/SignWriting%202010.log)  
- Reserved Font Name: [SignWriting 2010 Filling](https://cdn.rawgit.com/Slevinski/signwriting_2010_fonts/master/fonts/SignWriting%202010%20Filling.ttf) with [log report](https://cdn.rawgit.com/Slevinski/signwriting_2010_fonts/master/fonts/SignWriting%202010%20Filling.log)  

Fonts packaged for iOS: [SignWriting 2010 Configuration Profile](https://cdn.rawgit.com/Slevinski/signwriting_2010_fonts/master/fonts/SignWriting%202010.mobileconfig)

#### CSS Font-Face
The CSS Font-Face declaration works with all systems, regardless if the fonts are installed or not.  Use the CSS below or include the "fonts.css" file in any HTML page to access the TrueType fonts.

When the TrueType fonts are not installed, the CSS Font-Face declaration will cause the browser to automatically download and install the fonts in the browser cache. The fonts are about 13 MB combined so the first page view will experience a slight delay while the fonts are downloaded and installed.  All subsequent page views, regardless of domain, will use the fonts that have already been installed in the browser cache without any additional delay.

When the TrueType fonts are installed on a system, the CSS Font-Face declaration will cause the browser to use the already installed local fonts and will not download the fonts from the URL.  When the fonts are installed, the CSS Font-Face isn't required but neither will it negatively affect performance.

    @font-face {
      font-family: "SignWriting 2010";
      src: 
        local('SignWriting 2010'),
        local('SignWriting_2010'),
        url('https://cdn.rawgit.com/Slevinski/signwriting_2010_fonts/master/fonts/SignWriting%202010.ttf') format('truetype');
    }
    @font-face {
      font-family: "SignWriting 2010 Filling";
      src: 
        local('SignWriting 2010 Filling'),
        local('SignWriting_2010_Filling'),
        url('https://cdn.rawgit.com/Slevinski/signwriting_2010_fonts/master/fonts/SignWriting%202010%20Filling.ttf') format('truetype');
    }

### Version History
* 1.9.1 - Jun 29th, 2016: fixed empty signbox array
* 1.9.0 - Jun 25th, 2016: Added Plane 4 proposal for Unicode 10 as function sw10.uni10
* 1.8.1 - May 9th, 2016: I-D revision 07
* 1.8.0 - Mar 2nd, 2016: signtext function, bbox fix, and general nits
* 1.7.0 - Nov 11th, 2015: styling string, convert flags, and I-D revision 06
* 1.6.2 - Oct 20th, 2015: zoom level x for expanding SVG and general nits
* 1.6.1 - Aug 27th, 2015: background hex value fix
* 1.6.0 - Aug 26th, 2015: added styling string for SVG and PNG
* 1.5.4 - Aug 11th, 2015: function pua fix for plane 15 as 5-char hex values
* 1.5.3 - July 9th, 2015: structure function fix and pua function hexval option
* 1.5.2 - July 8th, 2015: structure function, SVG character options, and trunk centering fix
* 1.5.1 - June 10th, 2015: SVG classes, CSS doc, and Chrome fix
* 1.5.0 - June 4th, 2015: added CSS font-face declaration
* 1.4.7 - May 20th, 2015: updated font links to CDN
* 1.4.6 - May 13th, 2015: update to I-D revision 05, added version history
* 1.4.5 - May 5th, 2015: added github link
* 1.4.4 - Mar 27th, 2015: svg namespace
* 1.4.3 - Mar 23rd, 2015: color hex hash optional
* 1.4.2 - Mar 18th, 2015: repo url update, line results fn
* 1.4.1 - Mar 11th, 2015: style fix
* 1.4.0 - Mar 10th, 2015: text selection update
* 1.3.0 - Feb 19th, 2015: convert fn for FSW to query
* 1.2.4 - Feb 9th, 2015: add class by default
* 1.2.3 - Jan 15th, 2015: fixed norm max and added metadata
* 1.2.2 - Dec 4th, 2014: key and size checks
* 1.2.1 - Nov 14th, 2014: rename fn as fill
* 1.2 - Nov 14th, 2014: new functions
* 1.1 - Nov 12th, 2014: new functions
* 1.0 - Nov 10th, 2014: init
