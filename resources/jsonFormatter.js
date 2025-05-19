const entities = {
  RMS: 1040,
  DFT: 1050,
  THDR: 1111,
  Lambda: 1140,
  Power1: 1070,
  Power2: 1071,
  Power3: 1072,
  Power4: 1073,
  Range: 1020,
  VoltBurden: 1161,
  CurrBurden: 1160
};

function formatJson(json) {
  const result = {};
  const contentsets = Object.keys(json);
  for (const content of contentsets) {
    if (content === "ZeraActualValues")
      result["ZeraActValues"] = appendActualValues(json[content]);
    else if (content === "ZeraBurden")
      result["ZeraBurden"] = appendBurdenValues(json[content]);
    else if (content === "ZeraComparison")
      result["ZeraComparison"] = appendComparisonMeas(json[content]);
    else if (content === "ZeraCurves")
      result["ZeraCurves"] = appendSampleValues(json[content]);
    else if (content === "ZeraHarmonics")
      result["ZeraHarmonics"] = appendHarmonicValues(json[content]);
    else if (content === "ZeraTransformer")
      result["ZeraTransformer"] = appendTransformerValues(json[content]);
  }
  return result;
}

function appendActualValues(contentJson) {
  const actValuesJson = {};
  //Check all sessions 
 
  var json = {};
  if(entities.RMS in contentJson) {
    let rmsJson = contentJson[entities.RMS]
    if ("ACT_RMSPN1" in rmsJson) json.L1 = rmsJson.ACT_RMSPN1;
    if ("ACT_RMSPN2" in rmsJson) json.L2 = rmsJson.ACT_RMSPN2;
    if ("ACT_RMSPN3" in rmsJson) json.L3 = rmsJson.ACT_RMSPN3;
    if (Object.keys(json).length > 0) {
      json.Unit = "V"; // scale
      actValuesJson["UPN"] = json;
    }
    json = {};
    if ("ACT_RMSPP1" in rmsJson) json.L1 = rmsJson.ACT_RMSPP1;
    if ("ACT_RMSPP2" in rmsJson) json.L2 = rmsJson.ACT_RMSPP2;
    if ("ACT_RMSPP3" in rmsJson) json.L3 = rmsJson.ACT_RMSPP3;
    if (Object.keys(json).length > 0) {
      json.Unit = "V";
      actValuesJson["UPP"] = json;
    }
  }
  if(entities.DFT in contentJson) {
    json = {};
    let dftJson = contentJson[entities.DFT]
    if ("ACT_DFTPN1" in dftJson) json.L1 = calculateAngles(dftJson.ACT_DFTPN1);
    if ("ACT_DFTPN2" in dftJson) json.L2 = calculateAngles(dftJson.ACT_DFTPN2);
    if ("ACT_DFTPN3" in dftJson) json.L3 = calculateAngles(dftJson.ACT_DFTPN3);
    if (Object.keys(json).length > 0) {
      json.Unit = "°";
      actValuesJson["∠U"] = json;
    }
  }
  if(entities.THDR in contentJson) {
    json = {};
    let THDRJson = contentJson[entities.THDR]
    if ("ACT_THDR1" in THDRJson) json.L1 = THDRJson.ACT_THDR1;
    if ("ACT_THDR2" in THDRJson) json.L2 = THDRJson.ACT_THDR2;
    if ("ACT_THDR3" in THDRJson) json.L3 = THDRJson.ACT_THDR3;
    if (Object.keys(json).length > 0) {
      json.Unit = "%";
      actValuesJson["THD U"] = json;
    }
  }
  if(entities.RMS in contentJson) {
    json = {};
    let rmsJson = contentJson[entities.RMS]
    if ("ACT_RMSPN4" in rmsJson) json.L1 = rmsJson.ACT_RMSPN4;
    if ("ACT_RMSPN5" in rmsJson) json.L2 = rmsJson.ACT_RMSPN5;
    if ("ACT_RMSPN6" in rmsJson) json.L3 = rmsJson.ACT_RMSPN6;
    if (Object.keys(json).length > 0) {
      json.Unit = "A";
      actValuesJson["I"] = json;
    }
  }
  if(entities.DFT in contentJson) {
    json = {};
    let dftJson = contentJson[entities.DFT]
    if ("ACT_DFTPN4" in dftJson) json.L1 = calculateAngles(dftJson.ACT_DFTPN4);
    if ("ACT_DFTPN5" in dftJson) json.L2 = calculateAngles(dftJson.ACT_DFTPN5);
    if ("ACT_DFTPN6" in dftJson) json.L3 = calculateAngles(dftJson.ACT_DFTPN6);
    if (Object.keys(json).length > 0) {
      json.Unit = "°";
      actValuesJson["∠I"] = json;
    }
  }
  if(entities.THDR in contentJson) {
    json = {};
    let THDRJson = contentJson[entities.THDR]
    if ("ACT_THDR4" in THDRJson) json.L1 = THDRJson.ACT_THDR4;
    if ("ACT_THDR5" in THDRJson) json.L2 = THDRJson.ACT_THDR5;
    if ("ACT_THDR6" in THDRJson) json.L3 = THDRJson.ACT_THDR6;
    if (Object.keys(json).length > 0) {
      json.Unit = "%";
      actValuesJson["THD I"] = json;
    }    
  }
  // ∠UI is calculated 
  if(entities.DFT in contentJson) { 
    json = {};
    let dftJson = contentJson[entities.DFT]
    if ("ACT_DFTPN1" && "ACT_DFTPN4" in dftJson) json.L1 = displayAngles(calculateAngles(dftJson.ACT_DFTPN4) - calculateAngles(dftJson.ACT_DFTPN1))
    if ("ACT_DFTPN2" && "ACT_DFTPN5" in dftJson) json.L2 = displayAngles(calculateAngles(dftJson.ACT_DFTPN5) - calculateAngles(dftJson.ACT_DFTPN2))
    if ("ACT_DFTPN3" && "ACT_DFTPN6" in dftJson) json.L3 = displayAngles(calculateAngles(dftJson.ACT_DFTPN6) - calculateAngles(dftJson.ACT_DFTPN3))
    if (Object.keys(json).length > 0) {
      json.Unit = "°";
      actValuesJson["∠UI"] = json;
    }
  }
  if(entities.Lambda in contentJson) {
    json = {};
    let LambdaJson = contentJson[entities.Lambda]
    if ("ACT_Lambda1" in LambdaJson) json.L1 = LambdaJson.ACT_Lambda1 + LambdaJson.ACT_Load1;
    if ("ACT_Lambda2" in LambdaJson) json.L2 = LambdaJson.ACT_Lambda2 + LambdaJson.ACT_Load2;
    if ("ACT_Lambda3" in LambdaJson) json.L3 = LambdaJson.ACT_Lambda3 + LambdaJson.ACT_Load3;
    if ("ACT_Lambda4" in LambdaJson) json.Sum = LambdaJson.ACT_Lambda4 + LambdaJson.ACT_Load4;
    if (Object.keys(json).length > 0)
      actValuesJson["λ"] = json;
  }
  if(entities.Power1 in contentJson) { //P
    json = {};
    let powerJson = contentJson[entities.Power1]
    if ("ACT_PQS1" in powerJson) json.L1 = powerJson.ACT_PQS1;
    if ("ACT_PQS2" in powerJson) json.L2 = powerJson.ACT_PQS2;
    if ("ACT_PQS3" in powerJson) json.L3 = powerJson.ACT_PQS3;
    if ("ACT_PQS4" in powerJson) json.Sum = powerJson.ACT_PQS4;
    if (Object.keys(json).length > 0) {
      json.Unit = "W"; //?
      actValuesJson["("+powerJson.PAR_MeasuringMode+") " + powerJson.ACT_PowerDisplayName] = json;
    }
  }
  if(entities.Power2 in contentJson) { //Q
    json = {};
    let powerJson = contentJson[entities.Power2]
    if ("ACT_PQS1" in powerJson) json.L1 = powerJson.ACT_PQS1;
    if ("ACT_PQS2" in powerJson) json.L2 = powerJson.ACT_PQS2;
    if ("ACT_PQS3" in powerJson) json.L3 = powerJson.ACT_PQS3;
    if ("ACT_PQS4" in powerJson) json.Sum = powerJson.ACT_PQS4;
    if (Object.keys(json).length > 0) {
      json.Unit = "Var";
      actValuesJson["("+powerJson.PAR_MeasuringMode+") " + powerJson.ACT_PowerDisplayName] = json;
    }
  }
  if(entities.Power3 in contentJson) { //S
    json = {};
    let powerJson = contentJson[entities.Power3]
    if ("ACT_PQS1" in powerJson) json.L1 = powerJson.ACT_PQS1;
    if ("ACT_PQS2" in powerJson) json.L2 = powerJson.ACT_PQS2;
    if ("ACT_PQS3" in powerJson) json.L3 = powerJson.ACT_PQS3;
    if ("ACT_PQS4" in powerJson) json.Sum = powerJson.ACT_PQS4;
    if (Object.keys(json).length > 0) {
      json.Unit = "VA";
      actValuesJson["("+powerJson.PAR_MeasuringMode+") " +powerJson.ACT_PowerDisplayName] = json;
    }
  }
  if(entities.Range in contentJson) {
    json = {};
    let rangeJson = contentJson[entities.Range]
    if ("ACT_Frequency" in rangeJson) json.Sum = rangeJson.ACT_Frequency;
    if (Object.keys(json).length > 0) {
      json.Unit = "Hz";
      actValuesJson["F"] = json;
    }
  }
  return actValuesJson;
}

