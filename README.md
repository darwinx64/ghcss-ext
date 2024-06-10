# ghcss-ext
A Chrome extension to inject a CSS codeblock from Github profiles into the entire page.

![hold on](https://files.catbox.moe/gbztli.png)

<a href="https://github.com/tiramisyuz/ghcss-ext/releases">Releases (compiled CRXs)</a>

If you use Firefox either use the Firefox branch or get it from [the extension store](https://addons.mozilla.org/en-US/firefox/addon/ghcss/). The extension on the store is maintained by [@zoey-on-github](https://github.com/zoey-on-github).

## Usage
Put the following into your profile's README.md (**this is just an example**):

```md
<details id="ghusrcss">
<summary>Github User CSS</summary>
<code id="ghusrcss-code">
body {
  background: red;
}
p, header, a, span {
  filter: drop-shadow(2px 2px 1px #262626);
}
</code>
</details>
```

.. and install the extension. **You may customize this however you want, however, make sure to keep the IDs the same**

## Contributing
Contributions are welcome.
