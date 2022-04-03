import { useRecoilValue } from "recoil";

import { searchTreeData } from "../../../../store/adminAtoms";

export const SearchResult = () => {
  const treeData = useRecoilValue(searchTreeData);
  if (Object.keys(treeData).length > 0) {
    return (
      <div style={{ display: "flex" }}>
        <img
          src={treeData.image[0]}
          alt=""
          style={{
            height: "300px",
            width: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
        <div style={{ paddingLeft: "20px", paddingTop: "20px" }}>
          <p style={{ fontSize: "24px" }}>Sapling ID : {treeData.sapling_id}</p>
          <p style={{ fontSize: "14px" }}>
            Date Added : {treeData.date_added.slice(0, 10)}
          </p>
          <p style={{ fontSize: "14px" }}>
            Tree name : {treeData.tree_id.name}
          </p>
          <p style={{ fontSize: "14px" }}>
            Plot name : {treeData.plot_id.name}
          </p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
