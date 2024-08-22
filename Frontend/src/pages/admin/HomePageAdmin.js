import React, { useState } from 'react'
import { Add, Person } from '@mui/icons-material'
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { EventCalendar } from 'react-mui-event-calendar'

const emails = ['username@gmail.com', 'user02@gmail.com']

function HomePageadmin() {
  const data = [
    {
      date: new Date(),
      title: 'First',
      popupContent: (
        <>
          <List sx={{ pt: 0 }}>
            {emails.map((email) => (
              <ListItem button key={email}>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItem>
            ))}

            <ListItem autoFocus button>
              <ListItemAvatar>
                <Avatar>
                  <Add />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Add account' />
            </ListItem>
          </List>
        </>
      ),
      id: '1',
    },
  ]

  const [dataSource, setDataSource] = useState(data)

  return (
    <div
      style={{
        width: '100%',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto',
      }}
    >
      <EventCalendar
        dataSource={dataSource}
        pallet={{ primary: '#d2140a', secondary: '#dc4a41' }}
        onDataChange={(newEvents) => setDataSource(newEvents)}
      />
    </div>
  )
}

export default HomePageadmin