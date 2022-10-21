/* eslint-disable import/prefer-default-export */
import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  SimpleShowLayout,
  DateField,
  TopToolbar,
  FilterButton,
  SelectInput,
  CheckboxGroupInput,
  NumberField
} from 'react-admin'

const PostShow = () => (
  <SimpleShowLayout>
    <TextField source="id" />
    <TextField source="title" />
    <NumberField source="catchmentno" />
    <TextField source="formtype" />
    <TextField source="applicationid" />
    <TextField source="applicationstatus" />
    <DateField source="periodstart1" />
    <DateField source="periodstart2" />
    <BooleanField source="isfinalclaim" />
    <TextField source="operatingname" />
    <TextField source="businessaddress1" />
    <TextField source="businesscity" />
    <TextField source="businesspostal" />
    <TextField source="businessphone" />
    <TextField source="employeefirstname" />
    <TextField source="employeelastname" />
    <DateField source="datefrom1" />
    <DateField source="datefrom2" />
    <DateField source="datefrom3" />
    <DateField source="datefrom4" />
    <TextField source="datefrom5" />
    <DateField source="dateto1" />
    <DateField source="dateto2" />
    <DateField source="dateto3" />
    <DateField source="dateto4" />
    <TextField source="dateto5" />
    <NumberField source="hoursworked1" />
    <NumberField source="hoursworked2" />
    <NumberField source="hoursworked3" />
    <NumberField source="hoursworked4" />
    <TextField source="hoursworked5" />
    <NumberField source="hourlywage1" />
    <NumberField source="hourlywage2" />
    <NumberField source="hourlywage3" />
    <NumberField source="hourlywage4" />
    <TextField source="hourlywage5" />
    <TextField source="workactivitiesandissues" />
    <NumberField source="totalwage1" />
    <NumberField source="totalwage2" />
    <NumberField source="totalwage3" />
    <NumberField source="totalwage4" />
    <DateField source="totalwage5" />
    <TextField source="eligiblewages" />
    <TextField source="eligiblewages2" />
    <TextField source="totalmercs1" />
    <TextField source="totalmercs2" />
    <TextField source="subsidyratepercent1" />
    <TextField source="subsidyratepercent2" />
    <TextField source="subsidyratedatefrom1" />
    <TextField source="subsidyratedateto1" />
    <TextField source="totalamountreimbursed1" />
    <TextField source="claimapprovedby1" />
    <TextField source="subsidyratedatefrom2" />
    <TextField source="subsidyratedateto2" />
    <TextField source="totalamountreimbursed2" />
    <TextField source="claimapprovedby2" />
    <TextField source="claimverifieddate" />
    <TextField source="totalsubsidyclaimed" />
    <TextField source="totalweeks1" />
    <TextField source="totalweeks2" />
    <TextField source="wagesreimbursed1" />
    <TextField source="wagesreimbursed2" />
    <TextField source="mercsreimbursed1" />
    <TextField source="mercsreimbursed2" />
    <TextField source="claimemployeeinfo" />
    <TextField source="originalapplicationid" />
    <DateField source="modified" />
    <DateField source="created" />
  </SimpleShowLayout>
)

const choices = [
  { id: 1, name: '1' },
  { id: 2, name: '2' }
]

const formFilters = [
  <SelectInput key="caFilter" source="catchmentno" label="Catchment" choices={choices} alwaysOn />,
  <CheckboxGroupInput
    key="statusFilter"
    source="applicationstatus"
    label=""
    choices={[
      { id: 'NULL', name: 'New' },
      { id: 'In Progress', name: 'In Progress' },
      { id: 'Completed', name: 'Completed' },
      { id: 'Cancelled', name: 'Cancelled' }
    ]}
    alwaysOn
  />
]

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
  </TopToolbar>
)

export const ClaimsList = (props: any) => (
  <List {...props} actions={<ListActions />} filters={formFilters}>
    <Datagrid expand={<PostShow />}>
      <TextField source="id" />
      <NumberField source="catchmentno" label="CA" />
      <TextField source="created" />
      <TextField source="applicationid" />
      <TextField source="title" />
      <TextField source="applicationstatus" />
    </Datagrid>
  </List>
)
