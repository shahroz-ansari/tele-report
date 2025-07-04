import { LoadingIcon } from "./LoadingIcon";
import { classNames } from "./utils/classname.util";

export function Button({ handler, label, loading, disabled }) {
  return (
    <button
      type="button"
      className={
        classNames(
            "max-w-max inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold",
            "bg-gray-700 text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 ",
            disabled ? "disabled:bg-gray-400 cursor-not-allowed" : "hover:bg-gray-900 cursor-pointer"
        )
      }
      onClick={handler}
      disabled={disabled}
    >
      {loading && (
        <LoadingIcon />
      )}
      {label}
    </button>
  );
}
