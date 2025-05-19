const {formatJson} = require("../resources/jsonFormatter.js")

const inputRmsValues = {
	"ZeraActualValues" : {
		"1040" : 
      { "ACT_RMSPN1" : 225, "ACT_RMSPN2" : 235, "ACT_RMSPN3" : 230, "ACT_RMSPN4" : 1, "ACT_RMSPN5" : 0.9, "ACT_RMSPN6" : 2},
		"1050" : 
      {"ACT_DFTPN1" : "325.269;250", "ACT_DFTPN2" : "305;0", "ACT_DFTPN3" : "315;0"}
	}	
};
const expectedRMSOutput = {
  ZeraActValues: {
    "UPN": { L1: 225, L2: 235, L3: 230, Unit: "V"},
    "∠U" : { L1: 37.54568562957091, L2: 0, L3: 0, Unit: "°" },
    "I"  : { L1: 1, L2: 0.9, L3: 2, Unit: "A"}
  }
};

const inputLambdaValues = {
	"ZeraActualValues" : {
		"1140" : 
      { "ACT_Lambda1" : "1.5", "ACT_Lambda2" : "1", "ACT_Lambda3" : "0.8", "ACT_Lambda4" : "1",
        "ACT_Load1"   : "Ind", "ACT_Load2" : "","ACT_Load3" : "Cap", "ACT_Load4" : ""
      }
	}	
};

const expectedLambdaOutput = {
  ZeraActValues: {
    "λ": { L1: "1.5Ind", L2: "1", L3: "0.8Cap", Sum:"1"}
  }
};


describe('formatJson', () => {
  test('format JSON RMS DFT values', () => {
    expect(formatJson(inputRmsValues)).toEqual(expectedRMSOutput);
  });
  test('format JSON Lambda values', () => {
    expect(formatJson(inputLambdaValues)).toEqual(expectedLambdaOutput);
  });
});
