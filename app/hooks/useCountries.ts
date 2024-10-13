import countries from "world-countries";

const FormattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));
const useCountries = () => {
  const getAll = () => FormattedCountries;
  const getByValue = (value: string) => {
    return FormattedCountries.find((country) => country.value === value);
  }
  return { getAll, getByValue };
};

export default useCountries;
