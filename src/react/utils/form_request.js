module.exports = function(type, data, url, callback) {

  // var formBody = [];
  // for (var property in data) {
  //   var encodedKey = encodeURIComponent(property);
  //   var encodedValue = encodeURIComponent(data[property]);
  //   formBody.push(encodedKey + "=" + encodedValue);
  // }
  // formBody = formBody.join("&")

  fetch(url, {
    method: type,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    response.json().then(data => callback(data));
  });
}
