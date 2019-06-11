const assert = require('assert');
const axios = require('axios');
const PORT = 3033;

function expectReq(method, status, data, id) {
  let url = 'http://localhost:' + PORT + '/movies' + (id ? '/' + id : '');
  return axios({
    method,
    url,
    data,
    validateStatus: statusCode => {
      if (process.env.STRICT) {
        return status === statusCode;
      } else {
        return true;
      }
    }
  });
}

function cleanUp() {
  return axios({
    method: 'DELETE',
    url: 'http://localhost:' + PORT + '/movies'
  });
}

describe('/movies', function() {
  afterEach(function() {
    return cleanUp();
  });

  it('Handles DELETE /', function() {
    return expectReq('DELETE', 204);
  });

  it('Handles POST / and GET /:id', function() {
    let o = {title: 'Godfather', rating: 5};
    return expectReq('POST', 201, o)
      .then(res => expectReq('GET', 200, undefined, res.data.id))
      .then(res => {
        assert.ok(res.data.id);
        delete res.data.id;
        assert.deepEqual(res.data, o);
      });
  });

  it('Handles GET / when list is empty', function() {
    return expectReq('GET', 200)
    .then(res => {
      assert.deepStrictEqual(res.data, {movies: []});
    });
  });

  it('Handles GET / when list is populated', function() {
    let data = [
      {title: 'The Godfather', rating: 5},
      {title: 'The Godfather 2', rating: 5},
      {title: 'The Godfather 3', rating: 4},
    ];

    return Promise.all(data.map(x => expectReq('POST', 201, x)))
      .then(() => expectReq('GET', 200))
      .then(res => {
        let list = res.data.movies;
        let ok = data.every(x => list.find(y => y.title === x.title && y.rating === x.rating));
        assert.ok(ok);
      });
  });

  it('Handles PUT /:id', function() {
    let o = {title: 'The Godfather', rating: 5};
    return expectReq('POST', 201, o)
      .then(res => expectReq('GET', 200, undefined, res.data.id))
      .then(res => {
        o.rating = 4;
        return expectReq('PUT', 200, o, res.data.id);
      })
      .then(res => expectReq('GET', 200, undefined, res.data.id))
      .then(res => {
        assert.deepEqual(res.data.rating, 4);
      });
  });

  it('Handles DELETE /:id', function() {
    let o = {title: 'The Godfather', rating: 5};
    let o2 = {title: 'The Godfather 2', rating: 5};
    return Promise.all([
      expectReq('POST', 201, o),
      expectReq('POST', 201, o2)
    ])
      .then(results => {
        return expectReq('DELETE', 204, undefined, results[0].data.id)
        .then(() => expectReq('GET', 200, undefined, results[1].data.id))
        .then(res => {
          delete res.data.id;
          assert.deepEqual(res.data, o2);
        });
      });
  });

  it('Returns 400 for invalid data', function() {
    let o = {name: 'The Godfather', rating: 3};
    let o2 = {title: 'The Godfather', rating: '3'};
    let o3 = {title: '', rating: 3};
    return Promise.all([
      expectReq('POST', 400, o),
      expectReq('POST', 400, o2),
      expectReq('POST', 400, o3),
    ])
      .then(() => expectReq('GET', 200))
      .then(res => {
        assert.deepEqual(res.data, {movies: []});
      });
  });

  it('Returns 404 for non existing resource', function() {
    return expectReq('GET', 404, undefined, 'Banana');
  });
});
