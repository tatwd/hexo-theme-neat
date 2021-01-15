!(function () {
  function renderItem(item) {
    return `
      <div class="item" data-id=${item.id}>
        <a href="${
          item.owner.url
        }" target="_blank" class="text--underline text--bold">${
      item.owner.name
    }</a>
        <span>${new Date(item.utcCreated).toLocaleString()}</span>
        <p>${item.htmlText}</p>
        <hr style="border:1px solid #eee;">
      </div>
    `;
  }

  function getOwnerInfo() {
    var name = inputOwnerName.value.trim(),
      email = inputOwnerEmail.value.trim(),
      url = inputOwnerUrl.value.trim();
    return { name, email, url };
  }

  /*function toggleOwnerInfoInputStuff(show) {
    var display = show ? 'block' : 'none';
    inputOwnerName.parentNode.style.display = display;
    inputOwnerEmail.parentNode.style.display = display;
    inputOwnerUrl.parentNode.style.display = display;
    document.querySelector('.tip').style.display = display;
  }*/

  var inputOwnerName, inputOwnerEmail, inputOwnerUrl, inputHtmlText;
  var h1 = document.querySelector("h1");
  var postTitle = h1 ? h1.innerHTML : "undefined";
  var ownerInfo = JSON.parse(localStorage.getItem("COMMENT_OWNER"));

  new Talking(() => {
    return {
      el: document.querySelector(".post--comment"),
      api: "<%- theme.comment_sys.api %>",
      template: document.querySelector("#comment-tmpl").innerHTML,

      inited: (el) => {
        inputOwnerName = el.querySelector('input[name="owner_name"]');
        inputOwnerEmail = el.querySelector('input[name="owner_email"]');
        inputOwnerUrl = el.querySelector('input[name="owner_website"]');
        inputHtmlText = el.querySelector('textarea[name="html_text"]');
        el.querySelector(".comments").innerHTML += "loading ...";
        if (ownerInfo) {
          inputOwnerName.value = ownerInfo.name;
          inputOwnerEmail.value = ownerInfo.email;
          inputOwnerUrl.value = ownerInfo.url;
        }
      },

      render: (res) => {
        var html = "";
        res.detail.list.forEach((i) => {
          html += renderItem(i);
        });
        document.querySelector(".comments").innerHTML = html || "赶快评论吧！";
      },

      submit: () => {
        ownerInfo = getOwnerInfo();

        var /*name = inputOwnerName.value.trim()
          , email = inputOwnerEmail.value.trim()
          , url = inputOwnerUrl.value.trim()
          ,*/ htmlText = inputHtmlText.value.trim(),
          postUrl = location.pathname;
        if (!ownerInfo.name) return alert("请输入昵称");
        if (!ownerInfo.email) return alert("请输入邮箱");
        if (!htmlText) return alert("请输入评论内容");
        var s = htmlText
          .replace(/<(\/?script)>/g, ($1, $2) => "&lt;" + $2 + "&gt;")
          .replace(/\r?\n/g, "<br>");
        htmlText = s;
        return {
          owner: ownerInfo,
          postTitle,
          postUrl,
          htmlText,
        };
      },

      created: (res) => {
        //document.querySelector('form').reset();
        inputHtmlText.value = "";
        localStorage.setItem("COMMENT_OWNER", JSON.stringify(ownerInfo));
        var dom = document.querySelector(".comments");
        var html = renderItem(res.detail);
        dom.innerHTML = dom.innerHTML.length < 10 ? html : html + dom.innerHTML;
      },
    };
  });
})();
