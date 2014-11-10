var assert = chai.assert;

// .key()
suite('.key( )', function(){
  suite('Valid', function(){
    test('should return valid key when present', function(){
      assert.equal(sw10.key("S10000"),"S10000");
      assert.equal(sw10.key("S38b5f"),"S38b5f");
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid keys', function(){
      assert.equal(sw10.key("S1000"),'');
      assert.equal(sw10.key("S4005f"),'');
    });
  });
});

// .fsw()
suite('.fsw( )', function(){
  suite('Valid', function(){
    test('should return FSW string when present', function(){
      assert.equal(sw10.fsw("M500x500"),"M500x500");
      assert.equal(sw10.fsw("AS10000M505x510S10000490x480"),"AS10000M505x510S10000490x480");
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid FSW strings', function(){
      assert.equal(sw10.fsw("Q500x500"),'');
      assert.equal(sw10.fsw("505x510S10000490x480"),'');
    });
  });
});

// .code()
suite('.code( )', function(){
  suite('Valid', function(){
    test('should return valid code on plane 16 for key', function(){
      assert.equal(sw10.code("S10000"),'􀀁');
      assert.equal(sw10.code("S38b5f"),'􏒀');
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid keys', function(){
      assert.equal(sw10.code("S1000"),'');
      assert.equal(sw10.code("S4005f"),'');
    });
  });
});

// .uni8()
suite('.uni8( )', function(){
  suite('Valid', function(){
    test('should return 1 to 3 Unicode 8 characters for key', function(){
      assert.equal(sw10.uni8("S10000"),'𝠀');
      assert.equal(sw10.uni8("S38b5f"),'𝪋𝪟𝪯');
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid keys', function(){
      assert.equal(sw10.uni8("S1000"),'');
      assert.equal(sw10.uni8("S4005f"),'');
    });
  });
});

// .pua()
suite('.pua( )', function(){
  suite('Valid', function(){
    test('should return 3 Unicode characters on plane 15 for key', function(){
      assert.equal(sw10.pua("S10000"),'󽠰󽠐󽠠');
      assert.equal(sw10.pua("S38b5f"),'󽪻󽠕󽠯');
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid keys', function(){
      assert.equal(sw10.pua("S1000"),'');
      assert.equal(sw10.pua("S4005f"),'');
    });
  });
});

// .bbox()
suite('.bbox( )', function(){
  suite('Valid FSW', function(){
    test('should return x-min x-max y-min y-max', function(){
      assert.equal(sw10.bbox("500x500"),'500 500 500 500');
      assert.equal(sw10.bbox("500x550 550x500"),'500 550 500 550');
    });
  });
  suite('Valid Coordinates', function(){
    test('should return x-min x-max y-min y-max', function(){
      assert.equal(sw10.bbox("550x550"),'500 550 500 550');
      assert.equal(sw10.bbox("440x660 550x330"),'440 550 330 660');
    });
  });
  suite('Invalid', function(){
    test('should return 500 for each x-min x-max y-min y-max', function(){
      assert.equal(sw10.bbox(""),'500 500 500 500');
      assert.equal(sw10.bbox("500x50"),'500 500 500 500');
      assert.equal(sw10.bbox("00x500"),'500 500 500 500');
    });
  });
});

// .size()
suite('.size( )', function(){
  suite('Valid FSW', function(){
    test('should return size of sign', function(){
      assert.equal(sw10.size('S10000'),'15x30');
      assert.equal(sw10.size('S38b00'),'60x15');
    });
  });
  suite('Valid Key', function(){
    test('should return size of key', function(){
      assert.equal(sw10.size('S10000'),'15x30');
      assert.equal(sw10.size('S38b00'),'60x15');
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid keys', function(){
      assert.equal(sw10.size('S1000'),'');
      assert.equal(sw10.size('S38b5f'),'');
    });
  });
});


// .svg()

// .canvas()

// .png()

