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
