
//v2
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';


const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (//receiving current user as props in component
      <div>
        <hi>{currentUser.email}</hi>
        <Header currentUser={currentUser} />
          <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};



//page Component getInitialProps first argument is context==={req,res}

//custom App components getInitialProps  first argument has a bit of different structure  context=== {Component,ctx:{req,res} } so you go to context.ctx for the whole req/res thing
//appContext is different than the context from landing page
AppComponent.getInitialProps = async (appContext) => {


    console.log(appContext)//>>a big big data object dump of keys and values including Component : fucntion LandingPage -> getInitialProps
    //verify the keys

    console.log(Object.keys(appContext));//you will log out the properties AppTree , Component, router and ctx
    // return {}
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
    console.log(data);//>>current user dumped id ,email, iat
  
    let pageProps = {};//to fial gracefully as empty object rather then undefined
    //if is defined then
    if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser);//client as a second argument, user as 3 argument in case we decide to fetch some data tied to a user w have to understand who the users ID is 
  }
    console.log(pageProps)//>>currentUser -> id email iad
  
      return {
    pageProps,
    ...data,/*as known as currentUser: data.currentUser*/
  };//the whole thing will show as props in appComponent above
};

export default AppComponent;