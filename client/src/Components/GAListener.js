import {useEffect} from "react";
import ReactGA from "react-ga";
import {withRouter} from "react-router";
import PropTypes from "prop-types";


function sendPageView(location) {
    if (location.pathname.includes('/author')) {
        ReactGA.set({page: '/author'});
        ReactGA.pageview('/author');
    } else {
        ReactGA.set({page: location.pathname});
        ReactGA.pageview(location.pathname);
    }
    
}

function GAListener({children, trackingId, history}) {
    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            ReactGA.initialize('UA-165261916-1');
            sendPageView(history.location);
            return history.listen(sendPageView);
        }
    }, [history, trackingId]);

    return children;
}

GAListener.propTypes = {
    children: PropTypes.node,
    trackingId: PropTypes.string,
    history: PropTypes.shape({
        listen: PropTypes.func,
    }),
};

export default withRouter(GAListener);