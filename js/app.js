const searchValue = document.querySelector(".search-value");
const submitBtn = document.querySelector(".submit-btn");
const videosContainer = document.querySelector(".items");
const displayVideoContainer = document.querySelector(".display-video");

const KEY = config.API_KEY;
const maxResults = 10;

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  videosContainer.innerHTML = "";
  displayVideoContainer.innerHTML = "";

  if (searchValue.value) {
    getVideoData(searchValue.value);
  }

  searchValue.value = "";
});

const getVideoData = (searchTerm) => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${KEY}&type=video&part=snippet&maxResults=${maxResults}&q=${searchTerm}`;
  fetchData(url)
    .then((data) => renderVideoList(data.items))
    .catch((err) => console.log(err));
};

const getShuffledArr = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

const renderVideoList = (videos) => {
  // sort(() => Math.random() - 0.5);
  getShuffledArr(videos).map((video) => {
    const { videoId } = video.id;
    const {
      title,
      channelTitle,
      thumbnails: {
        medium: { url },
      },
    } = video.snippet;

    displayVideo(videoId, title);

    const videoListHtml = `
        <li class="item" onclick="displayVideo('${videoId}', '${title}')">
            <div class="thumbnail">
                <img src="${url}" alt="${title}" />
            </div>
            <div class="intro">
                <h2>${title}</h2>
                <p>By <span class="color-primary">${channelTitle}</span></p>
            </div>
        </li>
    `;
    videosContainer.insertAdjacentHTML("beforeend", videoListHtml);

    
  });
};

const displayVideo = (videoId, title) => {
  window.scrollTo(0, 0);
  displayVideoContainer.innerHTML = "";
  videoDisplayHtml = `
    <div class="video">
      <iframe
        src="https://www.youtube.com/embed/${videoId}"
        title="${title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `;
  displayVideoContainer.insertAdjacentHTML("beforeend", videoDisplayHtml);
};

(function () {
  function getCurrentScript() {
    if (document.currentScript) {
      return document.currentScript;
    }
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  }

  function getEmbedPlaceholder() {
    var script = getCurrentScript();
    var matches = String(script.src).match(/id=([0-9]+)/);
    var placeholder = matches
      ? document.querySelector('[data-embed-placeholder="' + matches[1] + '"]')
      : null;
    if (placeholder) {
      return placeholder;
    }
    return script;
  }

  function insertBefore(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement);
  }

  function createFrame(url, height, borderRadius, border, shadow) {
    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText =
      'width: 100% !important; max-width: 100% !important; vertical-align: top !important; border: ' +
      (border ? border.width : '0') +
      'px solid ' +
      (border ? border.color : 'transparent') +
      ' !important; border-radius: ' +
      borderRadius +
      'px !important; box-shadow: ' +
      (shadow ? shadow.x : '0') +
      'px ' +
      (shadow ? shadow.y : '0') +
      'px ' +
      (shadow ? shadow.blur : '0') +
      'px ' +
      (shadow ? shadow.spread : '0') +
      'px ' +
      (shadow ? shadow.color : 'transparent') +
      ' !important; box-sizing: border-box !important;';

    // sets dynamicly height of container for list widget
    function setHeight(dynamicHeight, maximumHeight, widgetType) {
      var newHeight = null;
      if (widgetType === 'carousel') {
        newHeight = dynamicHeight;
      } else if (dynamicHeight < maximumHeight) {
        newHeight = dynamicHeight;
      } else {
        newHeight = maximumHeight;
      }
      iframe.style.setProperty('max-height', newHeight + 'px', 'important');
      iframe.style.setProperty('height', newHeight + 'px', 'important');
    }
    // post message listener
    window.addEventListener(
      'message',
      (event) => {
        var result = Object(event.data);
        var { data, type, widgetType } = result;
        if (type === 'widgetheight') {
          setHeight(data.height, height, widgetType);
        }
      },
      false
    );
    return iframe;
  }

  try {
    var displayContainerBorder = false;
    var displayContainerShadow = false;
    insertBefore(
      createFrame(
        'https://js-youtube.netlify.app',
        '2800',
        '5',
        displayContainerBorder
          ? {
              width: '0',
              color: '#E0E0E0',
            }
          : null,
        displayContainerShadow
          ? {
              x: '0',
              y: '0',
              blur: '0',
              spread: '0',
              color: '#E0E0E0',
            }
          : null
      ),
      getEmbedPlaceholder()
    );
  } catch (error) {
    if (console) {
      console.warn(error);
    }
  }
})();