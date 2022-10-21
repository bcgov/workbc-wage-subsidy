import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  SimpleShowLayout,
  RichTextField,
  TopToolbar,
  FilterButton,
  SelectInput,
  CheckboxGroupInput
} from 'react-admin'

const PostShow = () => (
  <SimpleShowLayout>
    <RichTextField source="title" />
  </SimpleShowLayout>
)

const choices = [
  { name: '1', label: '1' },
  { name: '2', label: '2' }
]

const formFilters = [
  <SelectInput source="userId" label="" choices={choices} alwaysOn />,
  <CheckboxGroupInput
    source="completed"
    label=""
    choices={[
      { id: 'New', name: 'New' },
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

export const ApplicationList = (props: any) => (
  <List {...props} actions={<ListActions />} filters={formFilters}>
    <Datagrid expand={<PostShow />}>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="userId" />
      <BooleanField source="completed" />
    </Datagrid>
  </List>
)
