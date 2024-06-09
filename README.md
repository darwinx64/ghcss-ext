# ghcss-ext
A Chrome extension to inject a CSS codeblock from Github profiles into the entire page.

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

## Troubleshooting
If injection doesn't work, try enabling it in the extension settings from the icon

If you'd like to see the code on profiles for the CSS they inject, you can toggle that in settings

## Contributing
Contributions are welcome.
