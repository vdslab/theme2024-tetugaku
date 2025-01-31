import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import "./SearchAndFilter.css";
import { RedSwitch, BlueSwitch, GreenSwitch, OrangeSwitch } from "./SwitchColor";

function SearchAndFilter({
  processed_data,
  selectNode,
  selectGroup,
  renderComplete,
  setStateM,
  setStateN,
  setStateU,
  setStateA,
}) {
  const [searchName, setSearchName] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [key, setKey] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedModes, setSelectedModes] = useState([]);

  const philosopherOptions = processed_data.names.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedPhilosopher(selectedOption);
      setSearchName(selectedOption.value);
    } else {
      setSelectedPhilosopher(null); // 選択解除
      setSearchName(""); // プレースホルダーを表示させるために空文字を設定
    }
    // 再レンダリングを強制するためにkeyを更新
    setKey((prevKey) => prevKey + 1);
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setSearchName(inputValue);
    }
    // inputValueが空欄になったが、メニューを閉じていない状態(文字を削除しただけの状態)
    if (action !== "menu-close" && inputValue === "") {
      setSelectedPhilosopher(null); // 不要な場合はコメントアウト
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

  // 関係性のオプション
  const modeOptions = [
    { value: "M", label: "師弟", fullLabel: "師弟関係" },
    { value: "N", label: "批判", fullLabel: "批判的関係" },
    { value: "U", label: "弁証", fullLabel: "弁証法的関係" },
    { value: "A", label: "肯定", fullLabel: "肯定的関係" },
  ];

  const getSwitchByValue = (value, isSelected, onChange) => {
    switch (value) {
      case "M":
        return <RedSwitch checked={isSelected} onChange={onChange} />;
      case "N":
        return <BlueSwitch checked={isSelected} onChange={onChange} />;
      case "U":
        return <GreenSwitch checked={isSelected} onChange={onChange} />;
      case "A":
        return <OrangeSwitch checked={isSelected} onChange={onChange} />;
    }
  };

  const SwitchOption = (props) => {
    const { isSelected, data, selectOption } = props;

    // Switch クリック時のハンドラ
    const handleSwitchChange = () => {
      selectOption(data);
    };

    return (
      <components.Option {...props}>
        {getSwitchByValue(data.value, isSelected, handleSwitchChange)}
        <span style={{ marginLeft: 8 }}>{data.fullLabel}</span>
      </components.Option>
    );
  };

  const handleModeChange = (selectedArray) => {
    const current = selectedArray || [];
    setSelectedModes(current);
    setStateM(current.some((o) => o.value === "M"));
    setStateN(current.some((o) => o.value === "N"));
    setStateU(current.some((o) => o.value === "U"));
    setStateA(current.some((o) => o.value === "A"));
  };

  // 思想家＆グループ用のセレクトスタイル（通常のもの）
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

  // 関係性のセレクトスタイル（横スクロールを許可＋ホバーはデフォルト色、選択は透明）
  const customStyles2 = {
    container: (base) => ({
      ...base,
      width: "300px",
    }),
    control: (base) => ({
      ...base,
      width: "300px",
    }),
    valueContainer: (base) => ({
      ...base,
      display: "flex",
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
    }),
    multiValue: (base) => ({
      ...base,
      margin: "2px 4px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      whiteSpace: "nowrap",
      overflow: "visible",
      textOverflow: "clip",
      maxWidth: "none",
    }),
  
    // ▼ ここがポイント
    option: (base, { isFocused, isSelected }) => ({
      ...base,
    
      // 選択されているときだけ背景を透明に
      backgroundColor: isSelected ? "transparent" : base.backgroundColor,
    
      // 文字色は常に React-Select のデフォルトを使う
      color: "black",
    
      // マウスダウン時の反転も透明にしたい場合
      ":active": {
       backgroundColor: "transparent",
      },
    }),
    
  };
  

  // 選択された思想家のIDを反映
  useEffect(() => {
    if (!selectedPhilosopher) return;
    processed_data.names.forEach((t) => {
      if (t.name === selectedPhilosopher.value) {
        selectNode(t.name_id);
      }
    });
  }, [selectedPhilosopher, processed_data, selectNode]);

  // 選択されたグループIDを反映
  useEffect(() => {
    if (!selectedGroup) return;
    selectGroup(selectedGroup.value);
  }, [selectedGroup, selectGroup]);

  return (
    <div className="select-container">
      {/* 思想家を選択 */}
      <Select
        key={key}
        options={philosopherOptions}
        value={selectedPhilosopher}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        inputValue={searchName}
        placeholder="思想家を選んでください"
        isClearable
        styles={customStyles}
        isDisabled={!renderComplete}
      />

      
      {/* グループを選択 */}
      <Select
        options={groupOptions}
        value={selectedGroup}
        onChange={handleGroupChange}
        placeholder="グループを選んでください"
        isClearable
        isSearchable={false}
        styles={customStyles}
      />

      {/* 関係性の選択 */}
      <Select
        options={modeOptions}
        value={selectedModes}
        onChange={handleModeChange}
        placeholder="関係性を選択してください"
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option: SwitchOption }} // カスタムOptionを差し込む
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        styles={customStyles2}
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
        isSearchable={false}
      />
    </div>
  );
}

export default SearchAndFilter;
