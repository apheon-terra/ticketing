import Link from 'next/link';

//tickets is an array with all fetch from api bellow
const LandingPage = ({ currentUser, tickets }) => {
    
    console.log(tickets);//render our tickets in a table
    
        //third td display the route anchored for linking and nicknamed as an alias
    //path to the file we want to show aliased as a second prop , a template string build the true url real id of the ticket
    //valid for programtic navigation as well
    const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
    
   
        return (
            <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
                </thead>
                <tbody>{ticketList}</tbody>
            </table>
            </div>
        );
//v1
//   return currentUser ? (
//     <h1>You are signed in</h1>
//   ) : (
//     <h1>You are NOT signed in</h1>
//   );
};

//context,currentUser passed above
//v1 was instead of context , {req}, so rather destructure give the whole thing named context, so req, was found in context.req,

// the first arg in getInitialProps is named context
//if we need to get access to our user we can use the id to fetch some data
//is going to be really easy to fecth some data using this client argument or current user without having to make a follow up request to fetch the current user, and without having to import that build client fucntion to build a client which we alread done once before 
//this f has access to client wich we are using to make request during the initial rendering pprocess
LandingPage.getInitialProps = async (context,client,currentUser) => {
  const { data } = await client.get('/api/tickets');
    // receiving a res.data
  return { tickets: data };//this object is going to be merged into the props that are going to be passed in the landing page, so we can receive ticket inside the actual component , see above props

    
    // return {}
};

//if we have the above logic in the _app side this logic here wont be invoked anymore even if it's present
//this is due to next,but there is a fix , we will take the above and manually invoked it from _app so we fetch 2 sets of data one for the _app one for the page


export default LandingPage;


