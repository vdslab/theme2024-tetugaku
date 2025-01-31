import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { Switch } from "@mui/material"; // MUI Switch
import "./SearchAndFilter.css";

function SearchAndFilter({
  processed_data,
  selectNode,
  selectGroup,
  renderComplete,
  setStateM,
  setStateN,
  setStateU,
  setStateA,
  stateM,
  stateN,
  stateU,
  stateA,
}) {
  const [searchName, setSearchName] = useState("");
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [key, setKey] = useState(0); // 再レンダリング用のkeyを管理

  const [selectedGroup, setSelectedGroup] = useState(null);

  // エッジのモード選択
  const [selectedModes, setSelectedModes] = useState([]);

  const philosopherOptions = processed_data.names.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  //思想家選択用イベントハンドラ
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

  // ▼ M, N, U, A の複数選択オプション
  const modeOptions = [
    { value: "M", label: "師弟関係" },
    { value: "N", label: "批判的影響" },
    { value: "U", label: "弁証法的影響" },
    { value: "A", label: "肯定的影響" },
  ];

  // ▼ react-selectで、選択肢をクリックするときに表示するカスタムOption
  //    各OptionにMUIのSwitchを置いています
  const SwitchOption = (props) => {
    const { children, isSelected, data, selectOption } = props;
    return (
      <components.Option {...props}>
        <Switch
          checked={isSelected}
          onChange={() => selectOption(data)}
          color="primary"
        />
        <span style={{ marginLeft: 8 }}>{children}</span>
      </components.Option>
    );
  };

  // ▼ Switchを複数選択した結果を stateM, stateN, stateU, stateA に反映
  const handleModeChange = (selectedArray) => {
    const current = selectedArray || [];
    setSelectedModes(current);

    setStateM(current.some((o) => o.value === "M"));
    setStateN(current.some((o) => o.value === "N"));
    setStateU(current.some((o) => o.value === "U"));
    setStateA(current.some((o) => o.value === "A"));
  };

  // ▼ 選択したアイテムをメインのコントロールに表示しないためのカスタムコンポーネント
  //    これで「タグ」を非表示にしてしまう
  const MultiValue = () => null;

  // ▼ もし何も選択されていないときはプレースホルダーを出し、
  //    1つでも選択されていたらプレースホルダーを消す
  const Placeholder = (props) => {
    // 既に何か選択されているなら、プレースホルダーは表示しない
    // if (props.selectProps.value && props.selectProps.value.length) {
    //   return null;
    // }
    // 何も選択されていないときは、標準のPlaceholderを返す
    return <components.Placeholder {...props} />;
  };

  // ▼ react-selectのスタイル調整
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

  // 選択した思想家のidを送信する処理の作成
  useEffect(() => {
    if (!selectedPhilosopher) return;
    processed_data.names.forEach((t) => {
      if (t.name === selectedPhilosopher.value) {
        selectNode(t.name_id);
      }
    });
  }, [selectedPhilosopher]);

  // 選択したグループのidを送信する処理の作成
  useEffect(() => {
    if (!selectedGroup) return;
    selectGroup(selectedGroup.value);
  }, [selectedGroup]);

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

      {/* 有向エッジのタイプを選択 */}
      <Select
        options={modeOptions}
        value={selectedModes}
        onChange={handleModeChange}
        placeholder="影響の種類を選択してください"
        isMulti
        closeMenuOnSelect={false}  // Switchクリックでメニューが閉じないように
        hideSelectedOptions={false}
        components={{
          Option: SwitchOption,
          MultiValue,
          Placeholder,
        }}
        styles={customStyles}
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
      />
    </div>
  );
}

export default SearchAndFilter;
