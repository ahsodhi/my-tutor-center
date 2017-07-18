module.exports = function(url, callback) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  }).then(response => {
    response.json().then(data => callback(data));
  });
}
