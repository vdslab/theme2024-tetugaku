import React, { useEffect, useState } from "react";
import Select from "react-select";

function SearchAndFilter({ processed_data, selectNode }) {
  const [searchName, setSearchName] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [key, setKey] = useState(0); // 再レンダリング用のkeyを管理

  const options = processed_data.names.map((item) => ({
    value: item.name,
    label: item.name,
  }));

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
    // nullの処理
    if(!selectedPhilosopher)return; 
    processed_data.names.forEach(t => {
      if (t.name === selectedPhilosopher.value) {
        selectNode(t.name_id);
      }
    });
  }, [selectedPhilosopher]);
  
  return (
    <div>
      <Select
        // keyを変更して再マウント
        key={key}
        // 選択オプション
        options={options}
        // 
        value={selectedPhilosopher}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        inputValue={searchName}
        placeholder="思想家を選んでください"
        isClearable
        styles={customStyles}
      />
    </div>
  );
}

export default SearchAndFilter;