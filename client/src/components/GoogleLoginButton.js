import AuthContext from '../auth';
import { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = "51282406360-evee6rmf1ttv4ni30be7l0dhme9p61ou.apps.googleusercontent.com";

export default function GoogleLoginButton() {
    const { auth } = useContext(AuthContext);

    const onSuccess = (res) => {
        auth.setGoogleEndpoint();

    }

    const onFailure = (res) => {
        console.log("Failure: ", res);
    }

    return (
        <GoogleLogin
            theme="dark"
            clientId={clientId}
            onSuccess={onSuccess}
            onFailure={onFailure}
            scope='https://www.googleapis.com/auth/drive'
        />
    );
}
