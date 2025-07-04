import { useState } from "react";
import * as XLSX from "xlsx";
import SingleSelect from "./components/SingleSelect";
import { Button } from "./components/Button";
import MultiSelect from "./components/MultiSelect";
import { parseMonthRows } from "./components/utils/workbook.util";
import { parseSheetAttributes } from "./components/utils/sheet.util";
import {
  getMonthDates,
  getWorkingDaysInMonth,
} from "./components/utils/date.util";

const thisMonth = new Date().getMonth();
const resourceTasks = {
  "Client Integration/Meetings/Analysis": ["ClientMeeting"],
  "Bug Fixing": ["Bug"],
  Enhancement: [],
  "Knowledge Transfer/Product Understanding": ["KnowledgeTransfer"],
  "Feature / Task": ["Task"],
  "QA Testing": ["Test Cast"],
  Leave: ["Leave"],
  Holiday: ["Holiday"],
};

export function MonthlyReport({ workbook }) {
  const [month, setMonth] = useState(thisMonth + 1);
  const [year, setYear] = useState(2025);
  const [selected, setSelected] = useState([]);

  const [processingReport, setProcessingReport] = useState(false);

  const generateEmployeeReport = () => {
    const report = {
      summary: [], // Name,Working Days, Days Worked, Holidays, Leaves
      resources: [], // Name, Task Type, Hours
      employees: {}, // Sam: Date, Epic, Task, Time
    };
    const rows = parseMonthRows(workbook, selected, month, year);
    const { assignee, asignee_dates } = parseSheetAttributes(rows);
    const workingdays = getWorkingDaysInMonth(month, year);

    report.summary = Object.keys(assignee).map((name) => {
      const Leave = assignee[name].filter(
        (row) => row["Type"] === "Leave"
      ).length;
      const Holidays = assignee[name].filter(
        (row) => row["Type"] === "Holiday"
      ).length;
      return {
        Name: name,
        "Working Days": workingdays,
        "Days Worked": workingdays - (Leave + Holidays),
        Holidays,
        Leave,
      };
    });

    report.resources = Object.keys(resourceTasks).map((key) => {
      return {
        Task: key,
        ...Object.keys(assignee).reduce((acc, name) => {
          acc[name] = assignee[name].reduce((total, row) => {
            if (resourceTasks[key].includes(row.Type)) {
              total += row["Invested Hours"]
                ? parseFloat(row["Invested Hours"])
                : 8;
            }
            return total;
          }, 0);
          return acc;
        }, {}),
      };
    });

    const days = getMonthDates(month, year);
    report.employees = Object.keys(assignee).reduce((acc, name) => {
      acc[name] = days.map((dayObj) => {
        const key = `${name}__${dayObj.day}-${dayObj.monthStr}-${dayObj.year}`;
        return {
          Date: `${dayObj.dayStr} ${dayObj.monthStr}, ${dayObj.dayOfWeekStr}`,
          Epic: asignee_dates[key]?.[0]?.Type || "",
          Task: asignee_dates[key]?.map((r) => r["JIRA ID"]).join(",") || "",
          Time:
            asignee_dates[key]
              ?.map((r) => r["Invested Hours"])
              .reduce((total, hour) => {
                total += hour ? parseFloat(hour) : 0;
                return total;
              }, 0) || "",
        };
      });

      return acc;
    }, {});

    console.log("report employee", report);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(report.summary),
      "Summary"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(report.resources),
      "Resources"
    );
    Object.keys(report.employees).forEach((name) => {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(report.employees[name]),
        name
      );
    });

    // Write the employee based report to file
    XLSX.writeFile(wb, `tele-${month}-${year}-report.xlsx`);
  };

  const generateSharedReport = () => {
    const report = {
      summary: [],
      resources: [],
      projects: {}, // Sam: Date, Epic, Task, Time
    };
    const rows = parseMonthRows(workbook, selected, month, year);
    const { projects, assignee, project_dates } = parseSheetAttributes(rows.filter(r => r.Assignee === 'Amar'));
    const workingdays = getWorkingDaysInMonth(month, year);

    report.summary = Object.keys(assignee).map((name) => {
      const Leave = assignee[name].filter(
        (row) => row["Type"] === "Leave"
      ).length;
      const Holidays = assignee[name].filter(
        (row) => row["Type"] === "Holiday"
      ).length;
      return {
        Name: name,
        "Working Days": workingdays,
        "Days Worked": workingdays - (Leave + Holidays),
        Holidays,
        Leave,
      };
    });

    report.resources = Object.keys(resourceTasks).map((key) => {
      return {
        Task: key,
        ...Object.keys(projects).reduce((acc, name) => {
          acc[name] = projects[name].reduce((total, row) => {
            if (resourceTasks[key].includes(row.Type)) {
              total += row["Invested Hours"]
                ? parseFloat(row["Invested Hours"])
                : 8;
            }
            return total;
          }, 0);
          return acc;
        }, {}),
      };
    });

    const days = getMonthDates(month, year);
    report.projects = Object.keys(projects).reduce((acc, name) => {
      acc[name] = days.map((dayObj) => {
        const key = `${name}__${dayObj.day}-${dayObj.monthStr}-${dayObj.year}`;
        return {
          Date: `${dayObj.dayStr} ${dayObj.monthStr}, ${dayObj.dayOfWeekStr}`,
          Epic: project_dates[key]?.[0]?.Type || "",
          Task: project_dates[key]?.map((r) => r["JIRA ID"]).join(",") || "",
          Time:
            project_dates[key]
              ?.map((r) => r["Invested Hours"])
              .reduce((total, hour) => {
                total += hour ? parseFloat(hour) : 0;
                return total;
              }, 0) || "",
        };
      });

      return acc;
    }, {});

    console.log("report shared", report);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(report.summary),
      "Summary"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(report.resources),
      "Resources"
    );
    Object.keys(report.projects).forEach((name) => {
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(report.projects[name]),
        name
      );
    });

    // Write the employee based report to file
    XLSX.writeFile(wb, `tele-shared-${month}-${year}-report.xlsx`);
  };

  const generateMonthlyReport = async () => {
    if (!selected) return "";

    try {
      setProcessingReport(true);

      generateEmployeeReport()
      generateSharedReport()
    } catch (error) {
      console.error("Error generating document:", error);
    }

    setProcessingReport(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-2xs">
        <SingleSelect
          label="Select month"
          items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          selected={month}
          setSelected={setMonth}
        />
        <SingleSelect
          label="Select year"
          items={[2024, 2025, 2026, 2027]}
          selected={year}
          setSelected={setYear}
        />
        <MultiSelect
          label="Select sheets for above month"
          items={workbook?.SheetNames || []}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <Button
        loading={processingReport}
        label="Generate Monthly report"
        handler={generateMonthlyReport}
        disabled={!selected}
      />
    </div>
  );
}
