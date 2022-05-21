let songList;
let searchResult = [];
let nowSongNum;
let player;
let prevSongNum;
let wholeSeconds;
let currentSeconds;
let countUpSecondsInterval;
let countUpSecondsFlag = 0;
let playerFlag = 0;
let repeatFlag = 0;
let shuffleFlag = 0;
let repeatCount = 1;


function unescapeHTML(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/&#x60;/g, '`')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    ;
}


fetch('https://script.google.com/macros/s/AKfycbxjLZhe1S-tRL5lBLuQjv_cFj2WffT0RUUfUILQGZOioj-IqiCV2uDHFeR1zUoMGjgN/exec')
  .then(response => {
    return response.json();
  })
  .then(data => {
    songList = data;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let tableInsert = '';
    for (let i = songList.length - 1; i >= 0; i--) {
      tableInsert += '<tr id="rowOfSongNum' + i + '"><td class="video-thumb"><label class="clickable video-thumb-area" for="buttonOfSongNum' + i + '"><img class="video-thumb-img" src="https://i.ytimg.com/vi_webp/' + songList[i]['videoId'] + '/default.webp"></label></td><td class="song-title"><label class="song-title-label clickable" title="' + songList[i]['songTitle'] + '"><button type="button" class="song-title-button" id="buttonOfSongNum' + i + '" value="' + i + '">' + songList[i]['songTitle'] + '</button></label></td><td class="artist"><label class="clickable" for="buttonOfSongNum' + i + '" title="' + songList[i]['artist'] + '"><span class="artist-text">' + songList[i]['artist'] + '</span></label></td><td class="video-title"><a class="video-title-link" href="https://youtu.be/' + songList[i]['videoId'] + '?t=' + songList[i]['startSeconds'] + '" target="_blank" rel="noopener noreferrer" title="' + songList[i]['videoTitle'] + '">' + songList[i]['videoTitle'] + '</a></td><td class="post-time"><span class="post-time-text">' + songList[i]['postDate'] + '</span></td></tr>';

      searchResult[i] = i;
    }

    tableArea.innerHTML = tableInsert;
    entireNum.textContent = songList.length;
    searchResultNum.textContent = searchResult.length;

    const songButtons = document.getElementsByClassName('song-title-button');
    for (let songButton of songButtons) {
      songButton.addEventListener('click', (e) => {
        playSong(Number(e.target.value));
      });
    }
  })
  .catch(error => {
    window.alert('【エラー】\nsongListの取得に失敗しました。しばらく時間をおいて再度アクセスしてください。');
  });


