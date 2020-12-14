import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);//timeleft is 0

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,//slap the order id to the body as desired by new route in payments backend
    },
      onSuccess: (/*payment*/) => {
        //   console.log(payment);
          Router.push('/orders')
      }
  });


    //timer algorithm
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    //invoke time left right away then do the set interval thing
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);//calling interval, using only ref without calling , the setIntervall first is going to wait first 1000ms then is goign to procedd to call every 1000
    
    //navigate away , stop the intrval , TimerId is a integer that is going to identify the interval that we just created,
      //as soon as we navigate away or rerendered if we have a dependecy listed in the second argument of the useEffect we return a function
      return () => {
      clearInterval(timerId);
    };
  }, [order]);//in the second arg is the list of dependency list used

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
//stripe checkout
  return (
    <div>
      Time left to pay: {timeLeft} seconds <br />
          <StripeCheckout
        //token={token=>console.log(token)}
        token={({ id }) => doRequest({ token: id })}//our token, doRequest will merge the extra object provided token:id with the rest of the body provided in the userequest Hook
        stripeKey="pk_test_LQWgtToPhlyDhBDmdn9ULxmn00WVghorjW"
        amount={order.ticket.price * 100}//stripe props
        email={currentUser.email}//receives a prop from upstream currentUser
      />
      {errors}
    </div>
  );
};//pay modal appears, test mode card number 5555 x 3 4444
//the modal will spit a payload with token user tha allows us to charge credit card,the id property is the important and allows us to charge ,send it of to our payment api, our api can do a follow up and charge the user credit card for this amount of money

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;//orderID that is how we name the file
  const { data } = await client.get(`/api/orders/${orderId}`);
    //extract order as data invoke above
  return { order: data };
};

export default OrderShow;
