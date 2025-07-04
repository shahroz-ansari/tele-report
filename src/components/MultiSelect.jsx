import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'

export default function MultiSelect({items, selected, setSelected, label}) {
  const handleSelect = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(s => s !== item))
    } else {
      setSelected([...selected, item])
    }
  }

  const removeItem = (item, e) => {
    e.stopPropagation()
    setSelected(selected.filter(s => s !== item))
  }

  const displayText = selected.length === 0 
    ? 'Please select' 
    : selected.length === 1 
      ? selected[0] 
      : `${selected.length} items selected`

  return (
    <Listbox value={selected} onChange={setSelected} multiple>
      <Label className="block text-sm/6 font-medium text-gray-900">{label}</Label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6">
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            {selected.length === 0 || selected.length > 1 ? (
              <span className="block truncate">{displayText}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selected.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                  >
                    {item}
                    <span
                      onClick={(e) => removeItem(item, e)}
                      className="flex-shrink-0 ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    >
                      <XMarkIcon className="h-2 w-2" />
                    </span>
                  </span>
                ))}
              </div>
            )}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {items.map((item) => (
            <ListboxOption
              key={item}
              value={item}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-gray-600 data-focus:text-white data-focus:outline-hidden"
              onClick={() => handleSelect(item)}
            >
              <div className="flex items-center">
                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{item}</span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}