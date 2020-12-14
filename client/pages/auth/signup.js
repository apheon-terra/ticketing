import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
// import axios from 'axios'



export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
    //v1 of sending requests

    // catching erors
  
        // const onSubmit = async event => {
        //     event.preventDefault();
        //     try {
        //         const response = await axios.post('/api/users/signup', {
        //         email, password
        //         });

        //         console.log(response.data);//actual response location
        //         }
        //     catch (err) {
        //         console.log(err.response.data);//the reposnse wrapped in the standardized error handling stuff created in the auth backend , the custom errors created
        //     }
        // }
    
    
    //v2 of catching and logging errors
    // const [errors, setErrors] = useState([]);

    //     const onSubmit = async event => {
    //         event.preventDefault();
    //         try {
    //             const response = await axios.post('/api/users/signup', {
    //             email, password
    //             });

    //             console.log(response.data);//actual response location
    //             }
    //         catch (err) {
    //             console.log(err.response.data);//the reposnse wrapped in the standardized error handling stuff created in the auth backend , the custom errors created
    //             setErrors(err.response.data.errors);
    //         }
    //     }
    
    
    
    //v3
    const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
    };
    

//v1
//   return (
//     <div className="container">
//       <form onSubmit={onSubmit}>
//         <h1>Sign Up</h1>
//         <div className="form-group">
//           <label>Email Address</label>
//           <input
//             className="form-control"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           ></input>
//         </div>
//         <div className="form-group">
//           <label>Password</label>
//           <input
//             className="form-control"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           ></input>
//         </div>
//               {errors.length>0 &&
//                   <div className="alert alert-danger">
//                     <h4>Oops </h4>
//                   <ul> {errors.map(err =>
//                       <li key={err.message}>{err.message}</li>
//                                 )
//                         }
//                   </ul>
//               </div>
//               }
//         <button className="btn btn-primary">Sign Up</button>
//       </form>
//     </div>
//   );

    
      return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        {errors}
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};