function calculateAngles(vector) {
  if (typeof vector !== 'string') {
    throw new TypeError('Expected a string in format "x;y"');
  }
  if(!vector.includes(";")){
    throw new TypeError('Expected a ;');
  }
  const tmpVector = vector.split(";").map(Number);
  let vectorAngle = Math.atan2(tmpVector[1], tmpVector[0]) * 180 / Math.PI;
  
  if (vectorAngle < 0) {
    vectorAngle += 360;
  }
  return vectorAngle;
}

function displayAngles(angle) {
  if(angle > 180) //display as negative
    angle -= 360;
  else if(angle < -180) //display as positive
    angle += 360;
  return angle;
}

function appendBurdenValues(contentJson) {
  const burdenValuesJson = {};

  var json = {};
  if(entities.RMS in contentJson) {
    let rmsJson = contentJson[entities.RMS]
    if ("ACT_RMSPN1" in rmsJson) json.BurdenL1 = rmsJson.ACT_RMSPN1;
    if ("ACT_RMSPN2" in rmsJson) json.BurdenL2 = rmsJson.ACT_RMSPN2;
    if ("ACT_RMSPN3" in rmsJson) json.BurdenL3 = rmsJson.ACT_RMSPN3;
    if (Object.keys(json).length > 0) {
      json.Unit = "V"; // scale
      burdenValuesJson["UPN"] = json;
    }
    json = {};
    if ("ACT_RMSPN4" in rmsJson) json.BurdenL1 = rmsJson.ACT_RMSPN4;
    if ("ACT_RMSPN5" in rmsJson) json.BurdenL2 = rmsJson.ACT_RMSPN5;
    if ("ACT_RMSPN6" in rmsJson) json.BurdenL3 = rmsJson.ACT_RMSPN6;
    if (Object.keys(json).length > 0) {
      json.Unit = "A";
      burdenValuesJson["I"] = json;
    }
  }
  //Calculated angle UI

  if(entities.VoltBurden in contentJson) {
    json = {};
    let voltBurdJson = contentJson[entities.VoltBurden]
    if ("ACT_Burden1" in rmsJson) json.BurdenL1 = voltBurdJson.ACT_Burden1;
    if ("ACT_Burden2" in rmsJson) json.BurdenL2 = voltBurdJson.ACT_Burden2;
    if ("ACT_Burden3" in rmsJson) json.BurdenL3 = voltBurdJson.ACT_Burden3;
    if (Object.keys(json).length > 0) {
      json.Unit = "VA";
      burdenValuesJson["Sb"] = json;
    }
    json = {};
    if ("ACT_PFactor1" in rmsJson) json.BurdenL1 = voltBurdJson.ACT_PFactor1;
    if ("ACT_PFactor2" in rmsJson) json.BurdenL2 = voltBurdJson.ACT_PFactor2;
    if ("ACT_PFactor3" in rmsJson) json.BurdenL3 = voltBurdJson.ACT_PFactor3;
    if (Object.keys(json).length > 0)
      burdenValuesJson["cos(ß)"] = json;
    json = {};
    if ("ACT_Ratio1" in rmsJson) json.BurdenL1 = voltBurdJson.ACT_Ratio1;
    if ("ACT_Ratio2" in rmsJson) json.BurdenL2 = voltBurdJson.ACT_Ratio2;
    if ("ACT_Ratio3" in rmsJson) json.BurdenL3 = voltBurdJson.ACT_Ratio3;
    if (Object.keys(json).length > 0) {
      json.Unit = "%";
      burdenValuesJson["Sn"] = json;
    }
  }
}

function appendHarmonicValues(contentJson) {

}

function appendSampleValues(contentJson) {

}

function appendComparisonMeas(contentJson) {

}

function appendTransformerValues(contentJson) {

}

try {
  window.formatJson = formatJson
} catch {
  module.exports = { formatJson }
}

