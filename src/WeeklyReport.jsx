import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import SingleSelect from "./components/SingleSelect";
import { Button } from "./components/Button";
import { parseSheetAttributes } from "./components/utils/sheet.util";

export function WeeklyReport({ workbook }) {
  const [selected, setSelected] = useState("");
  const [sheetData, setSheetData] = useState();
  const [processingReport, setProcessingReport] = useState(false);

  useEffect(() => {
    if (selected && workbook) {
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[selected], {
        raw: false,
      });
      setSheetData(jsonData);
    }
  }, [selected, workbook]);

  const generateWeeklyReport = async () => {
    if (!selected) return "";

    try {
      setProcessingReport(true);

      // Load the template file from the public folder
      const response = await fetch("/tele-report/week-report-template.docx");
      const content = await response.arrayBuffer();

      // Load the template into PizZip
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip);

      console.log("week data", sheetData);

      const { projects, tasks, assignee } = parseSheetAttributes(sheetData);
      console.log("projects", projects);
      console.log("tasks", tasks);
      console.log("assignee", assignee);

      const WorkProgress = Object.keys(projects).map((p) => {
        const pro = {
          Project: p,
          Tasks: "",
          CompletedSP: 0,
          PendingSP: 0,
          Blockers: "",
          Remark: "",
        };

        pro.Tasks = Object.keys(assignee)
          .map((a) => {
            const t = [];

            assignee[a].forEach((v) => {
              if (v.Project === p && ["Task", "Bug", "Test Cast", "KnowledgeTransfer", "ClientMeeting"].includes(v.Type)) {
                t.push(v["JIRA ID"]);
              }
            });

            if (t.length > 0) return `${a} ${[...new Set(t)].join(", ")}`;

            return "";
          })
          .filter((v) => v)
          .join("\n\n");

        pro.PendingSP = 0;
        pro.CompletedSP = Object.keys(tasks).reduce((acc, t) => {
          const hasCompleted = tasks[t].reduce((acc2, t2) => {
            if (["Done", "PR Raised"].includes(t2.Status)) return true;
            return acc2;
          }, false);

          if (tasks[t][0]["Story Points"] === undefined)
            console.log("Undefined", tasks[t][0]);
          if (
            tasks[t][0].Project === p &&
            tasks[t][0]["Story Points"] !== undefined
          ) {
            if (hasCompleted) {
              acc += Number(tasks[t][0]["Story Points"] ?? 0);
            } else {
              pro.PendingSP += Number(tasks[t][0]["Story Points"] ?? 0);
            }
          }
          return acc;
        }, 0);

        return pro;
      });

      const EmployeeLeaves = Object.keys(assignee).map((a) => {
        const pro = { Name: a, Count: 0 };

        pro.Count = assignee[a].reduce((acc, val) => {
          if (val.Type === "Leave") {
            acc += 1;
          }

          return acc;
        }, 0);
        return pro;
      });

      const reportData = {
        Start: sheetData[0].Date,
        End: sheetData[sheetData.length - 1].Date,
        Developers: new Set(sheetData.map((item) => item.Assignee)).size + 1,
        TotalLeaves: sheetData.filter((item) => item.Type === "Leave").length,
        TotalHolidays: sheetData.filter((item) => item.Type === "Holiday")
          .length,
        WorkProgress,
        EmployeeLeaves: EmployeeLeaves.filter((e) => e.Count > 0),
      };

      console.log('report data', reportData)

      // Replace placeholders with JSON data
      doc.render(reportData);

      // Generate the Word file as a Blob
      const outputBlob = new Blob(
        [doc.getZip().generate({ type: "arraybuffer" })],
        {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }
      );

      // Trigger download
      saveAs(outputBlob, `WeeklyReport_${selected}.docx`);
    } catch (error) {
      console.error("Error generating document:", error);
    }

    setProcessingReport(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-2xs">
        <SingleSelect
          label="Select week"
          items={workbook?.SheetNames || []}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <Button
        loading={processingReport}
        label="Generate Weekly report"
        handler={generateWeeklyReport}
        disabled={!selected}
      />
    </div>
  );
}
