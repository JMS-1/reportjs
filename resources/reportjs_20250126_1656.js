const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {

    
    const reports = ref([]);  
    const report_datarows = ref([]);
    const dt = ref();
    const exportFilenameCsv = ref();
    const selectedReport = ref();

    const selectedReport_changed = (event) => {
      exportFilenameCsv.value = "" + event.value.sessionName;
      fetch("./reports/" + event.value.sessionName + ".json")
      .then(response => response.json())
      .then(json => report_datarows.value = json);
    }

    const loadReports = () => {
      fetch("./reports/AllSessions.json")
      .then(response => response.json())
      .then(json => reports.value = json);
    };

    const exportCSV = () => { 
      dt.value.exportCSV(); 
    };
    
    const exportPDF = () => {
        const doc = new jspdf.jsPDF('p');
        const p_datatable = document.getElementById('report_datatable');
        const html_tables = p_datatable.querySelectorAll(':scope > div > table');
        doc.autoTable({ html: html_tables[0] });
        doc.save('report_' + selectedReport.value.sessionName + '.pdf');
    };

    const exportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(report_datarows._rawValue);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAsExcelFile(excelBuffer, 'report_' + selectedReport.value.sessionName);
    };
    
    const saveAsExcelFile = (buffer, fileName) => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data = new Blob([buffer], { type: EXCEL_TYPE });
      saveAs(data, fileName + EXCEL_EXTENSION);
    };

    loadReports();
    
    return {
      reports,
      report_datarows,
      dt,
      exportFilenameCsv,
      selectedReport,
      selectedReport_changed,
      loadReports,
      exportCSV,
      exportPDF,
      exportExcel
    };
  },
});

app.use(PrimeVue.Config, {
  theme: {
    preset: PrimeVue.Themes.Aura,
  },
});

app.component('p-button', PrimeVue.Button);
app.component('p-datatable', PrimeVue.DataTable);
app.component('p-column', PrimeVue.Column);
app.component('p-columngroup', PrimeVue.ColumnGroup);
app.component('p-row', PrimeVue.Row);
app.component('p-select', PrimeVue.Select);

app.directive('tooltip', PrimeVue.Tooltip);

app.mount('#app');
