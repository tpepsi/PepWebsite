const PAGE_SIZE = 20;

let records =
  JSON.parse(localStorage.getItem("records"))
  || [];

let currentPage =
  parseInt(sessionStorage.getItem("recordsPage") || "1", 10);

let displayedRecords = records;

renderTable(records);

function getActiveFilters(){

  return {

    invoice:
      document.getElementById("filterInvoice")?.value || "",

    item:
      document.getElementById("filterItem")?.value || "",

    operator:
      document.getElementById("filterOperator")?.value || "",

    keyword:
      document.getElementById("searchInput")?.value || ""

  };

}

function getFilteredRecords(){

  return filterRecords(records, getActiveFilters());

}

function renderTable(data){

  displayedRecords = data;

  const totalPages =
    Math.max(1, Math.ceil(data.length / PAGE_SIZE));

  if(currentPage > totalPages){

    currentPage = totalPages;

  }

  const start = (currentPage - 1) * PAGE_SIZE;

  const reversed = [...data].reverse();

  const pageData =
    reversed.slice(start, start + PAGE_SIZE);

  renderRecordsTableBody("recordBody", pageData, {

    deleteHandler: "deleteRecord",

    getDeleteIndex: record => records.indexOf(record)

  });

  updatePaginationUI(totalPages, data.length);

}

function updatePaginationUI(totalPages, totalItems){

  document.getElementById("pageInfo").textContent =
    `Page ${currentPage} of ${totalPages} (${totalItems} records)`;

  document.getElementById("prevPage").disabled =
    currentPage <= 1;

  document.getElementById("nextPage").disabled =
    currentPage >= totalPages;

  const pageInput =
    document.getElementById("pageInput");

  if(pageInput){

    pageInput.max = totalPages;

    pageInput.value = currentPage;

  }

  sessionStorage.setItem(
    "recordsPage",
    String(currentPage)
  );

}

function goToPage(page){

  const totalPages =
    Math.max(1, Math.ceil(displayedRecords.length / PAGE_SIZE));

  if(page < 1 || page > totalPages) return;

  currentPage = page;

  renderTable(displayedRecords);

}

function goToPageFromInput(){

  const pageInput =
    document.getElementById("pageInput");

  const page =
    parseInt(pageInput?.value || "1", 10);

  goToPage(page);

}

function deleteRecord(index){

  if(index < 0) return;

  records.splice(index, 1);

  localStorage.setItem(
    "records",
    JSON.stringify(records)
  );

  refreshTable();

}

function refreshTable(){

  renderTable(getFilteredRecords());

}

function searchRecord(){

  currentPage = 1;

  refreshTable();

}

function applyFilters(){

  currentPage = 1;

  refreshTable();

}

function clearFilters(){

  document.getElementById("filterInvoice").value = "";

  document.getElementById("filterItem").value = "";

  document.getElementById("filterOperator").value = "";

  document.getElementById("searchInput").value = "";

  currentPage = 1;

  refreshTable();

}

function exportExcel(){

  const excelData =
    getFilteredRecords().map(record => {

      const display = getDisplayFields(record);

      return {

        Invoice:record.invoice,

        Item:record.item,

        Operator:display.operator,

        Date:display.date,

        Qty:display.qty,

        Combine:record.combine

      };

    });

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Production Record"
  );

  XLSX.writeFile(
    workbook,
    "production_record.xlsx"
  );

}
