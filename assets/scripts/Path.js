const appName = 'art-share-grp11';

exports.buildPath = function buildPath(route) {
    return 'https://' + appName + '.herokuapp.com' + route;
}