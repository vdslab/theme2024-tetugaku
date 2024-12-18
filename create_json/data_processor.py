import json

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
        "keywords": []
    }

    for row in rows:
        row_dict = dict(zip(headers, row))
        
        # 1. name
        result["names"].append({
            "name_id": row_dict["name_id"],
            "name": row_dict["name"]
        })
    
    with open(file, 'w' ,encoding='utf-8') as file:
        json.dump(result, file, ensure_ascii=False, indent=4)  

    return result

data = fetch_data()

process_json(data,processed_file)



