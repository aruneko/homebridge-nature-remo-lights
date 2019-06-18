# Homebridge Plugin for Nature Remo Light Devices
## これなに
NatureRemoに登録された照明機器を操作するためのHomebridge用プラグインです。

## 使い方
頑張ってnpmで入れてください。

## configの書き方
`accessories` に書き加えます。下記説明に注意しながら記入してください。複数のデバイスがある場合にはそのまま複数登録してください。

- `accessory` は `NatureRemoLightDevice` で固定です。
- `accessToken` は [公式サイト](https://home.nature.global/)から発行してください。
- `id` は下記のID取得例に従って取得してください。
- `name` は任意に設定可能です。


```json
"accessories": [
  {
    "accessory": "NatureRemoLightDevice",
    "accessToken": "SECRET_TOKEN",
    "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    "name": "リビングの電気"
  },
  {
      "accessory": "NatureRemoLightDevice",
      "accessToken": "SECRET_TOKEN",
      "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      "name": "寝室の電気"
    },
]
```

## ID取得例
curlコマンドでの例です。 `SECRET_TOKEN` の箇所は各自置き換えてください。

このAPIを叩くと登録されているデバイスの一覧をJSONのリスト形式で取得できます。そのトップ階層にある`id`キーがconfigに記入する`id`となります。

```bash
$ curl -X GET "https://api.nature.global/1/appliances" -H "Authorization: Bearer SECRET_TOKEN"
```

## ライセンス
MIT