// .is()

// .random()

// .query()
suite('.query( )', function(){
  suite('Valid', function(){
    test('should return query string when present', function(){
      assert.equal(sw10.query("Q"),"Q");
      assert.equal(sw10.query("QT"),"QT");
      assert.equal(sw10.query("QAS100uuT"),"QAS100uuT");
      assert.equal(sw10.query("QS10000"),"QS10000");
      assert.equal(sw10.query("QR100t120"),"QR100t120");
      assert.equal(sw10.query("QS10000500x500"),"QS10000500x500");
      assert.equal(sw10.query("QR100t120500x500"),"QR100t120500x500");
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid query strings', function(){
      assert.equal(sw10.query("M500x500"),'');
      assert.equal(sw10.query("505x510S10000490x480"),'');
      assert.equal(sw10.query("qrti"),'');
    });
  });
});

// .range()
suite('.range( )', function(){
  suite('Decimal', function(){
    test('should return regular expression for range', function(){
      assert.equal(sw10.range(250,400),'((2[5-9][0-9])|(3[0-9][0-9])|(400))');
      assert.equal(sw10.range(277,429),'((27[7-9])|(2[89][0-9])|(3[0-9][0-9])|(4[01][0-9])|(42[0-9]))');
    });
  });
  suite('Hex', function(){
    test('should return regular expression for range', function(){
      assert.equal(sw10.range(250,400,true),'((2[5-9a-f][0-9a-f])|(3[0-9a-f][0-9a-f])|(400))');
      assert.equal(sw10.range(277,429,true),'((27[7-9a-f])|(2[89a-f][0-9a-f])|(3[0-9a-f][0-9a-f])|(4[01][0-9a-f])|(42[0-9]))');
    });
  });
});

// .regex()
suite('.regex( )', function(){
  suite('Valid', function(){
    test('should return regular expression for query string', function(){
      assert.equal(sw10.regex("Q")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","A");
      assert.equal(sw10.regex("QT")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","A");
      assert.equal(sw10.regex("QS10000")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000[0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","A");
      assert.equal(sw10.regex("QTS10000")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000[0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","B");
      assert.equal(sw10.regex("QAS100uuR100t204T")[0],"(AS100[0-5][0-9a-f]S((1[0-9a-f][0-9a-f])|(20[0-4]))[0-5][0-9a-f](S[123][0-9a-f]{2}[0-5][0-9a-f])*)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","C");
      assert.equal(sw10.regex("QR100t120")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S((1[01][0-9a-f])|(120))[0-5][0-9a-f][0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","D");
      assert.equal(sw10.regex("QS10000500x500")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000((4[89][0-9])|(5[01][0-9])|(520))x((4[89][0-9])|(5[01][0-9])|(520))(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","E");
      assert.equal(sw10.regex("QS10000500x500V10")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000((49[0-9])|(50[0-9])|(510))x((49[0-9])|(50[0-9])|(510))(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","F");
      assert.equal(sw10.regex("QR100t120500x500S20500")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S20500[0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","G");
      assert.equal(sw10.regex("QR100t120500x500S20500")[1],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S((1[01][0-9a-f])|(120))[0-5][0-9a-f]((4[89][0-9])|(5[01][0-9])|(520))x((4[89][0-9])|(5[01][0-9])|(520))(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","H");
      assert.equal(sw10.regex("QAS10000R100t204S20500T")[0],"(AS10000S((1[0-9a-f][0-9a-f])|(20[0-4]))[0-5][0-9a-f]S20500(S[123][0-9a-f]{2}[0-5][0-9a-f])*)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*");
    });
  });
  suite('Invalid', function(){
    test('should return empty string for invalid query strings', function(){
      assert.equal(sw10.regex("M500x500"),'');
      assert.equal(sw10.regex("505x510S10000490x480"),'');
      assert.equal(sw10.regex("qrti"),'');
    });
  });
});
