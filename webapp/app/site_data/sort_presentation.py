'''
# presentation.yml を日付降順にソートして presentation_sorted.yml に保存するスクリプト
# 'detail' フィールドはブロック形式（>）で保存するようにカスタマイズ
'''
import yaml
import os
from datetime import datetime
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
input_file = os.path.join(BASE_DIR, "presentation.yml")
output_file = os.path.join(BASE_DIR, "presentation_sorted.yml")

# 1. ブロック形式（>）で出力させたい文字列のためのカスタムクラスを定義
class FoldedScalarString(str):
    pass

# 2. そのクラスをどうYAML出力するかを定義する関数（style='>'を指定）
def folded_scalar_representer(dumper, data):
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='>')

# 3. PyYAMLにその設定を登録
yaml.add_representer(FoldedScalarString, folded_scalar_representer)



def parse_date(d):
    """
    日付オブジェクトあるいは文字列を datetime に変換して比較可能にする
    """
    return datetime.strptime(str(d), "%Y-%m-%d")

# YAML の読み込み
with open(input_file, "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)

# 並べ替え（date 昇順 -> reversedで降順）
data_sorted = list(reversed(sorted(data, key=lambda x: parse_date(x["date"]))))

# 4. 'detail' キーの中身をカスタムクラスに変換する
for item in data_sorted:
    if "detail" in item and item["detail"]:
        # ここで通常のstrからFoldedScalarStringに変換することで、
        # dump時に > 形式が適用されるようになります。
        item["detail"] = FoldedScalarString(item["detail"])

# YAML として出力
with open(output_file, "w", encoding="utf-8") as f:
    # width=1000 等を指定しておくと、短い幅での勝手な改行を防げます
    yaml.dump(
        data_sorted, 
        f, 
        allow_unicode=True, 
        sort_keys=False, 
        width=1000
    )

print("Sorted YAML saved to", output_file)