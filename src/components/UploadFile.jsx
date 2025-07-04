import * as XLSX from "xlsx";
import { PhotoIcon } from "@heroicons/react/24/solid";

export function UploadFile({ setWorkbook, setWorkbookName }) {
  const handleFile = (file) => {
    console.log(file.name)
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result);
      const workbook = XLSX.read(data, { type: "array" });
      setWorkbook(workbook);
      setWorkbookName(file.name)
    };
    reader.readAsArrayBuffer(file);
  };
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };
  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFile(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
      className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
    >
      <div className="text-center">
        <PhotoIcon
          aria-hidden="true"
          className="mx-auto size-12 text-gray-300"
        />
        <div className="mt-4 flex text-sm/6 text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
          >
            <span>Upload timesheet</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs/5 text-gray-600">.xlsx</p>
      </div>
    </div>
  );
}
