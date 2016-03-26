name
  h1(onclick="{_onClick}") { opts.last }
  button.mui-btn.mui-btn--primary { opts.first }
  script(type="coffee").
    console.log 'test in name.tag'
    console.log '@', @
    _tmp = @
    @._onClick = (e) ->
      console.log 'titleclicked', e
      console.log _tmp._riot_id
