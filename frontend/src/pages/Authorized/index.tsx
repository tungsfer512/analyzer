/* eslint-disable no-console */
import React from 'react';
import { useAccess, Access } from 'umi';
import { Button } from 'antd';
import { useModel } from 'umi';

export default () => {
  // Use useAccessss() hook to get all access attributes defined in 'access.ts' file
  const access = useAccess();
  console.log('Access==>', access);

  // Use useModel() hook to get data from model. Default initialState will be consumed by model '@@initialState'
  const initialData = useModel('@@initialState');
  console.log('InitialData==>', initialData);

  // Consume model 'admin' defined in 'admin.js file with useModel() hook
  let userData;
  if (access.isAdmin) {
    userData = useModel('admin', (data: any) => ({
      counter: data.counter,
      add: data.increment,
    }));
    console.log('User data==>', userData);
  }

  // Check if token is exist
  // const token = localStorage.getItem('token');
  const adminBtn = <Button onClick={userData.add}> Admin Button</Button>;
  const guestBtn = <Button> Guest Button</Button>;

  return (
    <div>
      <Access
        accessible={access.isAdmin}
        fallback={
          !access.isGuest ? (
            <h1>You are not either guest or admin! This button not be shown</h1>
          ) : (
            <>{guestBtn}</>
          )
        }
      >
        <>
          {adminBtn}
          <div>
            <b>Counter: </b>
            {userData.counter}
          </div>
        </>
      </Access>
    </div>
  );
};
