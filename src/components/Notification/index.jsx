import React, { useState } from 'react';
import {
  OverflowMenu,
  OverflowMenuItem,
  // Notification,
  NotificationActionButton,
} from 'carbon-components-react';
import { Notification } from '@carbon/icons-react';

const UserNotificationsMenu = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      user: 'Alice',
      message: 'New message received',
      avatar: 'https://static.vecteezy.com/system/resources/previews/002/002/297/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg',
    },
    {
      id: 2,
      user: 'Bob',
      message: 'Task assigned to you',
      avatar: 'https://static.vecteezy.com/system/resources/previews/002/002/297/non_2x/beautiful-woman-avatar-character-icon-free-vector.jpg',
    },
    // Add more notifications as needed
  ];

  return (
    <OverflowMenu
      flipped
      ariaLabel="User Notifications"
      iconDescription="Open notifications menu"
      renderIcon={Notification}
      onClick={() => setOpen(!open)}
      size='lg'
    >
      {/* <OverflowMenuItem itemText="Notifications" hasDivider isTitle /> */}
      <OverflowMenuItem itemText="Stop app" />
      <OverflowMenuItem itemText="Restart app" />
      <OverflowMenuItem itemText="Rename app" />
      <OverflowMenuItem itemText="Clone and move app" disabled requireTitle />
      <OverflowMenuItem itemText="Edit routes and access" requireTitle />
      <OverflowMenuItem hasDivider isDelete itemText="Delete app" />
      {/* {notifications.map((notif) => (
        <div key={notif.id}>
          <img src={notif.avatar} alt={`${notif.user}'s avatar`} height={50} width={50} />
          <div>
            <p>{notif.user}</p>
            <p>{notif.message}</p>
          </div>
          <NotificationActionButton
            onClick={() => console.log(`Mark as read: ${notif.id}`)}
          >
            Mark as Read
          </NotificationActionButton>
        </div>
      ))} */}
    </OverflowMenu>
  );
};

export default UserNotificationsMenu;