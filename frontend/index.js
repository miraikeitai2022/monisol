function initAutocomplete() 
{
  var latlng1 = new google.maps.LatLng(35.705947, 139.651252);  // VAL研究所（現在位置）
  var latlng2 = new google.maps.LatLng(35.705469, 139.649610);  // 神奈川工科大学（定数）
  var map;
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();

  // 地図初期化のオプション
  var mapOptions = 
  {
      zoom: 17,
      center: latlng1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: true,
  };
  // 地図を表示
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  // SearchBoxの処理
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
  map.addListener("bounds_changed", () => 
  {
    searchBox.setBounds(map.getBounds());
  });
  ////"bound_changed"イベントは(見えてる範囲の地図･ビューポートに変化があったときに発火)
  

  let markers = [];
  searchBox.addListener("places_changed", () => {
  ////"place_chaged"イベントはAutoCompleteクラスのイベント.
  ////https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.place_changed

    const places = searchBox.getPlaces();
    ////"getPlaces"メソッドはクエリ(検索キーワード)を配列(PlaceResult)で返す。
    ////https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.place_changed

    if (places.length == 0) 
    {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      //"forEach"メソッドは引数にある関数へ、Mapオブジェクトのキー/値を順に代入･関数の実行をする。
        //Mapオブジェクト:
          //https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map
      marker.setMap(null);
      ////setMapメソッドはMarker(Polyline,Circleなど)クラスのメソッド。Markerを指定した位置に配置する。引数nullにすると地図から取り除く。
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    ////"LatLngBounds"クラスは境界を作るインスンタンスを作成。引数は左下、右上の座標。
    ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/LatLngBounds/#:~:text=LatLngBounds%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AF%E5%A2%83%E7%95%8C(Bounding,%E4%BD%9C%E3%82%8B%E3%81%93%E3%81%A8%E3%82%82%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82
    places.forEach((place) => 
    {
      if (!place.geometry) 
      {
        ////"geometry"はplaceライブラリのメソッド。

        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        ////"icon"はアイコンを表すオブジェクト。マーカーをオリジナル画像にしたいときなど。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/Icon/
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        ////"Point"クラスはマーカーのラベルなどの位置を決めるインスタンスメソッド。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/Point/

        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) 
      {
        ////viewport"メソッド
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
        ////"union"メソッドはLatLngBoundsクラスのメソッド。自身の境界に指定した境界を取り込んで合成する。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/LatLngBounds/union/
      } else {
        bounds.extend(place.geometry.location);
        ////"extend"メソッドはLatLngBoundsクラスのメソッド。自身の境界に新しく位置座標を追加する。
        ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/LatLngBounds/extend/
      }
    });
    map.fitBounds(bounds);
    ////"fitBounds"メソッドはmapクラスのメソッド。指定した境界を見えやすい位置にビューポートを変更する。
    ////https://lab.syncer.jp/Web/API/Google_Maps/JavaScript/Map/fitBounds/#:~:text=Map.fitBounds()%E3%81%AFMap,%E5%A4%89%E6%9B%B4%E3%81%97%E3%81%A6%E3%81%8F%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82
  });

  // ルートを取得
  var request = 
  {
    origin: latlng1,        // 出発地点の緯度、経度
    destination: latlng2,   // 到着地点の緯度、経度
    travelMode: google.maps.DirectionsTravelMode.WALKING // ルートの種類
  };
  directionsService.route(request, function(result, status) {
    directionsRenderer.setDirections(result); // 取得したルートをセット
    directionsRenderer.setMap(map); // ルートを地図に表示
  });
}
function getMyPlace() 
{
  // HTMLに座標書き込む
  var out_lat = document.getElementById("lat");
  var out_lon = document.getElementById("lon");

  if (!navigator.geolocation)
  {
    // Geolocation apiがサポートされていない場合
    //output.innerHTML = "<p>Geolocationはあなたのブラウザーでサポートされておりません</p>";
    return;
  }
  // ジオロケーションに成功した場合
  function success(position) 
  {
    var latitude  = position.coords.latitude;   // 緯度
    var longitude = position.coords.longitude;  // 経度

    // 位置情報
    latlng = new google.maps.LatLng( latitude , longitude );

    // HTMLに書き出し
    out_lat.innerHTML = latitude;
    out_lon.innerHTML = longitude;
 
    // Google Mapsに書き出し
    var map = new google.maps.Map( document.getElementById( 'map_canvas' ),
    {
        zoom: 15 ,// ズーム値
        center: latlng ,// 中心座標
    } ) ;
    // マーカーの新規出力
    new google.maps.Marker( {
      map: map ,
      position: latlng ,
    } ) ;
  };
  function error() 
  {
    //エラーの場合
    output.innerHTML = "座標位置を取得できません";
  };
  navigator.geolocation.getCurrentPosition(success, error);//成功と失敗を判断
}

window.addEventListener('DOMContentLoaded', function()
{
  var interval_id = null;

  interval_id = setInterval(() => 
  {
    // 現在位置
    getMyPlace();

  }, 5000); // 5000ミリ秒ごとに実行

});
