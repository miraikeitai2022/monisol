<!DOCTYPE html>
<html>
  <head>
    <title>Places Search Box</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <!--｢key=YOUR_API｣の部分に取得したAPIキーを記述
    今回は検索機能を追加するのでPlacesライブラリを使う為｢libraries=places｣を追記
    ｢v=weekly｣はマップ自体の更新頻度を表しています。何も記述しなければ四半期に一度の更新となり、この記述だと毎週更新で最新状態を保てます。なので別に記述しなくても大丈夫です。-->
    <link rel="stylesheet" type="text/css" href="./style.css" />
    <script src="./index.js"></script>
  </head>
  <body>
  <!--ここで指定したidにjavascriptでマップを表示させます。-->
    <input
      id="pac-input"
      class="controls"
      type="text"
      placeholder="Search Box"
    />
    <div id="map" style="width:620px; height:400px"></div>
    <p id="latlng"></p>
    
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDFgwp8yQqt3Jtj7rm3tlQzvdP6Kadub8I&callback=initAutocomplete&libraries=places&v=weekly"
      defer
    >
  </script> 
  </body>
</html>
