const appName = 'art-share-grp11';

exports.buildPath = function buildPath(route) {
    if (process.env.NODE_ENV === 'production')
        return 'https://' + appName + '.herokuapp.com' + route;
    else
        return 'http://10.127.16.28:5000' + route;
}