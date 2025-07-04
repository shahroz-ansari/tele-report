import { useState } from "react";
import { UploadFile } from "./components/UploadFile";
import { Tab, TabPanel, TabGroup, TabList, TabPanels } from "@headlessui/react";
import { WeeklyReport } from "./WeeklyReport";
import { MonthlyReport } from "./MonthlyReport";
import { classNames } from "./components/utils/classname.util";

function App() {
  const [workbook, setWorkbook] = useState(null);
  const [workbookName, setWorkbookName] = useState("Sample workbook");

  const tabs = ["Weekly report", "Monthly report"];

  console.log(workbook)
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Report generator</h1>

      {workbook ? (
        <div className="text-xl my-4"><span className="font-bold">File name:</span> {workbookName}</div>
      ) : (
        <UploadFile
          setWorkbook={setWorkbook}
          setWorkbookName={setWorkbookName}
        />
      )}

      {workbook && (
        <TabGroup className="mt-4">
          <TabList className="flex space-x-1 bg-gray-100 p-1 rounded">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    "w-full py-2.5 text-sm leading-5 font-medium",
                    selected
                      ? "bg-white shadow rounded"
                      : "text-gray-500 hover:bg-white/[0.12] hover:text-gray-800"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-2 bg-gray-100 p-4">
            <TabPanel>
              <WeeklyReport workbook={workbook} />
            </TabPanel>
            <TabPanel>
              <MonthlyReport workbook={workbook} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}
    </div>
  );
}

export default App;
