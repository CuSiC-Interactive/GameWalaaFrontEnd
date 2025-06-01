import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./AdminDashboard.css";
import SideBar from "./SideBar";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("add");

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = () => {};

  useEffect(() => {
    reset();
  }, [activeTab]);

  return (
    <div className="admin-wrapper">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel */}
      <main className="admin-main">
        {activeTab === "add" && (
          <div className="card">
            <h2 className="card-title">Add New Game</h2>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-actions">
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  {...register("gameName", { required: true })}
                ></input>
                <label className="form-label">Price</label>
                <input
                  className="form-input"
                  {...register("gamePrice", { required: true })}
                ></input>
                <label className="form-label"></label>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "update" && <div>heyy</div>}
      </main>
    </div>
  );
};

export default AdminDashboard;
