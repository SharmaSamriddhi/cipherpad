import React, { useState } from "react";

const Nav2 = ({
  userData,
  pageName,
  isView,
  toggleEdit,
  editModal,
  onDelete,
  toggleSidebar,
  isProfile,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  return (
    <div
      className={`flex justify-between items-center bg-white p-4 lg:px-8 lg:h-16 border ${
        isView ? "lg:hidden" : ""
      }`}
    >
      <div className="flex gap-2">
        <div
          className="lg:hidden bg-slate-400 text-white px-2 p-1 h-8 flex justify-center items-center w-8 rounded"
          onClick={() => toggleSidebar()}
        >
          <i class="fa-solid fa-bars"></i>
        </div>
        {pageName ? (
          <div className="text-lg lg:text-2xl font-semibold truncate overflow-auto">
            {pageName}
            {showTooltip && (
              <div className="absolute z-10 px-2 py-1 mt-1 ml-10 text-xs leading-tight text-white bg-gray-900 rounded shadow">
                {pageName}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2 lg:text-lg rounded border border-slate-200 p-1 px-2 w-4/5 lg:w-full">
            <span className="text-slate-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <span>
              <input
                placeholder="Search Notes..."
                className="focus:outline-none w-5/6 lg:w-full"
              />
            </span>
          </div>
        )}
      </div>
      {!isProfile && (
        <div className="flex gap-5 items-center">
          {!isView && (
            <div className="hidden lg:flex gap-4 lg:text-lg p-1 px-2 w-4/5 lg:w-full">
              <span className="text-slate-600">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <span>
                <input
                  placeholder="Search Notes..."
                  className="focus:outline-none w-5/6 lg:w-full placeholder-slate-600"
                />
              </span>
            </div>
          )}

          <div className="lg:flex flex-col hidden">
            <div className="font-semibold">{userData?.name}</div>
            <div className="text-slate-400 text-xs lg:text-sm">
              {userData?.email}
            </div>
          </div>
          <div className="lg:hidden bg-slate-400 text-white px-2 p-1 h-8 w-8 rounded flex justify-center items-center">
            <i class="fa-solid fa-user"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav2;
