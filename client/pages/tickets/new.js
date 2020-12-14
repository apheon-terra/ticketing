import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
      },
    //v1
    //   onSuccess: (ticket) => console.log(ticket)
      /*
      id, price,title ,userID,version __proto__
      */

    onSuccess: () => Router.push('/'),//make a request to backend//with the response.data //programatic navigation
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();//output from backend to run the request
  };

  const onBlur = () => {
    const value = parseFloat(price);
    //check the field to be a specific format
    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );//err visible only when poopulated
};

export default NewTicket;
