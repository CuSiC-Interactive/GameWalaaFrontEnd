import "./SideBar.css";

export type sideBarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const sideBar = ({ activeTab, setActiveTab }: sideBarProps) => {
  return (
    <aside className="sideBar">
      <h1 className="title">Admin Console</h1>
      <nav className="nav">
        <button
          className={`sidebar-tab ${activeTab === "add" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add{" "}
        </button>
        <button
          className={`sidebar-tab ${
            activeTab === "update" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("update")}
        >
          ✏️ Update{" "}
        </button>
      </nav>
    </aside>
  );
};

export default sideBar;
