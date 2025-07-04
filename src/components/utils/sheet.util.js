export const parseSheetAttributes = (sheetData) => {
    const projects = sheetData.reduce((acc, val) => {
      if (!acc[val.Project]) acc[val.Project] = [val];
      else acc[val.Project].push(val);

      return acc;
    }, {});
    const tasks = sheetData.reduce((acc, val) => {
      if (!acc[val['JIRA ID']]) acc[val['JIRA ID']] = [val];
      else acc[val['JIRA ID']].push(val);

      return acc;
    }, {});
    const assignee = sheetData.reduce((acc, val) => {
      if (!acc[val.Assignee]) acc[val.Assignee] = [val];
      else acc[val.Assignee].push(val);

      return acc;
    }, {});
    const asignee_dates = sheetData.reduce((acc, val) => {
      const key = `${val.Assignee}__${val.Date}`
      if (!acc[key]) acc[key] = [val];
      else acc[key].push(val);

      return acc;
    }, {});
    const project_dates = sheetData.reduce((acc, val) => {
      const key = `${val.Project}__${val.Date}`
      if (!acc[key]) acc[key] = [val];
      else acc[key].push(val);

      return acc;
    }, {});

    return {
        projects,
        tasks,
        assignee,
        asignee_dates,
        project_dates
    }
}