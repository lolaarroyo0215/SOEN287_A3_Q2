const { parse, serialize }  = require('cookie');

function trackVisits(req, res) {
try{
    //parse cookies from request header
    const cookies = parse(req.headers.cookie || '');

    //get the number of visits from the cookies, set default to 0
    let visits = cookies.visits ? parseInt(cookies.visits) : 0;

    //get last visit time from cookies, default null
    let lastVisit = cookies.lastVisit || null;

    visits += 1;
    const now = new Date();

    //set cookies w updated visit count and current visit time
    res.setHeader('Set-Cookie', [
        serialize('visits', visits.toString(), { maxAge: 1000 * 60 * 60 * 24 * 365, httpOnly: true }),
        serialize('lastVisit', now.toString(), { maxAge: 1000 * 60 * 60 * 24 * 365, httpOnly: true }),
    ]);

    //message based on visit count and time
    let message = '';
    if(visits === 1){
        message = 'Welcome to my webpage! It is your first time here.';
    } else {
        message = `Hello this is the ${visits} time that you are visiting my webpage<br>`;
        if(lastVisit){
            message += `The last time you visited my webpage was on: ${new Date(lastVisit).toString()}`;
        }
    }

    return message;
} catch(error) {
    console.error('Error in trackVisits:', error.message);
    return 'Error in handling visit';
    }
}

module.exports = { trackVisits };