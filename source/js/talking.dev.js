!(function() {
  var _data = {};
  var _xhr = new XMLHttpRequest();

  // default templates
  var _template = `
<form>
  用户名: <br><input name="owner.name" required/><br>
  邮箱: <br><input name="owner.email" required/><br>
  网址: <br><input name="owner.url" required/><br>
  评论内容：<br><textarea name="htmlText" required></textarea><br>
  <button id="submitCommentBtn">发表</button>
</form>
<div id="comments"></div>
`;

  function _http(options) {
    _xhr.onreadystatechange = function(evt) {
      if (_xhr.readyState === 4 && _xhr.status === 200) {
        var res = JSON.parse(_xhr.responseText);
        if (options.success) options.success(res);
      }
    };
    _xhr.open(options.method, options.url);
    for (var k in options.headers) {
      if (options.headers.hasOwnProperty(k)) {
        _xhr.setRequestHeader(k, options.headers[k]);
      }
    }
    _xhr.send(options.data || null);
  }

  function _getComments() {
    _http({
      method: 'GET',
      url: _data.api + '?post_url=' + location.href,
      success: function(res) {
        if (_data.render) _data.render(res);
      }
    });
  }

  function _createComment(data) {
    _http({
      method: 'POST',
      url: _data.api,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        _data.created(res);
      }
    });
  }

  function _init() {
    _data.el.innerHTML = `${_data.template || _template}`;
    _data.el.addEventListener('click', function(evt) {
      evt.preventDefault();
      if (evt.target.id === 'submitCommentBtn') {
        var newItem = _data.submit();
        if (newItem) _createComment(newItem);
      }
    });
    _data.inited(_data.el);
    _getComments();
  }

  function Talking(cb) {
    _data = cb();
    _init();
  }

  window.Talking = window.Talking || Talking;
})();
