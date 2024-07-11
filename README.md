<!-- testing webhook-->

#### 

<div align="center">
  <img height="60" src="https://github.com/tiramisyuz/ghcss-ext/blob/main/icons/ghcssbig.png?raw=true">

  <br>

  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/tiramisyuz/ghcss-ext?style=for-the-badge">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/tiramisyuz/ghcss-ext?style=for-the-badge">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/tiramisyuz/ghcss-ext?style=for-the-badge">

  <br>
  A Chrome extension to inject a CSS codeblock from Github profiles into the entire page.

  An idea emerged from people in the [Vencord](https://vencord.dev/) server wanting to bring back the Mathjax CSS injection bug(s).

<br>

<img src="https://files.catbox.moe/gbztli.png">
</div>

## Installation
### ⭐ Manual
[Make sure you have git installed](https://www.git-scm.com/downloads)
```bash
git clone https://github.com/tiramisyuz/ghcss-ext.git
bun install
bun start
```
This starts a live debug that changes everytime the code does. If you just want to build once; do `bun build` instead and load it unpacked in your browser.

### ⭐ Chrome
Head to the <a href="https://github.com/tiramisyuz/ghcss-ext/releases">releases</a>.

### Firefox
Get it from [the extension store](https://addons.mozilla.org/en-US/firefox/addon/ghcss/). The extension on the store is maintained by [@zoey-on-github](https://github.com/zoey-on-github).

## Usage
We apparently can't make up our mind on how the CSS injection should go, but right now you make a profile.css file and put whatever in it in a repo with the same name as you.

You also need to put this in your profile's README.md:
```md
![ghcss](https://ghcss.bims.sh/)
```

[(huge shoutout to bims for carrying this project with the backend)](https://github.com/Bims-sh)

## Contributing
Contributions are welcome. Please consistently follow the code style. I would prefer high quality PRs so be experienced lol
