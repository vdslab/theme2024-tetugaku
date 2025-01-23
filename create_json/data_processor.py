import json
import ast

processed_file = "./output_data/processed_data.json"

def fetch_data():
    with open("./input_data/raw_data.json", 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# データ処理
def process_json(data,file):
    headers = data['values'][0]
    rows = data['values'][1:]

    result = {
        "names": [],
        "nodes": [],
        "links": [],
        "keywords": [],
        "books": []
    }

    for row in rows:
        # headersとrowを結び付ける
        row_dict = dict(zip(headers, row))

        # 文字列から配列に変更
        keywords = [item.strip().strip("\"") for item in row_dict["keywords"].split(",")]
        book_ids = ast.literal_eval(row_dict["books"])
        target_ids = ast.literal_eval(row_dict["target_id"])
        relations = ast.literal_eval(row_dict["relations"])
        relations_info = ast.literal_eval(row_dict["relations_info"])

        # 文字列を数値に変換
        name_id = int(row_dict["name_id"])
        group_id = int(row_dict["group_id"])

        fixed_targets_ids = []

        fixed_targets_ids.extend([
            int(target)
            for target in target_ids
        ])

        # namesの作成
        result["names"].append({
            "name_id": name_id,
            "name": row_dict["name"]
        })
    
        # nodesの作成
        result["nodes"].append({
            "id": name_id,
            "group": group_id,
            "group_name": row_dict["group_name"],
            "information": row_dict["information"]
        })

        # linksの作成
        result["links"].extend([
            {
                "source" : name_id,
                "target" : fixed_targets_ids[i],
                "relation_id" : relations[i],
                "relation_info":relations_info[i]
            }
            for i in range(len(fixed_targets_ids))
        ])

        # keywordsの作成
        result["keywords"].extend([
            {
                "name_id" : name_id,
                "keyword": keyword
            }
            for keyword in keywords
        ])

        # booksの作成
        result["books"].extend([
            {
                "name_id" : name_id,
                "book_id": book_id
            }
            for book_id in book_ids
        ])

    # データをファイルに保存
    with open(file, 'w', encoding='utf-8') as file:
        json.dump(result, file, ensure_ascii=False, indent=4)

    return result

data = fetch_data()
process_json(data,processed_file)
