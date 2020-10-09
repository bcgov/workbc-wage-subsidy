import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";

export const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onSelect={val => {setFieldValue(field.id, val);
      }}
      onChange={val => {
        setFieldValue(field.name, val);
      }}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      maxDate={new Date()}
    />
  );
};