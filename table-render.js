function getDisplayFields(record){

  if(record.rawCode){

    const parsed =
      parseBatchCode(record.rawCode);

    return {

      operator: parsed.operator,

      date: parsed.mfgDate,

      qty: parsed.quantity

    };

  }

  const parsed =
    parseBatchCode(record.batch || "");

  if(
    parsed.operator !== "INVALID"
    || parsed.mfgDate !== "INVALID"
    || parsed.quantity !== "INVALID"
  ){

    return {

      operator: parsed.operator,

      date: parsed.mfgDate,

      qty: parsed.quantity

    };

  }

  return {

    operator: record.operator || "NA",

    date: record.date || "NA",

    qty: record.qty || "NA"

  };

}

function getRecordsTableHeadHTML(){

  return `

    <thead>

      <tr>

        <th class="col-shrink col-invoice">Invoice</th>

        <th class="col-fill col-item">Item</th>

        <th class="col-shrink col-op">Operator</th>

        <th class="col-shrink col-date">Date</th>

        <th class="col-shrink col-qty">Qty</th>

        <th class="col-shrink col-combine">Combine</th>

        <th class="col-shrink col-action">Action</th>

      </tr>

    </thead>

  `;

}

function buildRecordRowHTML(record, options){

  const display = getDisplayFields(record);

  const index = options.index;

  const deleteCall =
    `${options.deleteHandler}(${index})`;

  return `

    <tr>

      <td class="col-shrink col-invoice">${record.invoice || ""}</td>

      <td class="col-fill col-item">${record.item || ""}</td>

      <td class="col-shrink col-op">${display.operator}</td>

      <td class="col-shrink col-date">${display.date}</td>

      <td class="col-shrink col-qty">${display.qty}</td>

      <td class="col-shrink col-combine">${record.combine || ""}</td>

      <td class="col-shrink col-action action-cell">

        <button
          type="button"
          class="delete-btn"
          onclick="${deleteCall}"
        >
          Delete
        </button>

      </td>

    </tr>

  `;

}

function filterRecords(records, filters){

  const invoice =
    (filters.invoice || "").toLowerCase().trim();

  const item =
    (filters.item || "").toLowerCase().trim();

  const operator =
    (filters.operator || "").toLowerCase().trim();

  const keyword =
    (filters.keyword || "").toLowerCase().trim();

  return records.filter(record => {

    const display = getDisplayFields(record);

    if(invoice && !record.invoice.toLowerCase().includes(invoice)){

      return false;

    }

    if(item && !record.item.toLowerCase().includes(item)){

      return false;

    }

    if(operator && !display.operator.toLowerCase().includes(operator)){

      return false;

    }

    if(keyword){

      const haystack = [

        record.invoice,

        record.item,

        display.operator,

        display.date,

        record.combine || ""

      ].join(" ").toLowerCase();

      if(!haystack.includes(keyword)){

        return false;

      }

    }

    return true;

  });

}

function renderRecordsTableBody(tbodyId, data, options){

  const body = document.getElementById(tbodyId);

  if(!body) return;

  body.innerHTML = "";

  data.forEach((record, index) => {

    body.innerHTML += buildRecordRowHTML(record, {

      index: options.getDeleteIndex(record, index),

      deleteHandler: options.deleteHandler

    });

  });

}

function createRecordFromBatch(invoice, deliveryDate, item, code){

  const parsed = parseBatchCode(code);

  return {

    invoice,

    deliveryDate,

    item,

    operator: parsed.operator,

    date: parsed.mfgDate,

    qty: parsed.quantity,

    rawCode: code,

    combine: `${parsed.quantity}--${invoice}`

  };

}
