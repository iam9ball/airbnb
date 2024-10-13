"use client";
import Select from "react-select";
import useCountries from "../hooks/useCountries";

export type CountrySelectvalue = {
  label: string;
  value: string;
  flag: string;
  region: string;
  latlng: number[];
};

interface CountrySelectProps {
  value: CountrySelectvalue;
  onChange: (value: CountrySelectvalue | null) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { getAll } = useCountries();
  return (
    <div className="">
      <Select
        placeholder="Anywhere"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as CountrySelectvalue)}
        formatOptionLabel={(options) => (
          <div className="flex flex-row items-center gap-3">
            <div className="">{options.flag}</div>
            <div>
              {options.label},
              <span className="text-neutral-500 ml-1">{options.region}</span>
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme)=> ({
            ...theme,
            borderRadius: 6,
            colors: {
                ...theme.colors,
                primary25: "#ffe4e4",
                primary: "black",
            }
        })}
      />
    </div>
  );
}
