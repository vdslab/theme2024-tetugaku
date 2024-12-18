import requests
import json
from apiKey import my_api_key
import os

api_url = "https://sheets.googleapis.com/v4/spreadsheets/1ECmr-99sZb5I1yY3Lcyy8kxDPmqlKGU6s-3S53OIMwY/values/test!B2:M9?majorDimension=COLUMNS&key="
api_key = my_api_key
# f-stringでつなげる
full_url = f"{api_url}{api_key}"

# 保存先ファイル名
raw_file = "./input_data/raw_data.json"
buckup_file = "./input_data/buckup_data.json"

#buckupファイルの作成
def clone_file(raw_file,buckup_file):
    with open(raw_file, "r", encoding="utf-8") as file1:
        data = json.load(file1)
    
    with open(buckup_file, 'w' ,encoding='utf-8') as file2:
        json.dump(data, file2, ensure_ascii=False, indent=4)

    print(f"データを{buckup_file}にクローンしました")

def fetch_google_sheet_data(api_url, raw_file):
    try:
        # apiリクエスト
        response = requests.get(api_url)

        # JSON取得
        data = response.json()
        
        # データを指定されたファイルに保存
        #指定したファイルをw(write mode)で開く
        #dump = ファイルの書き込み
        #indent=4 インデント距離
        with open(raw_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)
        
        print(f"データを {raw_file} に保存しました。")

    except requests.exceptions.RequestException as e:
        print(f"データ取得エラー: {e}")

if os.path.exists(raw_file):
    clone_file(raw_file,buckup_file)
else:
    print(f"{raw_file}が存在しません。")
 
sheet_data = fetch_google_sheet_data(full_url, raw_file)
