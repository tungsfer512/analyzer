import React from 'react';
import { useModel } from 'umi';
import { Button } from 'antd';

const ProductList = () => {
  const userData = useModel('admin', (data: any) => ({
    counter: data.counter,
    minus: data.decrement,
  }));

  return (
    <>
      <div>Product List Page</div>
      <Button onClick={userData.minus}> Decrement</Button>
      <div>
        <b>Counter: </b>
        {userData.counter}
      </div>
    </>
  );
};

export default ProductList;
