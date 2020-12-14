// [] is a wildcard route


import Router from 'next/router';
import useRequest from '../../hooks/use-request';
            //from api we start to show info
const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,//thats all needed to create an order , see new route from orders
    },
      onSuccess: (order) => {//order sent back to us by the backend, created,ticket reserved
          console.log(order);
          //programatic nav                 //real url order
          Router.push('/orders/[orderId]', `/orders/${order.id}`)
      }
  });//reroute us to the order page details
    
//goal is to show a buton to purchase a ticket, what we a really talking is creatign an order, click purchase make a request order backed referencing this ticket
//   return (
//     <div>
//       <h1>{ticket.title}</h1>
//       <h4>Price: {ticket.price}</h4>
//       {errors}
//       <button className="btn btn-primary" onClick={doRequest}>
//         Purchase
//       </button>
//     </div>
//     );
  //provide a ref to doRequest to be called at some point in time , so no prathesis on this for we do not want to invoke imediately

    //v2 because we added that optional prop in the hook userequest to dynamically add into the body any object from the input,
    // everytime we put something in as an event handler that function right there is going to be given a first argument of the event object . So we're going to receive the event object as this.props argument and then merge it into the request body . so if let unchanged the doRequest is receiving event as props and merged as payload into the body. do not do that we actually invoke the doRequest() as empty input arguments in an arrow function, so even if this get called with an event object we're not going to receive it or pass into the body of doRequest
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
    );

};

//load info about ticket displayed to the user
TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query; //we are specifically pulling out a property called ticket ID because that is what we named the file ([ticketId]), part of the query , default rule take it as it is
    //we want to reach the endpoint show route from tickets backend

  const { data } = await client.get(`/api/tickets/${ticketId}`);
    //asign data to ticket properrty , merged in all diff props that are provided to TicketShow Component
  return { ticket: data };
};

export default TicketShow;