function onYouTubeIframeAPIReady() {
  nowSongNum = songList.length - 1;

  player = new YT.Player('player', {
    playervars: {
      'rel': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}


function insertSeekBarValue(seconds) {
  if (typeof seconds == 'number') {
    menuTimeSeekBar.value = seconds;
  }
  else {
    seconds = menuTimeSeekBar.value;
  }

  const percent = seconds / wholeSeconds * 100;
  menuTimeSeekBar.style.backgroundImage = 'linear-gradient(to right, var(--brand-color) ' + percent + '%, var(--gray1) ' + percent + '%)';
}


function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = (seconds % 60).toString().padStart(2, '0');
  return minutes + ':' + remainderSeconds;
}


function insertSongInfo() {
  if (typeof (prevSongNum) == 'number') {
    document.getElementById('rowOfSongNum' + prevSongNum).classList.remove('now-song-row');
  }
  document.getElementById('rowOfSongNum' + nowSongNum).classList.add('now-song-row');

  playingBarThumb.setAttribute('src', 'https://i.ytimg.com/vi_webp/' + songList[nowSongNum]['videoId'] + '/default.webp');

  playingBarSongTitle.innerHTML = songList[nowSongNum]['songTitle'];
  playingBarSongTitle.setAttribute('title', unescapeHTML(songList[nowSongNum]['songTitle']));

  playingBarArtist.innerHTML = songList[nowSongNum]['artist'];
  playingBarArtist.setAttribute('title', unescapeHTML(songList[nowSongNum]['artist']));

  playingBarPostDate.textContent = songList[nowSongNum]['postDate'].substring(0, 10) + ' 配信';

  wholeSeconds = songList[nowSongNum]['endSeconds'] - songList[nowSongNum]['startSeconds'] || Math.round(player.getDuration());
  insertSeekBarValue(0);
  menuTimeSeekBar.max = wholeSeconds;
  menuTimeTextWhole.textContent = formatSeconds(wholeSeconds);
}

function onPlayerReady() {
  player.cueVideoById({
    videoId: songList[nowSongNum]['videoId'],
    startSeconds: songList[nowSongNum]['startSeconds'],
    endSeconds: songList[nowSongNum]['endSeconds']
  });

  insertSongInfo();

  document.querySelector('body').classList.add('loaded');
}


function toPlayIcon() {
  playingBarPause.classList.add('to-hide');
  playingBarPlay.classList.remove('to-hide');
  menuControllerPause.classList.add('to-hide');
  menuControllerPlay.classList.remove('to-hide');

  playingBarStatus.setAttribute('title', '再生');
  menuControllerStatus.setAttribute('title', '再生');
}

function toPauseIcon() {
  playingBarPause.classList.remove('to-hide');
  playingBarPlay.classList.add('to-hide');
  menuControllerPause.classList.remove('to-hide');
  menuControllerPlay.classList.add('to-hide');

  playingBarStatus.setAttribute('title', '一時停止');
  menuControllerStatus.setAttribute('title', '一時停止');
}


function getSongCurrentTime() {
  currentSeconds = Math.round(player.getCurrentTime() - songList[nowSongNum]['startSeconds']);
  insertSeekBarValue(currentSeconds);
  menuTimeTextNow.textContent = formatSeconds(currentSeconds);
}


function startCountingUpSeconds() {
  countUpSecondsFlag = 1;
  countUpSecondsInterval = setInterval(getSongCurrentTime, 250);
}


function stopCountingUpSeconds() {
  clearInterval(countUpSecondsInterval);
  countUpSecondsFlag = 0;
}


// プレーヤーの状態が変更されたとき
function onPlayerStateChange(e) {
  // 再生終了のとき
  if (e.data == 0 && playerFlag == 1) {
    toPlayIcon();
    playSong();
    playerFlag = 0;
    stopCountingUpSeconds();
  }

  // 一時停止のとき
  else if (e.data == 2) {
    toPlayIcon();
    playerFlag = 0;
    stopCountingUpSeconds();
  }

  // バッファリング中のとき
  else if (e.data == 3) {
    toPauseIcon();
  }

  // 再生中のとき
  else if (e.data == 1) {
    if (nowSongNum !== prevSongNum) {
      insertSongInfo();
    }
    toPauseIcon();
    playerFlag = 1;
    if (countUpSecondsFlag == 0) {
      startCountingUpSeconds();
    }
  }
}


function playSong(songNum) {
  let nextSongNum;

  // 曲を指定されたとき
  if (typeof (songNum) == 'number') {
    nextSongNum = songNum;
  }
  // 連続で再生されたとき
  else if (repeatFlag == 0) {
    if (searchResult.length != 0) {
      if (shuffleFlag == 0) {
        const checkForExistence = searchResult.indexOf(nowSongNum);

        // 通常再生で最後の曲になったとき
        if (checkForExistence <= 0) {
          nextSongNum = searchResult[searchResult.length - 1];
        }
        // 通常再生のとき
        else {
          nextSongNum = searchResult[checkForExistence - 1];
        }
      }
      // シャッフル再生のとき
      else {
        nextSongNum = searchResult[Math.floor(Math.random() * searchResult.length)];
      }
    }
    // 検索条件でリストが空のとき
    else {
      window.alert('検索条件に一致する項目がないため、次の曲を再生できません。');
      return false;
    }
  }
  // リピート再生のとき
  else {
    nextSongNum = nowSongNum;
  }

  // 同じ曲を2回以上連続で再生したとき
  if (prevSongNum == nowSongNum) {
    repeatCount++;

    // 同じ曲聞きすぎアラート
    const maxRepeatCount = 5;
    if (repeatCount > maxRepeatCount) {
      const confirm = window.confirm('同じ曲を' + repeatCount + '回連続で再生しました。たまには他の曲もいかがですか？');

      if (confirm) {
        repeatCount = 1;
        nextSongNum = searchResult[Math.floor(Math.random() * searchResult.length)];
      }
      else {
        player.cueVideoById({
          videoId: songList[nextSongNum]['videoId'],
          startSeconds: songList[nextSongNum]['startSeconds'],
          endSeconds: songList[nextSongNum]['endSeconds']
        });

        return false;
      }
    }
  }
  else {
    repeatCount = 1;
  }

  player.loadVideoById({
    videoId: songList[nextSongNum]['videoId'],
    startSeconds: songList[nextSongNum]['startSeconds'],
    endSeconds: songList[nextSongNum]['endSeconds']
  });

  prevSongNum = nowSongNum;
  nowSongNum = nextSongNum;
}


function onPlayerError() {
  playerFlag = 0;

  setTimeout(function () {
    if (playerFlag == 0) {
      playSong();
    }
  }, 5000);
}


searchForm.addEventListener('input', searchSong);
function searchSong() {
  const searchWord = searchText.value;

  if (searchWord == '') {
    toClearSearchValue.classList.add('invisible');
  }
  else {
    toClearSearchValue.classList.remove('invisible');
  }

  const searchWordRegex = new RegExp(searchWord, 'i');

  searchResult = songList.flatMap((value, index) => {
    const rowOfIndexSongNum = document.getElementById('rowOfSongNum' + index);
    const testOfSongTitle = searchWordRegex.test(unescapeHTML(value.songTitle));
    const testOfArtist = searchWordRegex.test(unescapeHTML(value.artist));

    if (testOfSongTitle || testOfArtist) {
      rowOfIndexSongNum.classList.remove('to-hide');
      return index;
    }
    else {
      rowOfIndexSongNum.classList.add('to-hide');
      return [];
    }
  });

  searchResultNum.textContent = searchResult.length;
}


toClearSearchValue.addEventListener('click', function () {
  searchText.value = '';
  searchText.focus();
  searchSong();
})


searchForm.addEventListener('keypress', function (e) {
  if (e.key == 'Enter') {
    e.preventDefault();
  }
});


window.addEventListener('scroll', function () {
  if (window.pageYOffset > window.innerHeight) {
    toPageTop.classList.remove('invisible');
  }
  else {
    toPageTop.classList.add('invisible');
  }
});


toPageTop.addEventListener('click', function () {
  scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


playingBarThumbButton.addEventListener('click', function () {
  const rowOfNowSongNum = document.getElementById('buttonOfSongNum' + nowSongNum);

  rowOfNowSongNum.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  rowOfNowSongNum.focus({ preventScroll: true });
});


playingBarStatus.addEventListener('click', changePlayerStatus);
menuControllerStatus.addEventListener('click', changePlayerStatus);
function changePlayerStatus() {
  if (playerFlag == 1) {
    toPlayIcon();
    player.pauseVideo();
    playerFlag = 0;
  }
  else {
    toPauseIcon();
    player.playVideo();
    playerFlag = 1;
  }
}


menuButton.addEventListener('click', function () {
  document.querySelector('body').classList.toggle('open-nav');

  if (menuButton.getAttribute('aria-expanded') == 'false') {
    menuButton.setAttribute('aria-expanded', true);
    menuButton.setAttribute('title', 'メニューを閉じる');
  }
  else {
    menuButton.setAttribute('aria-expanded', false);
    menuButton.setAttribute('title', 'メニューを開く');
  }
});


menuControllerRepeat.addEventListener('click', function () {
  if (repeatFlag == 1) {
    menuControllerRepeat.classList.add('disabled');
    menuControllerRepeat.setAttribute('title', '1曲リピートを有効にする');
    repeatFlag = 0;
  }
  else {
    menuControllerRepeat.classList.remove('disabled');
    menuControllerRepeat.setAttribute('title', '1曲リピートを無効にする');
    repeatFlag = 1;
  }
});


menuControllerPrev.addEventListener('click', function () {
  playSong(nowSongNum);
});


menuControllerNext.addEventListener('click', playSong);


menuControllerShuffle.addEventListener('click', function () {
  if (shuffleFlag == 1) {
    menuControllerShuffle.classList.add('disabled');
    menuControllerShuffle.setAttribute('title', 'シャッフルを有効にする');
    shuffleFlag = 0;
  }
  else {
    menuControllerShuffle.classList.remove('disabled');
    menuControllerShuffle.setAttribute('title', 'シャッフルを無効にする');
    shuffleFlag = 1;
  }
});


menuTimeSeekBar.addEventListener('input', function () {
  stopCountingUpSeconds();
  insertSeekBarValue();
  menuTimeTextNow.textContent = formatSeconds(menuTimeSeekBar.value);
});


menuTimeSeekBar.addEventListener('change', function () {
  playerFlag = 0;

  player.loadVideoById({
    videoId: songList[nowSongNum]['videoId'],
    startSeconds: songList[nowSongNum]['startSeconds'] + Number(menuTimeSeekBar.value),
    endSeconds: songList[nowSongNum]['endSeconds']
  });
});
