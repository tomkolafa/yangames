A single letter cell that reskins through theme variables. Building block of `Board`.

```jsx
<Tile letter="A" state="correct" />
<Tile letter="B" state="present" reveal revealDelay={180} />
<Tile letter="" state="empty" />
```

States: `empty · tbd · absent · present · correct`. Pass `accent`/`accentText` for the funky rainbow skin.
