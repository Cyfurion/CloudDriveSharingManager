import AuthContext from '../auth';
import { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = "51282406360-evee6rmf1ttv4ni30be7l0dhme9p61ou.apps.googleusercontent.com";

export default function GoogleLoginButton() {
    const { auth } = useContext(AuthContext);

    const onSuccess = (res) => {
        console.log("Success: ", res);
        auth.initGoogleEndpoint(clientId);
    }

    const onFailure = (res) => {
        console.log("Failure: ", res);
    }

    return(
        <GoogleLogin
            clientId={clientId}
            onSuccess={onSuccess}
            onFailure={onFailure}
            isSignedIn={true}
        />
    );
}
