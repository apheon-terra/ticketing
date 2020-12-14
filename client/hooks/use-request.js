

import { useState } from 'react';
import axios from 'axios';


// export default ({ url, method, body, onSuccess }) => {
//   const [errors, setErrros] = useState(null);

//   const doRequest = async () => {
//     try {
//       setErrros(null);//reset errors
//       const response = await axios[method](url, body);

//       if (onSuccess) {
//         onSuccess(response.data);
//       }
//       return response.data;
//     } catch (err) {
//       setErrros(
//         <div className="alert alert-danger">
//           <h4>Oooops....</h4>
//           <ul className="my-0">
//             {err.response.data.errors.map((err) => (
//               <li key={err.message}>{err.message}</li>
//             ))}
//           </ul>
//         </div>
//       );
//     }
//   };

//   return { doRequest, errors };
// };


//v2 , having dynamically merged input object to the final body


export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrros] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrros(null);//reset errors
      const response = await axios[method](url,
        { ...body, ...props }   );

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrros(
        <div className="alert alert-danger">
          <h4>Oooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
