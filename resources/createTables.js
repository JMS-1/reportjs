export const { ref } = Vue;
export const loggedTables = ref([]);

export function CreateTables(transactionName) {
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
