The guess grid — composes `Tile`. Drop it under any `[data-theme]` and it reskins.

```jsx
<div data-theme="funky">
  <Board
    guesses={[{ letters:['s','q','u','a','d'], states:['correct','correct','correct','correct','correct'] }]}
    current="trace"
    rainbow
  />
</div>
```

`guesses` = submitted rows, `current` = typed row. `rainbow` enables funky per-column colour; `reveal` flips in the last row; `invalidRow` shakes a row.
