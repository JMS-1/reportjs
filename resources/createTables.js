const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const loggedTables = ref([]);  

    onMounted(() => {
      const params = new URLSearchParams(window.location.search);
      const transaction = params.get('transaction');
      document.body.insertAdjacentHTML('afterbegin', `<h2>Transaction: ${transaction}</h2>`);
      CreateTables(transaction);
    });

    function CreateTables(transactionName) {
      fetch("./reports/test.json")
      .then(response => response.json())
      .then(json => {
        json = JSON.parse(json);
        let formattedJson = formatJson(json);

        loggedTables.value = [];
        Object.entries(formattedJson).forEach(([key, section]) => {
          const rows = [];
          const allColumnKeys = new Set();

          Object.values(section).forEach(values => {
            Object.keys(values).forEach(col => allColumnKeys.add(col));
          });

          // Convert Set to Array and move "unit" to the end if it exists
          let columnKeys = Array.from(allColumnKeys);
          const unitIndex = columnKeys.indexOf("Unit");
          if (unitIndex !== -1) {
            columnKeys.splice(unitIndex, 1);
            columnKeys.push("Unit");
          }

          // columns
          const columns = [{ header: "", field: "rowLabel" }];
          columnKeys.forEach(col => {
            columns.push({ header: col, field: col });
          });

          // rows
          Object.entries(section).forEach(([rowLabel, values]) => {
            rows.push({ rowLabel, ...values });
          });

          loggedTables.value.push({
            name: key,
            columns,
            rows
          });
        });
      });
  }

    return {
      loggedTables,
      CreateTables
     };
  },
});

app.use(PrimeVue.Config, {
  theme: {
    preset: PrimeVue.Themes.Aura,
  },
});
app.component('p-datatable',PrimeVue.DataTable);
app.component('p-column', PrimeVue.Column);

app.mount('#app');

