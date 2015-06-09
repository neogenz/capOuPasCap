'user strict';

__.namespace(app, 'httpRequestOptions');

app.httpRequestOptions = {
    urlHeader: app.config.webApi.protocol + '://' + app.config.webApi.domain + ':' + app.config.webApi.port,
    buildPostRequestOptToCallThisUrl: _buildPostRequestOptToCallThisUrl,
    buildGetRequestOptToCallThisUrl: _buildGetRequestOptToCallThisUrl,
    buildPutRequestOptToCallThisUrl: _buildPutRequestOptToCallThisUrl,
    buildDeleteRequestOptToCallThisUrl: _buildDeleteRequestOptToCallThisUrl,
    buildPostFormDataRequestOptToCallThisUrl: _buildPostFormDataRequestOptToCallThisUrl
};

//Private functions
function _buildPostRequestOptToCallThisUrl(url, bodyRequest) {
    return req = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: bodyRequest
    };
}

function _buildPostFormDataRequestOptToCallThisUrl(url, picture) {
    return req = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': undefined //Because the browser client must build her boundary
        },
        data: {
            file: picture
        },
        transformRequest: function (data) {
            var fd = new FormData();
            angular.forEach(data, function (value, key) {
                fd.append(key, value);
            });
            return fd;
        }
    };
}

function _buildGetRequestOptToCallThisUrl(url) {
    return req = {
        method: 'GET',
        url: url
    };
}

function _buildPutRequestOptToCallThisUrl(url, bodyRequest) {
    return req = {
        method: 'PUT',
        url: url,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: bodyRequest
    };
}

function _buildDeleteRequestOptToCallThisUrl(url) {
    return req = {
        method: 'DELETE',
        url: url
    };
}