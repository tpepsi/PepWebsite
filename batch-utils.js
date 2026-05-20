function splitBatchCodes(batchText){

  return batchText
    .split(/[,\n]/)
    .map(code => code.trim())
    .filter(code => code.length > 0);

}

function parseBatchCode(code){

  code = code.trim();

  if(!code){

    return {

      operator: "INVALID",

      mfgDate: "INVALID",

      quantity: "INVALID"

    };

  }

  let match =
    code.match(/^([A-Za-z]+)(\d{6})--(\d+)$/);

  if(match){

    return {

      operator: match[1],

      mfgDate: match[2],

      quantity: match[3]

    };

  }

  match =
    code.match(/^(\d{6})--(\d+)$/);

  if(match){

    return {

      operator: "NA",

      mfgDate: match[1],

      quantity: match[2]

    };

  }

  match =
    code.match(/^([A-Za-z]+)--(\d+)$/);

  if(match){

    return {

      operator: match[1],

      mfgDate: "NA",

      quantity: match[2]

    };

  }

  return {

    operator: "INVALID",

    mfgDate: "INVALID",

    quantity: "INVALID"

  };

}

function wrapBatchCode(batchText){

  const batchList = splitBatchCodes(batchText);

  const lines = [];

  for(let i = 0; i < batchList.length; i += 4){

    lines.push(
      batchList.slice(i, i + 4).join(", ")
    );

  }

  return lines.join("<br>");

}

function formatBatchForExport(batchText){

  const batchList =
    splitBatchCodes(
      batchText.replace(/\n/g, ",")
    );

  const lines = [];

  for(let i = 0; i < batchList.length; i += 4){

    lines.push(
      batchList.slice(i, i + 4).join(", ")
    );

  }

  return lines.join("\n");

}
