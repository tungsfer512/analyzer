import React from 'react';

const ErrorPage = (props: any) => {
  return <div>There may be error when display this page! (Error: {props.err})</div>;
};

export default ErrorPage;
