import React, { useEffect, useState } from "react";
import Select from "react-select";

function SearchAndFilter({ processed_data, selectNode }) {
  const [searchName, setSearchName] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [key, setKey] = useState(0); // 再レンダリング用のkeyを管理

  const [selectedGroup, setSelectedGroup] = useState(null);

  //思想家選択用オプション
  const options = processed_data.names.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  //思想家選択用イベントハンドラ
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedPhilosopher(selectedOption);
      setSearchName(selectedOption.value);
    } else {
      setSelectedPhilosopher(null);  // 選択解除
      setSearchName("");             // プレースホルダーを表示させるために空文字を設定
    }
    // 再レンダリングを強制するためにkeyを更新
    setKey((prevKey) => prevKey + 1);
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === 'input-change') {
      setSearchName(inputValue);
    }
    // inputValueが空欄になったが、メニューを閉じていない状態(文字を削除しただけの状態)
    if (action !== 'menu-close' && inputValue === '') {
      setSelectedPhilosopher(null);  // 不要な場合はコメントアウト  
    }
    // メニューを閉じた時に選択がなければプレースホルダーを表示する
    if (action === "menu-close" && !selectedPhilosopher) {
      setSearchName(""); // プレースホルダーの表示用に入力欄を空にする
    }
  };


  //グループ選択用オプション
  const groupMap = new Map();
  processed_data.nodes.forEach((node) => {
    if (!groupMap.has(node.group)) {
      groupMap.set(node.group, node.group_name);
    }
  });

  // Mapから { value, label } の形式に変換
  const groupOptions = Array.from(groupMap).map(([grp, grpName]) => ({
    value: grp,
    label: grpName, // group_name をラベルに表示
  }));

  //グループ選択用イベントハンドラ
  const handleGroupChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedGroup(selectedOption);
    } else {
      setSelectedGroup(null);
    }
  };

  // スタイル
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "200px",
    }),
    control: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  useEffect(() => {
    if(!selectedPhilosopher)return;
    processed_data.names.forEach(t => {
      if (t.name === selectedPhilosopher.value) {
        selectNode(t.name_id);
      }
    });
  }, [selectedPhilosopher]);

  return (
    <>
      {/* 思想家を選択 */}
      <div>
        <Select
          // keyを変更して再マウント
          key={key}
          options={options}
          value={selectedPhilosopher}
          onChange={handleSelectChange}
          onInputChange={handleInputChange}
          inputValue={searchName}
          placeholder="思想家を選んでください"
          isClearable
          styles={customStyles}
        />
      </div>

      {/* グループを選択 */}
      <div>
        <Select
          options={groupOptions}
          value={selectedGroup}
          onChange={handleGroupChange}
          placeholder="グループを選んでください"
          isClearable
          isSearchable={false}
          styles={customStyles}
        />
      </div>
    </>
  );
}

export default SearchAndFilter;